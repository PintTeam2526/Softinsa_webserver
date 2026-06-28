import 'dart:io';
import '../services/candidaturasBadge_service.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../database/database_helper.dart';

final candidaturasRepositoryProvider = Provider((ref) => CandidaturasBadgeRepository());

class CandidaturasBadgeRepository {
  final _db = DatabaseHelper.instance;
  final _serviceCandidaturas = CandidaturasBadgeService();

  Future<bool> _hasInternet() async {
    try {
      final result = await InternetAddress.lookup('google.com');
      return result.isNotEmpty && result[0].rawAddress.isNotEmpty;
    } on SocketException catch (_) {
      return false;
    }
  }

  // Grava documentos na temporária (ainda não associados ao pedido definitivo)
  Future<bool> submeterDocumentacao(String documentoBase64, String sessaoID) async {
    bool hasNet = await _hasInternet();
    if (hasNet) {
      try {
        final success = await _serviceCandidaturas.submeterDocumentacao(documentoBase64, sessaoID);
        if (success) return true;
      } catch (e) {
        print("Erro ao submeter online, guardando offline: $e");
      }
    }

    try {
      int nextId = await _db.getNextTempId('documentacaoTemporaria', 'ID');
      await _db.upsert('documentacaoTemporaria', {
        'ID': nextId,
        'SESSAO_ID': sessaoID, // Mantém como String/UUID
        'DOCUMENTACAO': documentoBase64,
        'DATA_INSERCAO': DateTime.now().toIso8601String(),
        'sync_status': 'pending',
        'updated_at': DateTime.now().toIso8601String(),
      });
      return true;
    } catch (e) {
      print("Erro ao guardar doc temporário: $e");
      return false;
    }
  }

  // Finaliza o pedido e "move" os documentos para a tabela de sync definitivo
  Future<bool> submeterCandidaturaBadge(int idConsultor, int idBadge, String sessaoID) async {
    bool hasNet = await _hasInternet();

    if(hasNet) {
      try {
        return await _serviceCandidaturas.candidatarBadge(idConsultor, idBadge, sessaoID);
      } catch(e) {
        print("Erro online, movendo para tabelas de sync offline: $e");
      }
    }

    try {
      final db = await _db.database;

      // Criar pedido localmente
      int nextPedidoId = await _db.getNextTempId('pedidosBadge', 'ID_PEDIDO_BADGE');
      await _db.upsert('pedidosBadge', {
        'ID_PEDIDO_BADGE': nextPedidoId,
        'ID_CONSULTOR': idConsultor,
        'ID_BADGE': idBadge,
        'ESTADO_ATUAL': 1,
        'SESSAO_ID': sessaoID,
        'sync_status': 'pending',
        'updated_at': DateTime.now().toIso8601String(),
      });

      // Mover documentos para a tabela definitiva LOCAL
      final tempDocs = await db.query('documentacaoTemporaria', 
          where: 'SESSAO_ID = ?', whereArgs: [sessaoID]);

      for (var doc in tempDocs) {
        int nextDocId = await _db.getNextTempId('documentacoes', 'ID_DOCUMENTACAO');
        await _db.upsert('documentacoes', {
          'ID_DOCUMENTACAO': nextDocId,
          'ID_HISTORICO': nextPedidoId, 
          'ID_CONSULTOR': idConsultor,
          'DOCUMENTACAO': doc['DOCUMENTACAO'],
          'SESSAO_ID': sessaoID,
          'sync_status': 'pending',
          'updated_at': DateTime.now().toIso8601String(),
        });
      }

      // 3. Limpar temporária local
      await db.delete('documentacaoTemporaria', where: 'SESSAO_ID = ?', whereArgs: [sessaoID]);

      return true;
    } catch (e) {
      print("Erro no fluxo offline: $e");
      return false;
    }
  }
}
