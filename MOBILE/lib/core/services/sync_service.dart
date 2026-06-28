import 'dart:convert';
import 'dart:async';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../database/database_helper.dart';
import '../api_config.dart';
import 'package:shared_preferences/shared_preferences.dart';

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

// PROVIDER ÚNICO (SINGLETON)
final syncServiceProvider = Provider((ref) => SyncService.instance);

class SyncService {
  // SINGLETON PATTERN
  SyncService._internal();
  static final SyncService instance = SyncService._internal();

  final _db = DatabaseHelper.instance;
  final String _baseUrl = ApiConfig.baseUrlApi;

  static Future<void>? _ongoingSync;
  static int? _syncingUserId;
  final Set<String> _syncingTables = {}; // Lock por tabela (GET e PUSH)

  static final _syncController = StreamController<String>.broadcast();
  Stream<String> get syncStream => _syncController.stream;

  Future<void> syncAll(int idConsultor) async {
    // Se já houver um sync a correr para o MESMO utilizador, aproveitamos
    if (_ongoingSync != null && _syncingUserId == idConsultor) return _ongoingSync;

    // Se o utilizador mudou ou não há sync, iniciamos um novo
    _syncingUserId = idConsultor;
    _ongoingSync = _performSync(idConsultor);
    
    try {
      await _ongoingSync;
    } finally {
      // Só limpamos o lock se o utilizador não tiver mudado entretanto
      if (_syncingUserId == idConsultor) {
        _ongoingSync = null;
      }
    }
  }

  Future<void> _performSync(int idConsultor) async {
    print(">>> [SYNC] Sincronização GLOBAL iniciada para Consultor $idConsultor...");
    try {
      if (idConsultor > 0) {
        print(">>> [SYNC] A enviar dados pendentes (Push)...");
        await pushPendingData('objetivos', '/objetivos/adicionar', 'ID_OBJETIVO');
        await pushPendingData('documentacoes', '/candidaturas/documentacao', 'ID_DOCUMENTACAO');
        await pushPendingData('pedidosBadge', '/candidaturas/candidatar', 'ID_PEDIDO_BADGE');
      }

      final globalTables = ['learningPaths', 'serviceLines', 'areas', 'badges', 'requisitos', 'estados'];
      for (var table in globalTables) {
        if (_syncingUserId != idConsultor) break; // Aborta se utilizador mudou
        await syncTableByName(table);
      }

      if (idConsultor > 0) {
        final privateTables = ['consultores', 'badgesConcluidos', 'objetivos', 'notificacoes', 'pedidosBadge', 'historicoPedidos', 'documentacoes', 'conquistas', 'conquistasConsultores'];
        for (var table in privateTables) {
          if (_syncingUserId != idConsultor) break; // Aborta se utilizador mudou
          await syncTableByName(table, idConsultor: idConsultor);
        }
      }
      print(">>> [SYNC] Sincronização GLOBAL concluída para Consultor $idConsultor.");
    } catch (e) {
      print(">>> [SYNC] Erro no sync global: $e");
    }
  }

  /// [force] ignora o lock de sincronização
  /// [ignoreLastUpdate] não envia o segmento de data, forçando o download total
  Future<void> syncTableByName(String tableName, {int? idConsultor, bool force = false, bool ignoreLastUpdate = false}) async {
    if (_syncingTables.contains(tableName) && !force) {
       print(">>> [SYNC] Tabela $tableName já está em sincronização. A ignorar...");
       return;
    }
    
    if (!force) _syncingTables.add(tableName);

    try {
      String? endpoint;
      bool isSingle = false;

      switch (tableName) {
        case 'learningPaths': endpoint = '/syncMobile/learningpaths'; break;
        case 'serviceLines': endpoint = '/syncMobile/servicelines'; break;
        case 'areas': endpoint = '/syncMobile/areas'; break;
        case 'badges': endpoint = '/syncMobile/badges'; break;
        case 'requisitos': endpoint = '/syncMobile/requisitos'; break;
        case 'estados': endpoint = '/syncMobile/estados'; break;
        case 'conquistas': 
          if (idConsultor != null) endpoint = '/conquistas/mobile/get/$idConsultor'; 
          break;
        case 'consultores':
          if (idConsultor != null) { endpoint = '/consultores/info/$idConsultor'; isSingle = true; }
          break;
        case 'badgesConcluidos': if (idConsultor != null) endpoint = '/syncMobile/badgesConcluidos/$idConsultor'; break;
        case 'objetivos': if (idConsultor != null) endpoint = '/syncMobile/objetivos/$idConsultor'; break;
        case 'notificacoes': if (idConsultor != null) endpoint = '/syncMobile/notificacoes/$idConsultor'; break;
        case 'pedidosBadge': if (idConsultor != null) endpoint = '/syncMobile/pedidosBadges/$idConsultor'; break;
        case 'historicoPedidos': if (idConsultor != null) endpoint = '/syncMobile/historicoPedidos/$idConsultor'; break;
        case 'documentacoes': if (idConsultor != null) endpoint = '/syncMobile/documentacoes/$idConsultor'; break;
        case 'conquistasConsultores':
          if (idConsultor != null) endpoint = '/syncMobile/conquistasConsultores/$idConsultor';
          break;
      }

      if (endpoint != null) {
        await _syncTable(
          tableName: tableName, 
          endpoint: endpoint, 
          isSingleObject: isSingle, 
          idConsultor: idConsultor,
          ignoreLastUpdate: ignoreLastUpdate
        );
      }
    } finally {
      if (!force) _syncingTables.remove(tableName);
    }
  }

  Future<void> _syncTable({
    required String tableName, 
    required String endpoint, 
    bool isSingleObject = false, 
    int? idConsultor,
    bool ignoreLastUpdate = false
  }) async {
    try {
      String? lastUpdate;
      if (!ignoreLastUpdate) {
        // CORREÇÃO: Passar o idConsultor para obter a data correta para este utilizador
        lastUpdate = await _db.getLastUpdate(tableName, idConsultor: idConsultor);
      }

      String url = '$_baseUrl$endpoint';
      if (lastUpdate != null) {
        url += '/${Uri.encodeComponent(lastUpdate)}';
      }

      // Adicionar timestamp para evitar cache em pedidos forçados
      if (ignoreLastUpdate) {
        url += (url.contains('?') ? '&' : '?') + 'cb=${DateTime.now().millisecondsSinceEpoch}';
      }

      print(">>> [SYNC] Get $tableName (Force: $ignoreLastUpdate, ID: $idConsultor) -> $url");
      
      // BUSCAR TOKEN AS SHARED PREFERENCES
      final prefs = await SharedPreferences.getInstance();
      final String? token = prefs.getString('token');

      final Map<String, String> headers = {};
      if (token != null && token.isNotEmpty) {
        headers[HttpHeaders.authorizationHeader] = 'Bearer $token';
      }

      final response = await http.get(Uri.parse(url), headers: headers).timeout(const Duration(seconds: 15));
      
      if (response.statusCode >= 200 && response.statusCode < 300) {
        dynamic decoded = jsonDecode(response.body);
        List<dynamic> remoteData;

        if (isSingleObject) {
          if (decoded is List) remoteData = decoded;
          else if (decoded is Map && decoded.containsKey('data')) remoteData = decoded['data'] is List ? decoded['data'] : [decoded['data']];
          else if (decoded is Map && (decoded.containsKey('ID_CONSULTOR') || decoded.containsKey('id'))) remoteData = [decoded];
          else remoteData = [decoded];
        } else {
          if (decoded is List) remoteData = decoded;
          else if (decoded is Map && decoded['data'] is List) remoteData = decoded['data'];
          else remoteData = [];
        }

        if (remoteData.isEmpty) {
           print(">>> [SYNC] Tabela $tableName: Sem dados novos.");
           return;
        }

        bool hasChanges = false;
        final now = DateTime.now().toIso8601String();

        for (var item in remoteData) {
          if (item == null) continue;
          try {
            Map<String, dynamic> row = _mapModelToTable(tableName, item, idConsultor);
            if (row.isNotEmpty) {
              // Se o utilizador mudou durante o processamento, abortamos o save
              if (idConsultor != null && _syncingUserId != idConsultor) {
                print(">>> [SYNC] Utilizador mudou durante o sync de $tableName. Abortando save.");
                return;
              }

              if (tableName == 'objetivos' && idConsultor != null) {
                final db = await _db.database;
                await db.delete('objetivos', where: 'ID_BADGE = ? AND ID_CONSULTOR = ? AND sync_status = ?', whereArgs: [row['ID_BADGE'], idConsultor, 'pending']);
              }
              
              await _db.upsert(tableName, {
                ...row, 
                'sync_status': 'synced', 
                'updated_at': now
              });
              hasChanges = true;
            }
          } catch (e) { print("Erro mapeamento $tableName: $e"); }
        }

        if (hasChanges) {
          print(">>> [SYNC] Tabela $tableName atualizada com ${remoteData.length} registos.");
          _syncController.add(tableName);
        }
      } else {
        print(">>> [SYNC] Erro API $tableName: ${response.statusCode} :  ${response.reasonPhrase}");
      }
    } catch (e) { print("Erro rede/sync $tableName: $e"); }
  }

  Map<String, dynamic> _mapModelToTable(String tableName, dynamic item, int? idConsultor) {
    try {
      switch (tableName) {
        case 'consultores': return ConsultoresModel.fromJson(item).toMap();
        case 'learningPaths':
          final m = LearningPathsModel.fromJson(item);
          return {'ID_LEARNINGPATH': m.id, 'NOME_LEARNINGPATH': m.nome, 'DESCRICAO_LEARNINGPATH': m.descricao, 'IMAGEM_LEARNING_PATH': m.imagem, 'ESTADO_A_I_': m.estado_a_i ? 1 : 0, 'DATA_INSERCAO': m.data_insercao};
        case 'serviceLines':
          final m = ServiceLinesModel.fromJson(item);
          return {'ID_SERVICELINE': m.id, 'ID_LEARNINGPATH': m.id_learning_path, 'NOME_SERVICELINE': m.nome, 'DESCRICAO_SERVICELINE': m.descricao, 'IMAGEM_SERVICE_LINE': m.imagem, 'ESTADO_A_I_': m.estado_a_i ? 1 : 0, 'DATA_INSERCAO': m.data_insercao, 'NOME_LP_PAI': m.nome_learning_path_pai ?? ''};
        case 'areas':
          final m = AreasModel.fromJson(item);
          return {'id_area': m.id, 'id_service_line': m.id_service_line, 'nome_area': m.nome, 'descricao_area': m.descricao, 'imagem_area': m.imagem, 'estado_a_i': m.estado_a_i ? 1 : 0, 'data_insercao': m.data_insercao, 'nome_service_line': m.nome_service_line_pai ?? ''};
        case 'badges':
          final m = BadgesModel.fromJson(item);
          return {'ID_BADGE': m.id, 'ID_AREA': m.id_area, 'NOME_BADGE': m.nome, 'DESCRICAO_BADGE': m.descricao, 'PONTOS_BADGE': m.pontos, 'PAGO': m.pago_S_N ? 1 : 0, 'NIVEL_BADGE': m.nivel, 'IMAGEM_BADGE': m.imagem, 'nome_area_pai': m.nome_area_pai ?? '', 'ESTADO_A_I_': m.estado_a_i ? 1 : 0, 'DATA_INSERCAO': m.data_insercao};
        case 'requisitos':
          final m = RequisitosModel.fromJson(item);
          return {'ID_REQUISITO': m.id, 'ID_BADGE': m.id_badge, 'NOME_REQUISITO': m.nome, 'DESCRICAO_REQUISITO': m.descricao, 'IMAGEM_REQUISITO': m.imagem, 'ESTADO_A_I_': m.estado_a_i ? 1 : 0};
        case 'badgesConcluidos':
          final m = BadgesConcluidosModel.fromJson(item);
          return {'ID_BADGE_CONCLUIDO': m.idBadgeConcluido, 'ID_CONSULTOR': idConsultor ?? m.idBadgeConcluido, 'ID_BADGE': m.idBadge, 'NOME_BADGE': m.nomeBadge, 'nome_area_pai': m.nomeAreaPai, 'NIVEL_BADGE': m.nivelBadge, 'PONTOS_BADGE': m.pontosBadge, 'IMAGEM_BADGE': m.imagemBadge, 'DATA_CONCLUSAO': m.dataConclusao, 'VALIDADE': m.validadeDias, 'nome_sl_pai': m.nomeServiceLine};
        case 'objetivos':
          final m = ObjetivosModel.fromJson(item);
          return {'ID_OBJETIVO': m.id, 'ID_BADGE': m.id_badge, 'ID_CONSULTOR': idConsultor ?? m.id_consultor, 'NOME_OBJETIVO': m.nome, 'DATA_LIMITE_CONCLUSAO': m.data_limite_conclusao, 'DATA_CONCLUSAO_OBJETIVO': m.data_conclusao_objetivo ?? ''};
        case 'notificacoes':
          final m = NotificacoesModel.fromJson(item);
          return {'ID_NOTIFICACAO': m.idNotificacao, 'ID_CONSULTOR': m.idConsultor, 'NOTIFICACAO': m.notificacao, 'DATA_DE_ENVIO': m.data_de_envio,'REMETENTE': m.remetente, 'DESCRICAO': m.descricao};
        case 'estados':
          final m = EstadosModel.fromJson(item);
          return {'ID_ESTADO': m.idEstado, 'NOME_ESTADO': m.nome, 'DESCRICAO_ESTADO': m.descricao};
        case 'pedidosBadge':
          final m = PedidosBadgeModel.fromJson(item);
          return {'ID_PEDIDO_BADGE': m.idPedidoBadge, 'ID_CONSULTOR': m.idConsultor, 'ID_BADGE': m.idBadge, 'ESTADO_ATUAL': m.idEstadoAtual};
        case 'historicoPedidos':
          final m = HistoricoPedidosModel.fromJson(item);
          return {'ID_HISTORICO': m.idHistorico, 'ID_BADGE': m.idBadge, 'ID_CONSULTOR': m.idConsultor, 'DATA': m.data};
        case 'documentacoes':
          final m = DocumentacaoModel.fromJson(item);
          return {'ID_DOCUMENTACAO': m.id, 'ID_HISTORICO': m.id_historico, 'ID_CONSULTOR': m.id_consultor, 'DOCUMENTACAO': m.documentacao};
        case 'conquistas':
          final m = ConquistasModel.fromJson(item);
          return m.toMap();
        case 'conquistasConsultores':
          final m = ConquistasConsultoresModel.fromJson(item);
          return {'ID_CONQUISTA_CONSULTOR': m.id_conquista_consultor, 'ID_CONSULTOR': m.id_consultor, 'ID_CONQUISTA': m.id_conquista};
        default: return {};
      }
    } catch (e) { return {}; }
  }

  Future<void> pushPendingData(String tableName, String endpoint, String idColumn) async {
    var prefs = await SharedPreferences.getInstance();
    final String? token = prefs.getString('token');

    if(token == null){
      print('>>> [SYNC] Token não encontrado na Shared Preferences, nao e possivel fazer sync com a API');
      return;
    }
    if (_syncingTables.contains(tableName)) return;
    _syncingTables.add(tableName);

    try {
      final pending = await _db.getPendingSync(tableName);
      if (pending.isEmpty) return;

      for (var row in pending) {
        try {
          final localId = row[idColumn];
          Map<String, dynamic> apiBody = _mapRowToApi(tableName, row);

          final response = await http.post(
              Uri.parse('$_baseUrl$endpoint'),
              headers: {
                'Content-Type': 'application/json', 
                HttpHeaders.authorizationHeader: 'Bearer $token'
              },
              body: jsonEncode(apiBody)
          ).timeout(const Duration(seconds: 15));

          if (response.statusCode == 201 || response.statusCode == 200 || response.statusCode == 409) {
            final db = await _db.database;
            await db.delete(tableName, where: '$idColumn = ?', whereArgs: [localId]);
          }
        } catch (e) { print("Erro push $tableName: $e"); }
      }
    } finally {
      _syncingTables.remove(tableName);
    }
  }

  Map<String, dynamic> _mapRowToApi(String tableName, Map<String, dynamic> row) {
    switch (tableName) {
      case 'objetivos':
        String dateStr = row['DATA_LIMITE_CONCLUSAO'] ?? '';
        String isoDate = dateStr;
        if (dateStr.contains('/')) {
          var p = dateStr.split('/');
          if (p.length == 3) isoDate = "${p[2]}-${p[1]}-${p[0]}";
        }
        return {'idBadge': row['ID_BADGE'], 'idConsultor': row['ID_CONSULTOR'], 'nomeBadge': row['NOME_OBJETIVO'], 'dataLimiteConclusao': isoDate};
      case 'pedidosBadge': return {'idBadge': row['ID_BADGE'], 'idConsultor': row['ID_CONSULTOR'], 'SessaoID': row['SESSAO_ID']};
      case 'documentacoes': return {'documentacao': row['DOCUMENTACAO'], 'sessaoId': row['SESSAO_ID']};
      default:
        var data = Map<String, dynamic>.from(row);
        data.remove('sync_status');
        data.remove('updated_at');
        return data;
    }
  }
}
