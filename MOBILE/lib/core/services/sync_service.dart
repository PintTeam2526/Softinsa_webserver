import 'dart:convert';
import 'dart:async';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:path_provider/path_provider.dart';
import '../database/database_helper.dart';
import '../api_config.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../app_state.dart';

import '../models/learningPaths_model.dart';
import '../models/serviceLines_model.dart';
import '../models/areas_model.dart';
import '../models/consultores_model.dart';
import '../models/badges_model.dart';
import '../models/badgesConcluidos_model.dart';
import '../models/objetivos_model.dart';
import '../models/notificacoes_model.dart';
import '../models/pedidosBadge_model.dart';
import '../models/estados_model.dart';
import '../models/historicoPedidos_model.dart';
import '../models/requisitos_model.dart';
import '../models/documentacao_model.dart';
import '../models/conquistas_model.dart';
import '../models/conquistasConsultores_model.dart';
import '../models/badgesRecomendados_model.dart';
import '../models/badgesFavoritos_model.dart';

// PROVIDER ÚNICO (SINGLETON)
final syncServiceProvider = Provider((ref) => SyncService.instance);

class SyncService {
  SyncService._internal();
  static final SyncService instance = SyncService._internal();

  final _db = DatabaseHelper.instance;
  final String _baseUrl = ApiConfig.baseUrlApi;

  static Future<void>? _ongoingSync;
  static int? _syncingUserId;
  final Set<String> _syncingTables = {}; 

  static final _syncController = StreamController<String>.broadcast();
  Stream<String> get syncStream => _syncController.stream;

  Future<String> _saveImageLocally(String? base64String, String folder, String fileName) async {
    if (base64String == null || base64String.isEmpty || base64String == "null") return "";
    if (base64String.startsWith('/')) return base64String;

    try {
      final bytes = base64Decode(base64String.contains(',') ? base64String.split(',').last : base64String);
      final directory = await getApplicationDocumentsDirectory();
      final path = Directory('${directory.path}/images/$folder');
      if (!await path.exists()) await path.create(recursive: true);
      final file = File('${path.path}/$fileName.png');
      await file.writeAsBytes(bytes);
      return file.path;
    } catch (e) { return ""; }
  }

  Future<void> syncAll(int idConsultor) async {
    if (_ongoingSync != null && _syncingUserId == idConsultor) {
       _pushAllPending(idConsultor);
       return _ongoingSync;
    }
    _syncingUserId = idConsultor;
    _ongoingSync = _performSync(idConsultor);
    try {
      await _ongoingSync;
    } finally {
      if (_syncingUserId == idConsultor) _ongoingSync = null;
    }
  }

  Future<void> _pushAllPending(int idConsultor) async {
    if (idConsultor <= 0) return;
    print(">>> [SYNC] Iniciando PUSH de dados pendentes...");
    await pushPendingData('badgesFavoritos', '/badges/favorito/set', 'ID_BADGE', idConsultor: idConsultor, force: true);
    await pushPendingData('objetivos', '/objetivos/adicionar', 'ID_OBJETIVO', idConsultor: idConsultor, force: true);
    await pushPendingData('pedidosBadge', '/candidaturas/candidatar', 'ID_PEDIDO_BADGE', idConsultor: idConsultor, force: true);
  }

  Future<void> _performSync(int idConsultor) async {
    print(">>> [SYNC] Sincronização GLOBAL iniciada para Consultor $idConsultor...");
    try {
      if (idConsultor > 0) await _pushAllPending(idConsultor);

      final globalTables = ['learningPaths', 'serviceLines', 'areas', 'badges', 'requisitos', 'estados'];
      for (var table in globalTables) {
        if (_syncingUserId != idConsultor) break;
        await syncTableByName(table);
      }

      if (idConsultor > 0) {
        final privateTables = [
          'consultores', 'badgesConcluidos', 'objetivos', 'notificacoes', 
          'pedidosBadge', 'historicoPedidos', 'documentacoes', 
          'conquistas', 'conquistasConsultores', 'badgesRecomendados', 'badgesFavoritos'
        ];
        for (var table in privateTables) {
          if (_syncingUserId != idConsultor) break;
          await syncTableByName(table, idConsultor: idConsultor);
        }
      }
    } catch (e) { print(">>> [SYNC] Erro no sync global: $e"); }
  }

  Future<void> syncTableByName(String tableName, {int? idConsultor, bool force = false, bool ignoreLastUpdate = false}) async {
    if (_syncingTables.contains(tableName) && !force) return;
    if (!force) _syncingTables.add(tableName);

    try {
      String? endpoint;
      bool shouldIgnoreLastUpdate = ignoreLastUpdate || force;

      switch (tableName) {
        case 'learningPaths': endpoint = '/syncMobile/learningpaths'; break;
        case 'serviceLines': endpoint = '/syncMobile/servicelines'; break;
        case 'areas': endpoint = '/syncMobile/areas'; break;
        case 'badges': endpoint = '/syncMobile/badges'; break;
        case 'requisitos': endpoint = '/syncMobile/requisitos'; break;
        case 'estados': endpoint = '/syncMobile/estados'; break;
        case 'conquistas': if (idConsultor != null) endpoint = '/conquistas/mobile/get/$idConsultor'; break;
        case 'consultores': if (idConsultor != null) endpoint = '/consultores/info/$idConsultor'; break;
        case 'badgesConcluidos': if (idConsultor != null) endpoint = '/syncMobile/badgesConcluidos/$idConsultor'; break;
        case 'objetivos': if (idConsultor != null) endpoint = '/syncMobile/objetivos/$idConsultor'; break;
        case 'notificacoes': if (idConsultor != null) endpoint = '/syncMobile/notificacoes/$idConsultor'; break;
        case 'pedidosBadge': if (idConsultor != null) endpoint = '/syncMobile/pedidosBadges/$idConsultor'; break;
        case 'historicoPedidos': if (idConsultor != null) endpoint = '/syncMobile/historicoPedidos/$idConsultor'; break;
        case 'documentacoes': if (idConsultor != null) endpoint = '/syncMobile/documentacoes/$idConsultor'; break;
        case 'conquistasConsultores': if (idConsultor != null) endpoint = '/syncMobile/conquistasConsultores/$idConsultor'; break;
        case 'badgesRecomendados':
          if (idConsultor != null) {
            endpoint = '/badges/recomendados';
            shouldIgnoreLastUpdate = true;
          }
          break;
        case 'badgesFavoritos': if (idConsultor != null) endpoint = '/syncMobile/badges/favoritos/$idConsultor'; break;
      }

      if (endpoint != null) {
        await _syncTable(tableName: tableName, endpoint: endpoint, idConsultor: idConsultor, ignoreLastUpdate: shouldIgnoreLastUpdate);
      }
    } finally { if (!force) _syncingTables.remove(tableName); }
  }

  Future<void> _syncTable({required String tableName, required String endpoint, int? idConsultor, bool ignoreLastUpdate = false}) async {
    try {
      String? lastUpdate = ignoreLastUpdate ? null : await _db.getLastUpdate(tableName, idConsultor: idConsultor);
      String url = '$_baseUrl$endpoint';
      if (lastUpdate != null && lastUpdate.isNotEmpty) url += '/${Uri.encodeComponent(_formatDateForApi(lastUpdate))}';

      final prefs = await SharedPreferences.getInstance();
      final String? token = AppState().tokenLogin.isNotEmpty ? AppState().tokenLogin : prefs.getString('token');

      final response = await http.get(Uri.parse(url), headers: {
        if (token != null) HttpHeaders.authorizationHeader: 'Bearer $token',
      }).timeout(Duration(seconds: (tableName == 'badges' || tableName == 'badgesRecomendados') ? 120 : 50));

      if (response.statusCode >= 200 && response.statusCode < 300) {
        dynamic decoded = jsonDecode(response.body);
        
        List<dynamic> remoteData;
        if (tableName == 'badgesRecomendados' && decoded is Map && decoded.containsKey('recomendados')) {
          remoteData = [
            ...(decoded['recomendados'] is List ? decoded['recomendados'] : []),
            ...(decoded['restantes'] is List ? decoded['restantes'] : [])
          ];
        } else {
          remoteData = (decoded is List) ? decoded : (decoded is Map && decoded.containsKey('data')) ? decoded['data'] : [decoded];
        }

        bool hasChanges = false;
        for (var item in remoteData) {
          if (item == null) continue;
          Map<String, dynamic> row = await _mapModelToTableWithFiles(tableName, item, idConsultor);
          if (row.isNotEmpty) {
            final String serverDate = item['updatedAt'] ?? item['updated_at'] ?? DateTime.now().toUtc().toIso8601String();
            await _db.upsert(tableName, {...row, 'sync_status': 'synced', 'updated_at': serverDate});
            hasChanges = true;
          }
        }
        if (hasChanges) _syncController.add(tableName);
      }
    } catch (e) { print(">>> [SYNC] Erro GET $tableName: $e"); }
  }

  Future<Map<String, dynamic>> _mapModelToTableWithFiles(String tableName, dynamic item, int? idConsultor) async {
    try {
      switch (tableName) {
        case 'consultores':
          var m = ConsultoresModel.fromJson(item);
          return m.copyWith(imagemPerfil: await _saveImageLocally(m.imagemPerfil, 'perfil', 'user_${m.id}')).toMap();
        case 'learningPaths':
          final m = LearningPathsModel.fromJson(item);
          return {'ID_LEARNINGPATH': m.id, 'NOME_LEARNINGPATH': m.nome, 'DESCRICAO_LEARNINGPATH': m.descricao, 'IMAGEM_LEARNING_PATH': await _saveImageLocally(m.imagem, 'lp', 'lp_${m.id}'), 'ESTADO_A_I_': m.estado_a_i ? 1 : 0, 'DATA_INSERCAO': m.data_insercao};
        case 'serviceLines':
          final m = ServiceLinesModel.fromJson(item);
          return {'ID_SERVICELINE': m.id, 'ID_LEARNINGPATH': m.id_learning_path, 'NOME_SERVICELINE': m.nome, 'DESCRICAO_SERVICELINE': m.descricao, 'IMAGEM_SERVICE_LINE': await _saveImageLocally(m.imagem, 'sl', 'sl_${m.id}'), 'ESTADO_A_I_': m.estado_a_i ? 1 : 0, 'DATA_INSERCAO': m.data_insercao, 'NOME_LP_PAI': m.nome_learning_path_pai ?? ''};
        case 'areas':
          final m = AreasModel.fromJson(item);
          return {'id_area': m.id, 'id_service_line': m.id_service_line, 'nome_area': m.nome, 'descricao_area': m.descricao, 'imagem_area': await _saveImageLocally(m.imagem, 'areas', 'area_${m.id}'), 'estado_a_i': m.estado_a_i ? 1 : 0, 'data_insercao': m.data_insercao, 'nome_service_line': m.nome_service_line_pai ?? ''};
        case 'badges':
          final m = BadgesModel.fromJson(item);
          return {'ID_BADGE': m.id, 'ID_AREA': m.id_area, 'NOME_BADGE': m.nome, 'DESCRICAO_BADGE': m.descricao, 'PONTOS_BADGE': m.pontos, 'PAGO': m.pago_S_N ? 1 : 0, 'NIVEL_BADGE': m.nivel, 'IMAGEM_BADGE': await _saveImageLocally(m.imagem, 'badges', 'badge_${m.id}'), 'nome_area_pai': m.nome_area_pai ?? '', 'ESTADO_A_I_': m.estado_a_i ? 1 : 0, 'DATA_INSERCAO': m.data_insercao};
        case 'requisitos':
          final m = RequisitosModel.fromJson(item);
          return {'ID_REQUISITO': m.id, 'ID_BADGE': m.id_badge, 'NOME_REQUISITO': m.nome, 'DESCRICAO_REQUISITO': m.descricao, 'IMAGEM_REQUISITO': await _saveImageLocally(m.imagem, 'requisitos', 'req_${m.id}'), 'ESTADO_A_I_': m.estado_a_i ? 1 : 0};
        case 'badgesConcluidos':
          final m = BadgesConcluidosModel.fromJson(item);
          return {'ID_BADGE_CONCLUIDO': m.idBadgeConcluido, 'ID_CONSULTOR': idConsultor ?? m.idBadgeConcluido, 'ID_BADGE': m.idBadge, 'NOME_BADGE': m.nomeBadge, 'nome_area_pai': m.nomeAreaPai, 'NIVEL_BADGE': m.nivelBadge, 'PONTOS_BADGE': m.pontosBadge, 'IMAGEM_BADGE': await _saveImageLocally(m.imagemBadge, 'badges_concluidos', 'bc_${m.idBadgeConcluido}'), 'DATA_CONCLUSAO': m.dataConclusao, 'VALIDADE': m.validadeDias, 'nome_sl_pai': m.nomeServiceLine};
        case 'objetivos':
          final m = ObjetivosModel.fromJson(item);
          return {'ID_OBJETIVO': m.id, 'ID_BADGE': m.id_badge, 'ID_CONSULTOR': idConsultor ?? m.id_consultor, 'NOME_OBJETIVO': m.nome, 'DATA_LIMITE_CONCLUSAO': m.data_limite_conclusao, 'DATA_CONCLUSAO_OBJETIVO': m.data_conclusao_objetivo ?? ''};
        case 'notificacoes':
          final m = NotificacoesModel.fromJson(item);
          return {'ID_NOTIFICACAO': m.idNotificacao, 'ID_CONSULTOR': m.idConsultor, 'NOTIFICACAO': m.notificacao, 'DATA_DE_ENVIO': m.data_de_envio, 'REMETENTE': m.remetente, 'DESCRICAO': m.descricao};
        case 'estados':
          final m = EstadosModel.fromJson(item);
          return {'ID_ESTADO': m.idEstado, 'NOME_ESTADO': m.nome, 'DESCRICAO_ESTADO': m.descricao};
        case 'pedidosBadge':
          final m = PedidosBadgeModel.fromJson(item);
          return {'ID_PEDIDO_BADGE': m.idPedidoBadge, 'ID_CONSULTOR': idConsultor ?? m.idPedidoBadge, 'ID_BADGE': m.idBadge, 'ESTADO_ATUAL': m.idEstadoAtual};
        case 'historicoPedidos':
          final m = HistoricoPedidosModel.fromJson(item);
          return {'ID_HISTORICO': m.idHistorico, 'ID_BADGE': m.idBadge, 'ID_CONSULTOR': idConsultor ?? m.idConsultor, 'DATA': m.data};
        case 'documentacoes':
          final m = DocumentacaoModel.fromJson(item);
          return {'ID_DOCUMENTACAO': m.id, 'ID_HISTORICO': m.id_historico, 'ID_CONSULTOR': idConsultor ?? m.id_consultor, 'DOCUMENTACAO': m.documentacao};
        case 'conquistas':
          final m = ConquistasModel.fromJson(item);
          return m.toMap();
        case 'conquistasConsultores':
          final m = ConquistasConsultoresModel.fromJson(item);
          return {'ID_CONQUISTA_CONSULTOR': m.id_conquista_consultor, 'ID_CONSULTOR': idConsultor ?? m.id_consultor, 'ID_CONQUISTA': m.id_conquista};
        case 'badgesRecomendados':
          final m = BadgesRecomendadosModel.fromJson(item);
          return {
            'ID_BADGE': m.idBadge,
            'ID_CONSULTOR': idConsultor,
            'NOME_BADGE': m.nomeBadge,
            'IMAGEM_BADGE': await _saveImageLocally(m.imagemBadge, 'recomendados', 'rec_${m.idBadge}')
          };
        case 'badgesFavoritos':
          final m = BadgesFavoritosModel.fromJson(item);
          return {'ID_BADGE': m.id, 'FAVORITO': m.setFavorito != null ? 1 : 0};
        default: return {};
      }
    } catch (e) { return {}; }
  }

  Future<void> pushPendingData(String tableName, String endpoint, String idColumn, {int? idConsultor, bool force = false}) async {
    final prefs = await SharedPreferences.getInstance();
    final String token = AppState().tokenLogin.isNotEmpty ? AppState().tokenLogin : (prefs.getString('token') ?? "");
    if (token.isEmpty) return;
    
    if (_syncingTables.contains(tableName) && !force) return;
    if (!force) _syncingTables.add(tableName);

    bool pushed = false;
    try {
      final pending = await _db.getPendingSync(tableName);
      if (pending.isEmpty) return;

      for (var row in pending) {
        try {
          final localId = row[idColumn];
          Map<String, dynamic> body = _mapRowToApi(tableName, row);
          
          final response = await http.post(Uri.parse('$_baseUrl$endpoint'), headers: {
            'Content-Type': 'application/json',
            HttpHeaders.authorizationHeader: 'Bearer $token'
          }, body: jsonEncode(body)).timeout(const Duration(seconds: 15));

          if (response.statusCode >= 200 && response.statusCode < 300 || response.statusCode == 409) {
            final db = await _db.database;
            if (tableName == 'badgesFavoritos') {
              await db.update(tableName, {'sync_status': 'synced'}, where: '$idColumn = ?', whereArgs: [localId]);
            } else {
              await db.delete(tableName, where: '$idColumn = ?', whereArgs: [localId]);
            }
            pushed = true;
          }
        } catch (e) { }
      }
    } finally {
      if (!force) _syncingTables.remove(tableName);
      if (pushed) _syncController.add(tableName); // Notifica a UI que a tabela mudou (sync_status atualizado)
      if (pushed && idConsultor != null) await syncTableByName(tableName, idConsultor: idConsultor, force: true);
    }
  }

  Map<String, dynamic> _mapRowToApi(String tableName, Map<String, dynamic> row) {
    switch (tableName) {
      case 'objetivos': return {'idBadge': row['ID_BADGE'], 'idConsultor': row['ID_CONSULTOR'], 'nomeBadge': row['NOME_OBJETIVO'], 'dataLimiteConclusao': row['DATA_LIMITE_CONCLUSAO']?.contains('/') ? row['DATA_LIMITE_CONCLUSAO'].split('/').reversed.join('-') : row['DATA_LIMITE_CONCLUSAO']};
      case 'pedidosBadge': return {'idBadge': row['ID_BADGE'], 'idConsultor': row['ID_CONSULTOR'], 'SessaoID': row['SESSAO_ID']};
      case 'documentacoes': return {'documentacao': row['DOCUMENTACAO'], 'sessaoId': row['SESSAO_ID']};
      case 'badgesFavoritos': return {'id_badge': row['ID_BADGE'], 'set': row['FAVORITO'] == 1};
      default: return Map<String, dynamic>.from(row)..remove('sync_status')..remove('updated_at');
    }
  }

  String _formatDateForApi(String isoDateString) {
    try {
      return DateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").format(DateTime.parse(isoDateString).toUtc());
    } catch (e) { return DateTime.now().toUtc().toIso8601String(); }
  }
}
