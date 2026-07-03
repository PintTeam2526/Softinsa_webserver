import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../database/database_helper.dart';
import '../services/sync_service.dart';

// Provider para o repositório
final badgesFavoritosRepositoryProvider = Provider((ref) => BadgesFavoritosRepository());

// Provider reativo que escuta o SyncService para um badge específico
final isBadgeFavoritoProvider = FutureProvider.family<bool, int>((ref, idBadge) async {
  final repo = ref.watch(badgesFavoritosRepositoryProvider);
  
  final syncStream = SyncService.instance.syncStream;
  final subscription = syncStream.listen((tableName) {
    if (tableName == 'badgesFavoritos') {
      ref.invalidateSelf();
    }
  });
  
  ref.onDispose(() => subscription.cancel());

  return repo.isBadgeFavorito(idBadge);
});

// Provider para obter todos os IDs de badges favoritos
final favoriteBadgeIdsProvider = FutureProvider<Set<int>>((ref) async {
  final repo = ref.watch(badgesFavoritosRepositoryProvider);
  
  final syncStream = SyncService.instance.syncStream;
  final subscription = syncStream.listen((tableName) {
    if (tableName == 'badgesFavoritos') {
      ref.invalidateSelf();
    }
  });
  
  ref.onDispose(() => subscription.cancel());

  return repo.getFavoriteBadgeIds();
});

class BadgesFavoritosRepository {
  final _db = DatabaseHelper.instance;

  /// Verifica se um badge é favorito (FAVORITO = 1) na base local
  Future<bool> isBadgeFavorito(int idBadge) async {
    final db = await _db.database;

    final List<Map<String, dynamic>> maps = await db.query(
      'badgesFavoritos',
      where: 'ID_BADGE = ? AND FAVORITO = 1',
      whereArgs: [idBadge],
    );

    return maps.isNotEmpty;
  }

  /// Obtém todos os IDs de badges que são favoritos
  Future<Set<int>> getFavoriteBadgeIds() async {
    final db = await _db.database;
    final List<Map<String, dynamic>> maps = await db.query(
      'badgesFavoritos',
      columns: ['ID_BADGE'],
      where: 'FAVORITO = 1',
    );
    return maps.map((m) => m['ID_BADGE'] as int).toSet();
  }

  /// Alterna o estado de favorito localmente e marca para sincronização
  Future<void> toggleFavorito(int idBadge) async {
    final db = await _db.database;
    
    final List<Map<String, dynamic>> maps = await db.query(
      'badgesFavoritos',
      where: 'ID_BADGE = ?',
      whereArgs: [idBadge],
    );

    if (maps.isEmpty) {
      await db.insert(
        'badgesFavoritos',
        {
          'ID_BADGE': idBadge,
          'FAVORITO': 1,
          'sync_status': 'pending',
          'updated_at': DateTime.now().toUtc().toIso8601String(),
        },
      );
    } else {
      int estadoAtual = maps.first['FAVORITO'] ?? 0;
      int novoEstado = (estadoAtual == 1) ? 0 : 1;

      await db.update(
        'badgesFavoritos',
        {
          'FAVORITO': novoEstado,
          'sync_status': 'pending',
          'updated_at': DateTime.now().toUtc().toIso8601String(),
        },
        where: 'ID_BADGE = ?',
        whereArgs: [idBadge],
      );
    }
  }
}