import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../database/database_helper.dart';
import '../models/notificacoes_model.dart';
import '../services/sync_service.dart';

// Provider para o Riverpod
final notificacoesRepositoryProvider = Provider((ref) => NotificacoesRepository());

class NotificacoesRepository {
  final _db = DatabaseHelper.instance;
  final _syncService = SyncService.instance;

  /// Obtém as notificações: Força o sync e retorna o estado atual da BD Local
  Future<List<NotificacoesModel>> getNotificacoes(int idConsultor) async {
    try {
      // Sincronizar notificações da API para a BD Local
      await _syncService.syncTableByName(
          'notificacoes',
          idConsultor: idConsultor,
          force: true 
      );
    } catch (e) {
      print(">>> [REPO] Erro ao sincronizar notificações: $e");
    }

    final db = await _db.database;
    
    // Consultar notificações do consultor logado OU notificações globais (ID_CONSULTOR = 0)
    // Ordenado pela data mais recente (assumindo que DATA_DE_ENVIO está em formato ISO ou compatível para sort)
    final List<Map<String, dynamic>> maps = await db.query(
      'notificacoes',
      where: 'ID_CONSULTOR = ? OR ID_CONSULTOR = 0',
      whereArgs: [idConsultor],
      orderBy: 'ID_NOTIFICACAO DESC' // Usamos o ID como fallback de ordem se a data for string formatada
    );

    return List.generate(maps.length, (i) {
      final reg = maps[i];
      
      return NotificacoesModel(
        idNotificacao: reg['ID_NOTIFICACAO'] as int? ?? 0,
        idConsultor: reg['ID_CONSULTOR'] as int? ?? 0,
        notificacao: reg['NOTIFICACAO'] as String? ?? '',
        remetente: reg['REMETENTE'] as String? ?? 'Sistema',
        descricao: reg['DESCRICAO'] as String? ?? '',
        data_de_envio: reg['DATA_DE_ENVIO'] as String? ?? '',
      );
    });
  }
}
