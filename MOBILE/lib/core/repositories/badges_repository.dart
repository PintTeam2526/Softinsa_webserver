import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../database/database_helper.dart';
import '../models/badges_model.dart';
import '../services/badges_service.dart';
import '../app_state.dart';

// Provider para o repositório
final badgesRepositoryProvider = Provider((ref) => BadgesRepository());

// PROVIDERS REATIVOS PARA A UI
final allBadgesProvider = FutureProvider<List<BadgesModel>>((ref) async {
  final repo = ref.watch(badgesRepositoryProvider);
  return repo.getAllBadges();
});

final badgesPorObterProvider = FutureProvider.family<List<BadgesModel>, int>((ref, idConsultor) async {
  final repo = ref.watch(badgesRepositoryProvider);
  return repo.getBadgesPorConcluir(idConsultor);
});

class BadgesRepository {
  final _db = DatabaseHelper.instance;
  final _serviceBadges = BadgesService();

  Future<List<BadgesModel>> getAllBadges() async {
    final db = await _db.database;
    final List<Map<String, dynamic>> maps = await db.query('badges');
    return maps.map((map) => BadgesModel.fromJson(map)).toList();
  }

  Future<BadgesModel> getBadgeById(int id) async {
    final db = await _db.database;
    final List<Map<String, dynamic>> maps = await db.query(
      'badges',
      where: 'ID_BADGE = ?',
      whereArgs: [id],
    );
    if (maps.isNotEmpty) {
      return BadgesModel.fromJson(maps.first);
    } else {
      return _serviceBadges.fetchBadge(id);
    }
  }

  Future<List<BadgesModel>> getBadgesByAreaId(int idArea) async {
    final db = await _db.database;
    final List<Map<String, dynamic>> maps = await db.query(
      'badges',
      where: 'ID_AREA = ?',
      whereArgs: [idArea],
    );
    return maps.map((map) => BadgesModel.fromJson(map)).toList();
  }

  Future<List<BadgesModel>> getBadgesPorConcluir(int idConsultor) async {
    final db = await _db.database;
    final List<Map<String, dynamic>> res = await db.rawQuery('''
      SELECT b.* FROM badges b
      WHERE (b.ESTADO_A_I_ = 1 OR b.ESTADO_A_I_ = '1')
      AND NOT EXISTS (
        SELECT 1 FROM badgesConcluidos bc 
        WHERE bc.ID_BADGE = b.ID_BADGE AND bc.ID_CONSULTOR = ?
      )
    ''', [idConsultor]);
    return res.map((map) => BadgesModel.fromJson(map)).toList();
  }

  Future<String> getEstadoBadgeConsultor(int idBadge, int idConsultor) async {
    final db = await _db.database;

    // 1. VERIFICAR SE ESTÁ CONCLUÍDO OU EXPIRADO
    final List<Map<String, dynamic>> resConcluido = await db.query(
      'badgesConcluidos',
      where: 'ID_BADGE = ? AND ID_CONSULTOR = ?',
      whereArgs: [idBadge, idConsultor],
    );

    if (resConcluido.isNotEmpty) {
      final concluidade = resConcluido.first;
      final int? validadeDias = concluidade['VALIDADE'];
      final String dataConclusaoStr = concluidade['DATA_CONCLUSAO'] ?? '';

      if (validadeDias == null || validadeDias == 0) return 'Concluído';

      try {
        final parts = dataConclusaoStr.split('/');
        final dataConclusao = DateTime(int.parse(parts[2]), int.parse(parts[1]), int.parse(parts[0]));
        final diferencaDias = DateTime.now().difference(dataConclusao).inDays;
        return (diferencaDias <= validadeDias) ? 'Concluído' : 'Expirado';
      } catch (e) {
        return 'Concluído';
      }
    }

    // 2. VERIFICAR PEDIDOS
    final List<Map<String, dynamic>> resPedido = await db.query(
      'pedidosBadge',
      where: 'ID_BADGE = ? AND ID_CONSULTOR = ?',
      whereArgs: [idBadge, idConsultor],
    );

    if (resPedido.isNotEmpty) {
      final int estadoAtual = resPedido.first['ESTADO_ATUAL'];
      switch (estadoAtual) {
        case 1: return 'Submetido';
        case 2: return 'Correto';
        case 3: return 'Incorreto';
        case 4: return 'Aprovado';
        case 5: return 'Rejeitado';
        case 6: return 'Devolvido';
        default: return 'Pendente';
      }
    }

    return 'Por Obter';
  }
}
