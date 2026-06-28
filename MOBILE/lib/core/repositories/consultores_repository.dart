import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:sqflite/sqflite.dart';

import '../database/database_helper.dart';
import '../models/consultores_model.dart';
import '../services/consultores_service.dart';
import '../services/sync_service.dart';

// Provider para o repositório
final consultoresRepositoryProvider = Provider((ref) => ConsultoresRepository());

// PROVIDER REATIVO PARA O CONSULTOR LOGADO
final currentConsultorProvider = FutureProvider.family<ConsultoresModel, int>((ref, idConsultor) async {
  final repo = ref.watch(consultoresRepositoryProvider);
  return repo.getConsultorById(idConsultor);
});

class ConsultoresRepository {
  final _db = DatabaseHelper.instance;
  final _syncService = SyncService.instance;

  Future<bool> criarConsultor(String nomeConsultor, String emailConsultor, String password, String username, String imagemConsultor, int idAreaPreferencia) async {
    return ConsultoresService().registerConsultor(nomeConsultor, emailConsultor, password, username, imagemConsultor, idAreaPreferencia);
  }

  Future<int> loginConsultor(String email, String password) async {
    final idConsultor = await ConsultoresService().loginConsultor(email, password);

    if (idConsultor > 0) {
      print(">>> [REPO] Login bem-sucedido. O sync será disparado ao entrar na Homepage.");
    }

    return idConsultor;
  }

  Future<ConsultoresModel> getConsultorById(int idConsultor) async {
    final db = await _db.database;
    final List<Map<String, dynamic>> maps = await db.query(
      'consultores',
      where: 'ID_CONSULTOR = ?',
      whereArgs: [idConsultor],
    );

    if (maps.isNotEmpty) {
      return ConsultoresModel.fromJson(maps.first);
    } else {
      throw Exception('Consultor não encontrado na BD local');
    }
  }

  Future<int> getCountBadgesObtidos(int idConsultor) async {
    final db = await _db.database;
    final List<Map<String, dynamic>> res = await db.rawQuery(
        'SELECT COUNT(*) as total FROM badgesConcluidos WHERE ID_CONSULTOR = ?',
        [idConsultor]
    );
    return Sqflite.firstIntValue(res) ?? 0;
  }

  Future<int> getCountBadgesPorObter(int idConsultor) async {
    final db = await _db.database;
    final List<Map<String, dynamic>> res = await db.rawQuery('''
      SELECT COUNT(*) as total 
      FROM badges 
      WHERE (ESTADO_A_I_ = 1 OR ESTADO_A_I_ = '1')
      AND ID_BADGE NOT IN (
        SELECT ID_BADGE FROM badgesConcluidos WHERE ID_CONSULTOR = ?
      )
    ''', [idConsultor]);

    return Sqflite.firstIntValue(res) ?? 0;
  }

  Future<int> getCountObjetivosPorCompletar(int idConsultor) async {
    final db = await _db.database;
    final List<Map<String, dynamic>> res = await db.rawQuery(
        'SELECT COUNT(*) as total FROM objetivos WHERE ID_CONSULTOR = ? AND (DATA_CONCLUSAO_OBJETIVO IS NULL OR DATA_CONCLUSAO_OBJETIVO = "")',
        [idConsultor]
    );
    return Sqflite.firstIntValue(res) ?? 0;
  }

  Future<int?> getDiasObjetivoExpirar(int idConsultor) async {
    final db = await _db.database;
    final List<Map<String, dynamic>> res = await db.rawQuery('''
      SELECT DATA_LIMITE_CONCLUSAO 
      FROM objetivos 
      WHERE ID_CONSULTOR = ? 
      AND (DATA_CONCLUSAO_OBJETIVO IS NULL OR DATA_CONCLUSAO_OBJETIVO = "")
      ORDER BY DATA_LIMITE_CONCLUSAO ASC 
      LIMIT 1
    ''', [idConsultor]);

    if (res.isNotEmpty && res.first['DATA_LIMITE_CONCLUSAO'] != null) {
      String rawDate = res.first['DATA_LIMITE_CONCLUSAO'];
      try {
        DateTime? dataLimite;
        try {
          dataLimite = DateTime.parse(rawDate);
        } catch (_) {
          dataLimite = DateFormat('dd/MM/yyyy').parse(rawDate);
        }

        final diferenca = dataLimite.difference(DateTime.now()).inDays;
        return diferenca < 0 ? 0 : diferenca;
      } catch (e) { 
        return null; 
      }
    }
    return null;
  }

  Future<bool> atualizarInfoConsultor(int idConsultor, String? nome, String? email, int? idAreaPreferencia, String? imagemPerfil, String? passwordAtual, String? passwordNova) async {
    final sucesso = await ConsultoresService().updateConsultorInfo(idConsultor, nome, email, idAreaPreferencia, imagemPerfil, passwordAtual, passwordNova);
    
    if (sucesso) {
      print(">>> [REPO] Dados atualizados na API. A limpar registo local e a sincronizar...");
      
      // 1. Eliminar o registo local para garantir que o sync traz dados frescos
      final db = await _db.database;
      await db.delete(
        'consultores',
        where: 'ID_CONSULTOR = ?',
        whereArgs: [idConsultor],
      );
      
      // 2. Sincronizar com a API forçando o download completo
      await _syncService.syncTableByName(
        'consultores', 
        idConsultor: idConsultor, 
        force: true, 
        ignoreLastUpdate: true
      );
    }

    return sucesso;
  }
}
