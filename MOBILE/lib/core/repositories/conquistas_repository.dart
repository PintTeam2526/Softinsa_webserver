import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../database/database_helper.dart';
import '../models/conquistas_model.dart';
import '../app_state.dart';

// Provider para o repositório
final conquistasRepositoryProvider = Provider((ref) => ConquistasRepository());

// PROVIDER REATIVO PARA A UI
final allConquistasProvider = FutureProvider<List<ConquistasModel>>((ref) async {
  final repository = ref.watch(conquistasRepositoryProvider);
  return repository.getAllConquistas();
});

class ConquistasRepository {
  final _db = DatabaseHelper.instance;

  Future<List<ConquistasModel>> getAllConquistas() async {
    final db = await _db.database;
    final idConsultor = AppState().idConsultor;

    // Buscar todas as conquistas da base local
    final List<Map<String, dynamic>> maps = await db.query('conquistas', orderBy: 'ID_CONQUISTA ASC');

    // Buscar o total de badges concluídos do consultor
    final List<Map<String, dynamic>> badgesRes = await db.rawQuery(
      'SELECT COUNT(*) as total FROM badgesConcluidos WHERE ID_CONSULTOR = ?',
      [idConsultor]
    );
    int totalBadgesConcluidos = badgesRes.first['total'] as int? ?? 0;

    // Buscar os pontos totais do consultor da tabela local
    final List<Map<String, dynamic>> consultorRes = await db.query(
      'consultores',
      columns: ['TOTAL_PONTOS'],
      where: 'ID_CONSULTOR = ?',
      whereArgs: [idConsultor],
    );
    int totalPontosConsultor = 0;
    if (consultorRes.isNotEmpty) {
      totalPontosConsultor = consultorRes.first['TOTAL_PONTOS'] as int? ?? 0;
    }

    return List.generate(maps.length, (i) {
      final item = maps[i];
      final String estado = item['ESTADO_CONQUISTA']?.toString() ?? 'Por Obter';
      final String tipo = item['TIPO_CONQUISTA']?.toString().toLowerCase() ?? '';
      final int valorNecessario = int.tryParse(item['VALOR_CONQUISTA']?.toString() ?? '0') ?? 0;

      double progressoCalculado = 0.0;

      // Lógica de cálculo de progresso
      if (estado.toLowerCase() == 'obtido' || estado.toLowerCase() == 'concluído') {
        progressoCalculado = 1.0;
      } else {
        if (tipo == 'badges') {
          if (totalBadgesConcluidos >= valorNecessario) {
            progressoCalculado = 1.0;
          } else if (valorNecessario > 0) {
            progressoCalculado = totalBadgesConcluidos / valorNecessario;
          }
        } else if (tipo == 'pontos') {
          if (totalPontosConsultor >= valorNecessario) {
            progressoCalculado = 1.0;
          } else if (valorNecessario > 0) {
            progressoCalculado = totalPontosConsultor / valorNecessario;
          }
        }
      }

      return ConquistasModel(
        id_conquista: int.tryParse(item['ID_CONQUISTA']?.toString() ?? '0') ?? 0,
        descricao_conquista: item['DESCRICAO_CONQUISTA']?.toString() ?? '',
        pontos_conquista: int.tryParse(item['PONTOS_CONQUISTA']?.toString() ?? '0') ?? 0,
        tipo_conquista: tipo,
        valor_conquista: valorNecessario,
        estado_conquista: estado,
        progresso: progressoCalculado,
      );
    });
  }

}
