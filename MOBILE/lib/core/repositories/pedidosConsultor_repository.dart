import 'dart:io';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sqflite/sqflite.dart';
import '../database/database_helper.dart';
import '../models/pedidosEcra_model.dart';
import '../services/sync_service.dart';

// Provider para o Riverpod
final pedidosConsultorRepositoryProvider = Provider((ref) => PedidosConsultorRepository());

class PedidosConsultorRepository {
  final _db = DatabaseHelper.instance;
  final _syncService = SyncService.instance;

  // Verifica se existe conexão a internet
  Future<bool> _hasInternet() async {
    try {
      final result = await InternetAddress.lookup('google.com');
      return result.isNotEmpty && result[0].rawAddress.isNotEmpty;
    } on SocketException catch (_) {
      return false;
    }
  }

  // VAI POPULAR OS CARDS DA PAGINA DE PEDIDOS
  Future<List<PedidoEcraModel>> fetchPedidosConsultor(int idConsultor) async {
    if (await _hasInternet()) {
      try {
        await _syncService.syncAll(idConsultor);
      } catch (e) {
        print("Erro ao sincronizar pedidos: $e");
      }
    }

    // Procura na BD local
    final db = await _db.database;
    
    final List<Map<String, dynamic>> res = await db.rawQuery('''
      SELECT 
        b.ID_BADGE,
        b.NOME_BADGE,
        b.NIVEL_BADGE,
        b.IMAGEM_BADGE,
        e.NOME_ESTADO as ESTADO_BADGE
      FROM pedidosBadge p
      JOIN badges b ON p.ID_BADGE = b.ID_BADGE
      JOIN estados e ON p.ESTADO_ATUAL = e.ID_ESTADO
      WHERE p.ID_CONSULTOR = ?
    ''', [idConsultor]);

    return res.map((map) => PedidoEcraModel.fromJson(map)).toList();
  }
}
