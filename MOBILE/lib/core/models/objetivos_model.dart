import 'package:intl/intl.dart';

class ObjetivosModel {
  final int id;
  final int id_badge;
  final int id_consultor;
  final String data_limite_conclusao;
  final String nome;
  final String? data_conclusao_objetivo;

  ObjetivosModel({
    required this.id,
    required this.id_badge,
    required this.id_consultor,
    required this.data_limite_conclusao,
    required this.nome,
    this.data_conclusao_objetivo,
  });

  factory ObjetivosModel.fromJson(Map<String, dynamic> json) {
    String formatDate(dynamic value) {
      if (value == null || value.toString().isEmpty) return "";
      try {
        DateTime parsed = DateTime.parse(value.toString());
        return DateFormat('dd/MM/yyyy').format(parsed);
      } catch (e) {
        return value.toString();
      }
    }

    return ObjetivosModel(
      id: int.tryParse((json['id_objetivo'] ?? json['ID_OBJETIVO'] ?? '0').toString()) ?? 0,
      id_badge: int.tryParse((json['id_badge'] ?? json['ID_BADGE'] ?? '0').toString()) ?? 0,
      id_consultor: int.tryParse((json['id_consultor'] ?? json['ID_CONSULTOR'] ?? '0').toString()) ?? 0,
      data_limite_conclusao: formatDate(json['data_limite_conclusao'] ?? json['DATA_LIMITE_CONCLUSAO']),
      nome: (json['nome_objetivo'] ?? json['NOME_OBJETIVO'] ?? '').toString(),
      data_conclusao_objetivo: formatDate(json['data_conclusao_objetivo'] ?? json['DATA_CONCLUSAO_OBJETIVO']),
    );
  }
}
