import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../database/database_helper.dart';
import '../models/objetivos_model.dart';
import '../services/objetivos_service.dart';
import '../models/badges_model.dart';
import '../services/sync_service.dart';

// Provider para o repositório
final objetivosRepositoryProvider = Provider((ref) => ObjetivosRepository());

// PROVIDERS REATIVOS PARA A UI
final objetivosConsultorProvider = FutureProvider.family<List<ObjetivosModel>, int>((ref, idConsultor) async {
  final repo = ref.watch(objetivosRepositoryProvider);
  return repo.fetchObjetivosConsultor(idConsultor);
});

final badgesParaObjetivosProvider = FutureProvider.family<List<BadgesModel>, int>((ref, idConsultor) async {
  final repo = ref.watch(objetivosRepositoryProvider);
  return repo.fetchBadgesParaObjetivos(idConsultor);
});

class ObjetivosRepository {
  final _db = DatabaseHelper.instance;
  final _syncService = SyncService.instance;

  Future<List<ObjetivosModel>> fetchObjetivosConsultor(int idConsultor) async {
    final db = await _db.database;
    final List<Map<String, dynamic>> maps = await db.query(
      'objetivos',
      where: 'ID_CONSULTOR = ?',
      whereArgs: [idConsultor],
    );

    return maps.map((map) => ObjetivosModel.fromJson(map)).toList();
  }

  Future<List<BadgesModel>> fetchBadgesParaObjetivos(int idConsultor) async {
    final db = await _db.database;
    const dateComparison = "substr(o.DATA_LIMITE_CONCLUSAO, 7, 4) || '-' || substr(o.DATA_LIMITE_CONCLUSAO, 4, 2) || '-' || substr(o.DATA_LIMITE_CONCLUSAO, 1, 2)";

    final List<Map<String, dynamic>> res = await db.rawQuery('''
      SELECT b.* FROM badges b
      WHERE (b.ESTADO_A_I_ = 1 OR b.ESTADO_A_I_ = '1')
      AND b.ID_BADGE NOT IN (
        SELECT bc.ID_BADGE FROM badgesConcluidos bc 
        WHERE bc.ID_CONSULTOR = ?
      )
      AND b.ID_BADGE NOT IN (
        SELECT o.ID_BADGE FROM objetivos o 
        WHERE o.ID_CONSULTOR = ? 
        AND (o.DATA_CONCLUSAO_OBJETIVO IS NULL OR o.DATA_CONCLUSAO_OBJETIVO = '')
        AND $dateComparison >= date('now')
      )
    ''', [idConsultor, idConsultor]);

    return res.map((map) => BadgesModel.fromJson(map)).toList();
  }

  Future<bool> adicionarObjetivo(int idConsultor, int idBadge, String nomeBadge, DateTime dataLimiteConclusao) async {
    final db = await _db.database;
    
    // VERIFICAÇÃO PARA EVITAR DUPLICADOS (PENDENTES OU SINCRONIZADOS)
    final List<Map<String, dynamic>> existentes = await db.query(
      'objetivos',
      where: 'ID_CONSULTOR = ? AND ID_BADGE = ? AND (DATA_CONCLUSAO_OBJETIVO IS NULL OR DATA_CONCLUSAO_OBJETIVO = "")',
      whereArgs: [idConsultor, idBadge],
    );

    if (existentes.isNotEmpty) {
      print(">>> [REPO] Já existe um objetivo ativo para este badge. Ignorando duplicado.");
      return true; // Retornamos true pois o objetivo "já existe", não é um erro
    }

    int tempId = await _db.getNextTempId('objetivos', 'ID_OBJETIVO');
    String dataFormatada = "${dataLimiteConclusao.day.toString().padLeft(2, '0')}/${dataLimiteConclusao.month.toString().padLeft(2, '0')}/${dataLimiteConclusao.year}";

    final Map<String, dynamic> row = {
      'ID_OBJETIVO': tempId,
      'ID_BADGE': idBadge,
      'ID_CONSULTOR': idConsultor,
      'NOME_OBJETIVO': nomeBadge,
      'DATA_LIMITE_CONCLUSAO': dataFormatada,
      'DATA_CONCLUSAO_OBJETIVO': '',
      'sync_status': 'pending',
      'updated_at': DateTime.now().toIso8601String(),
    };

    try {
      await _db.upsert('objetivos', row);
      // Disparar push imediato apenas se houver internet
      _syncService.pushPendingData('objetivos', '/objetivos/adicionar', 'ID_OBJETIVO');
      return true;
    } catch (e) {
      return false;
    }
  }
}
