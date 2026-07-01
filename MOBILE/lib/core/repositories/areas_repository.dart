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
    
    // Agora que as imagens são guardadas como ficheiros locais (caminhos) no SyncService,
    // já não causam o erro de CursorWindow (Row too big) e podem ser listadas normalmente.
    List<Map<String, dynamic>> maps = await db.query(
      'areas',
      columns: [
        'id_area', 
        'id_service_line', 
        'nome_area', 
        'descricao_area', 
        'imagem_area',
        'estado_a_i', 
        'data_insercao', 
        'nome_service_line'
      ]
    );

    if (maps.isEmpty) {
      print(">>> [AREAS] BD Local vazia. A sincronizar com a API...");
      try {
        await SyncService.instance.syncTableByName('areas');
        // Recarregar após o sync
        maps = await db.query(
          'areas',
          columns: [
            'id_area', 
            'id_service_line', 
            'nome_area', 
            'descricao_area', 
            'imagem_area',
            'estado_a_i', 
            'data_insercao', 
            'nome_service_line'
          ]
        );
      } catch (e) {
        print(">>> [AREAS] Erro ao sincronizar áreas: $e");
      }
    }

    return List.generate(maps.length, (i) {
      return AreasModel(
        id: maps[i]['id_area'],
        id_service_line: maps[i]['id_service_line'],
        nome: maps[i]['nome_area'],
        descricao: maps[i]['descricao_area'],
        imagem: maps[i]['imagem_area'] ?? "", // Agora contém o PATH do ficheiro
        estado_a_i: maps[i]['estado_a_i'] == 1,
        data_insercao: maps[i]['data_insercao'] ?? "",
        nome_service_line_pai: maps[i]['nome_service_line'] ?? "",
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
        imagem: maps[0]['imagem_area'] ?? "",
        estado_a_i: maps[0]['estado_a_i'] == 1,
        data_insercao: maps[0]['data_insercao'] ?? "",
        nome_service_line_pai: maps[0]['nome_service_line'] ?? "",
      );
    } else {
      return _serviceAreas.fetchArea(id);
    }
  }
}
