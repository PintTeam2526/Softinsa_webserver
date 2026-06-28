import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../database/database_helper.dart';
import '../models/areas_model.dart';
import '../services/areas_service.dart';
import '../services/sync_service.dart';

// Provider para o repositório
final areasRepositoryProvider = Provider((ref) => AreasRepository());

// PROVIDER REATIVO PARA A UI
final allAreasProvider = FutureProvider<List<AreasModel>>((ref) async {
  final repo = ref.watch(areasRepositoryProvider);
  return repo.getAllAreas();
});

class AreasRepository {
  final _db = DatabaseHelper.instance;
  final _serviceAreas = AreasService();

  Future<List<AreasModel>> getAllAreas() async {
    final db = await _db.database;
    List<Map<String, dynamic>> maps = await db.query('areas');

    // Se a BD local estiver vazia, tenta sincronizar imediatamente com a API
    // Isto garante que no primeiro arranque o ecrã de registo tenha dados.
    if (maps.isEmpty) {
      print(">>> [AREAS] BD Local vazia. A sincronizar com a API para o Registo...");
      try {
        await SyncService.instance.syncTableByName('areas');
        maps = await db.query('areas');
      } catch (e) {
        print(">>> [AREAS] Erro ao sincronizar áreas no arranque: $e");
      }
    }

    return List.generate(maps.length, (i) {
      return AreasModel(
        id: maps[i]['id_area'],
        id_service_line: maps[i]['id_service_line'],
        nome: maps[i]['nome_area'],
        descricao: maps[i]['descricao_area'],
        imagem: maps[i]['imagem_area'],
        estado_a_i: maps[i]['estado_a_i'] == 1,
        data_insercao: maps[i]['data_insercao'],
        nome_service_line_pai: maps[i]['nome_service_line'],
      );
    });
  }

  Future<AreasModel> getAreaById(int id) async {
    final db = await _db.database;
    final List<Map<String, dynamic>> maps = await db.query(
      'areas',
      where: 'id_area = ?',
      whereArgs: [id],
    );

    if (maps.isNotEmpty) {
      return AreasModel(
        id: maps[0]['id_area'],
        id_service_line: maps[0]['id_service_line'],
        nome: maps[0]['nome_area'],
        descricao: maps[0]['descricao_area'],
        imagem: maps[0]['imagem_area'],
        estado_a_i: maps[0]['estado_a_i'] == 1,
        data_insercao: maps[0]['data_insercao'],
        nome_service_line_pai: maps[0]['nome_service_line'],
      );
    } else {
      // Fallback para API caso não exista localmente
      return _serviceAreas.fetchArea(id);
    }
  }
}
