import 'dart:io';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sqflite/sqflite.dart';
import '../database/database_helper.dart';
import '../models/badgesRecomendados_model.dart';

final badgesRecomendadosRepositoryProvider = Provider((ref) => BadgesRecomendadosRepository());

// GERE O ESTADO DA LISTA DE BADGES_RECOMENDADOS
// Agora é uma family para receber o ID do consultor e filtrar objetivos existentes
final badgesFutureProvider = FutureProvider.autoDispose.family<List<BadgesRecomendadosModel>?, int>((ref, idConsultor) async {
  final repo = ref.watch(badgesRecomendadosRepositoryProvider);
  return await repo.getAllBadgesRecomendados(idConsultor);
});

class BadgesRecomendadosRepository {
  final _db = DatabaseHelper.instance;

  Future<bool> checkInternet() async {
    try {
      final result = await InternetAddress.lookup('google.com').timeout(const Duration(seconds: 4));
      return result.isNotEmpty && result[0].rawAddress.isNotEmpty;
    } on SocketException catch (_) {
      return false;
    }
  }

  Future<List<BadgesRecomendadosModel>?> getAllBadgesRecomendados(int idConsultor) async {
    try {
      final db = await _db.database;
      
      // Query que busca badges recomendados excluindo os que já são objetivos ATIVOS ou já foram concluídos
      // Um objetivo é considerado "ativo" se não estiver concluído e não estiver expirado.
      const dateComparison = "substr(o.DATA_LIMITE_CONCLUSAO, 7, 4) || '-' || substr(o.DATA_LIMITE_CONCLUSAO, 4, 2) || '-' || substr(o.DATA_LIMITE_CONCLUSAO, 1, 2)";

      final List<Map<String, dynamic>> maps = await db.rawQuery('''
        SELECT br.* FROM badgesRecomendados br
        WHERE br.ID_BADGE NOT IN (
          SELECT o.ID_BADGE FROM objetivos o 
          WHERE o.ID_CONSULTOR = ? 
          AND (
            (o.DATA_CONCLUSAO_OBJETIVO IS NOT NULL AND o.DATA_CONCLUSAO_OBJETIVO <> '')
            OR $dateComparison >= date('now')
          )
        )
        AND br.ID_BADGE NOT IN (
          SELECT bc.ID_BADGE FROM badgesConcluidos bc WHERE bc.ID_CONSULTOR = ?
        )
        LIMIT 18
      ''', [idConsultor, idConsultor]);

      if (maps.isEmpty) {
        print(">> [BADGES_RECOMENDADOS] Nenhum badge recomendado disponível após filtragem.");
        return [];
      }

      // VAI ENVIAR A LISTA DOS BADGES RECOMENDADOS FILTRADA
      return List.generate(maps.length, (i) {
        return BadgesRecomendadosModel(
          idBadge: maps[i]['ID_BADGE'],
          nomeBadge: maps[i]['NOME_BADGE'],
          imagemBadge: maps[i]['IMAGEM_BADGE'],
        );
      });
    } catch (e) {
      print("ERRO! badgesRecomendados_repository [getAllBadgesRecomendados]: $e");
      return null;
    }
  }

  Future<int> getBadgesCount() async {
    final db = await _db.database;
    final result = await db.rawQuery('SELECT COUNT(*) FROM badgesRecomendados');
    return Sqflite.firstIntValue(result) ?? 0;
  }
}
