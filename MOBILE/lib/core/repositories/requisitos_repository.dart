import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../database/database_helper.dart';
import '../models/requisitos_model.dart';
import '../services/requisitos_service.dart';

final requisitosRepositoryProvider = Provider((ref) => RequisitosRepository());

class RequisitosRepository {
  final _db = DatabaseHelper.instance;
  final RequisitosService _serviceRequisitos = RequisitosService();

  /// Procura requisitos na BD Local primeiro. Sem sync automático.
  Future<List<RequisitosModel>> getRequisitosBadge(int idBadge) async {
    final db = await _db.database;
    final List<Map<String, dynamic>> maps = await db.query(
      'requisitos',
      where: 'ID_BADGE = ?',
      whereArgs: [idBadge],
    );

    if (maps.isNotEmpty) {
      return maps.map((m) => RequisitosModel.fromJson(m)).toList();
    } else {
      // Fallback para API apenas se não houver localmente
      return _serviceRequisitos.fetchRequisitosBadge(idBadge);
    }
  }
}
