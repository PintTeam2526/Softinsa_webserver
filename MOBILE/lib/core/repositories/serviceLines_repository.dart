import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../database/database_helper.dart';
import '../models/serviceLines_model.dart';
import '../services/serviceLines_service.dart';

// Provider para o repositório
final serviceLinesRepositoryProvider = Provider((ref) => ServiceLinesRepository());

// PROVIDER REATIVO PARA A UI
final allServiceLinesProvider = FutureProvider<List<ServiceLinesModel>>((ref) async {
  final repo = ref.watch(serviceLinesRepositoryProvider);
  return repo.getAllServiceLines();
});

class ServiceLinesRepository {
  final _db = DatabaseHelper.instance;
  final _serviceServiceLines = ServiceLinesService();

  Future<List<ServiceLinesModel>> getAllServiceLines() async {
    final db = await _db.database;
    final List<Map<String, dynamic>> maps = await db.query('serviceLines');

    return List.generate(maps.length, (i) {
      return ServiceLinesModel(
        id: maps[i]['ID_SERVICELINE'],
        id_learning_path: maps[i]['ID_LEARNINGPATH'],
        nome: maps[i]['NOME_SERVICELINE'],
        descricao: maps[i]['DESCRICAO_SERVICELINE'],
        imagem: maps[i]['IMAGEM_SERVICE_LINE'],
        estado_a_i: maps[i]['ESTADO_A_I_'] == 1,
        data_insercao: maps[i]['DATA_INSERCAO'],
        nome_learning_path_pai: maps[i]['NOME_LP_PAI'],
      );
    });
  }

  Future<ServiceLinesModel> getServiceLineById(int id) async {
    final db = await _db.database;
    final List<Map<String, dynamic>> maps = await db.query(
      'serviceLines',
      where: 'ID_SERVICELINE = ?',
      whereArgs: [id],
    );

    if (maps.isNotEmpty) {
      return ServiceLinesModel(
        id: maps[0]['ID_SERVICELINE'],
        id_learning_path: maps[0]['ID_LEARNINGPATH'],
        nome: maps[0]['NOME_SERVICELINE'],
        descricao: maps[0]['DESCRICAO_SERVICELINE'],
        imagem: maps[0]['IMAGEM_SERVICE_LINE'],
        estado_a_i: maps[0]['ESTADO_A_I_'] == 1,
        data_insercao: maps[0]['DATA_INSERCAO'],
        nome_learning_path_pai: maps[0]['NOME_LP_PAI'],
      );
    } else {
      return _serviceServiceLines.fetchServiceLineByID(id);
    }
  }
}
