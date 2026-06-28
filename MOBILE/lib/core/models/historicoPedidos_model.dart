import 'package:intl/intl.dart';

class HistoricoPedidosModel {
  final int idHistorico;
  final int idBadge;      // Antes idEstado
  final int idConsultor;  // Antes idPedidoBadge
  final String data;

  HistoricoPedidosModel({
    required this.idHistorico,
    required this.idBadge,
    required this.idConsultor,
    required this.data,
  });

  factory HistoricoPedidosModel.fromJson(Map<String, dynamic> json) {
    String formatDate(dynamic value) {
      if (value == null || value.toString().isEmpty) return "";
      try {
        DateTime parsed = DateTime.parse(value.toString());
        return DateFormat('dd/MM/yyyy').format(parsed);
      } catch (e) {
        return value.toString();
      }
    }

    return HistoricoPedidosModel(
      idHistorico: int.tryParse((json['id_historico'] ?? json['ID_HISTORICO'] ?? '0').toString()) ?? 0,
      idBadge: int.tryParse((json['id_badge'] ?? json['ID_BADGE'] ?? '0').toString()) ?? 0,
      idConsultor: int.tryParse((json['id_consultor'] ?? json['ID_CONSULTOR'] ?? '0').toString()) ?? 0,
      data: formatDate(json['data'] ?? json['DATA']),
    );
  }
}
