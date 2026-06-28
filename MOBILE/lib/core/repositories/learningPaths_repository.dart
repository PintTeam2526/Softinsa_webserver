import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sqflite/sqflite.dart';
import '../database/database_helper.dart';
import '../models/learningPaths_model.dart';
import '../services/learningPaths_service.dart';
import '../app_state.dart';

// Provider para o repositório
final learningPathsRepositoryProvider = Provider((ref) => LearningPathsRepository());

// PROVIDER REATIVO PARA A UI
final allLearningPathsProvider = FutureProvider<List<LearningPathsModel>>((ref) async {
  final repo = ref.watch(learningPathsRepositoryProvider);
  return repo.getAllLearningPaths();
});

class LearningPathsRepository {
  final _db = DatabaseHelper.instance;
  final _serviceLearningPaths = LearningPathsService();

  Future<List<LearningPathsModel>> getAllLearningPaths() async {
    final db = await _db.database;
    final List<Map<String, dynamic>> maps = await db.query('learningPaths');
    final int idConsultor = AppState().idConsultor;

    List<LearningPathsModel> list = [];
    for (var map in maps) {
      int idLP = map['ID_LEARNINGPATH'];
      int progresso = await getProgressLP(idConsultor, idLP);
      
      list.add(LearningPathsModel(
        id: idLP,
        nome: map['NOME_LEARNINGPATH'],
        descricao: map['DESCRICAO_LEARNINGPATH'],
        imagem: map['IMAGEM_LEARNING_PATH'],
        estado_a_i: map['ESTADO_A_I_'] == 1,
        data_insercao: map['DATA_INSERCAO'],
        progresso: progresso,
      ));
    }
    return list;
  }

  Future<int> getProgressLP(int idConsultor, int idLP) async {
    final db = await _db.database;

    // QUERY PARA BUSCAR QUANTOS BADGES O CONSULTOR X TEM DA LP Y
    final List<Map<String, dynamic>> resObtidos = await db.rawQuery('''
      SELECT COUNT(*) as count 
      FROM badgesConcluidos bc 
      JOIN badges b ON bc.ID_BADGE = b.ID_BADGE
      JOIN areas a ON b.ID_AREA = a.id_area 
      JOIN serviceLines sl ON a.id_service_line = sl.ID_SERVICELINE
      WHERE bc.ID_CONSULTOR = ? AND sl.ID_LEARNINGPATH = ?
    ''', [idConsultor, idLP]);

    // QUERY PARA IR BUSCAR QUANTOS BADGES EXISTEM DA LP Y
    final List<Map<String, dynamic>> resTotais = await db.rawQuery('''
      SELECT COUNT(*) as count 
      FROM badges b 
      JOIN areas a ON b.ID_AREA = a.id_area 
      JOIN serviceLines sl ON a.id_service_line = sl.ID_SERVICELINE
      WHERE sl.ID_LEARNINGPATH = ?
    ''', [idLP]);

    int obtidos = Sqflite.firstIntValue(resObtidos) ?? 0;
    int totais = Sqflite.firstIntValue(resTotais) ?? 0;

    if (totais == 0) return 0;
    
    // Calculo da percentagem
    return ((obtidos / totais) * 100).floor();
  }

  Future<LearningPathsModel> getLearningPathById(int id) async {
    final db = await _db.database;
    final List<Map<String, dynamic>> maps = await db.query(
      'learningPaths',
      where: 'ID_LEARNINGPATH = ?',
      whereArgs: [id],
    );

    if (maps.isNotEmpty) {
      int progresso = await getProgressLP(AppState().idConsultor, id);
      return LearningPathsModel(
        id: maps[0]['ID_LEARNINGPATH'],
        nome: maps[0]['NOME_LEARNINGPATH'],
        descricao: maps[0]['DESCRICAO_LEARNINGPATH'],
        imagem: maps[0]['IMAGEM_LEARNING_PATH'],
        estado_a_i: maps[0]['ESTADO_A_I_'] == 1,
        data_insercao: maps[0]['DATA_INSERCAO'],
        progresso: progresso,
      );
    } else {
      return _serviceLearningPaths.fetchLearningPathById(id);
    }
  }
}
