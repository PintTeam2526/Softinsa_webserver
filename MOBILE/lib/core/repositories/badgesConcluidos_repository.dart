import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../database/database_helper.dart';
import '../models/badgesConcluidos_model.dart';

// Provider para o repositório
final badgesConcluidosRepositoryProvider = Provider((ref) => BadgesConcluidosRepository());

// PROVIDER REATIVO PARA A UI
final badgesConcluidosProvider = FutureProvider.family<List<BadgesConcluidosModel>, int>((ref, idConsultor) async {
  final repo = ref.watch(badgesConcluidosRepositoryProvider);
  return repo.fetchBadgesConcluidos(idConsultor);
});

class BadgesConcluidosRepository {
  final _db = DatabaseHelper.instance;

  Future<List<BadgesConcluidosModel>> fetchBadgesConcluidos(int idConsultor) async {
    final db = await _db.database;
    final List<Map<String, dynamic>> maps = await db.query(
      'badgesConcluidos',
      where: 'ID_CONSULTOR = ?',
      whereArgs: [idConsultor],
    );

    return maps.map((map) => BadgesConcluidosModel.fromJson(map)).toList();
  }
}
