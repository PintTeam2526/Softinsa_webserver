import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../database/database_helper.dart';
import '../app_state.dart';
import '../services/sync_service.dart';
import 'dart:io';

// Provider para o repositório
final conquistasConsultoresRepositoryProvider = Provider((ref) => ConquistasConsultoresRepository());

class ConquistasConsultoresRepository {
  final _db = DatabaseHelper.instance;

  Future<int> getCountConquistasConsultor(int idConsultor) async {
    _trySync(idConsultor);

    final db = await _db.database;
    final List<Map<String, dynamic>> res = await db.rawQuery(
      'SELECT COUNT(*) as total FROM conquistasConsultores WHERE ID_CONSULTOR = ?',
      [idConsultor]
    );

    return res.first['total'] as int? ?? 0;
  }


  Future<void> _trySync(int idConsultor) async {
    try {
      final result = await InternetAddress.lookup('google.com').timeout(const Duration(seconds: 2));
      if (result.isNotEmpty && result[0].rawAddress.isNotEmpty) {
        await SyncService.instance.syncTableByName('conquistasConsultores', idConsultor: idConsultor);
      }
    } catch (e) {
      print(">>> [REPO] Falha ao tentar disparar sync de conquistasConsultores: $e");
    }
  }
}
