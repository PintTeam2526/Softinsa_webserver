import 'package:intl/intl.dart';

class DocumentacaoModel {
  final int id;
  final int id_historico;
  final int id_consultor;
  final String documentacao;

  DocumentacaoModel({
    required this.id,
    required this.id_historico,
    required this.id_consultor,
    required this.documentacao,
  });

  factory DocumentacaoModel.fromJson(Map<String, dynamic> json) {
    return DocumentacaoModel(
        id: int.tryParse((json['id'] ?? json['ID'] ?? '0').toString()) ?? 0,
        id_historico: int.tryParse((json['id_historico'] ?? json['ID_HISTORICO'] ?? '0').toString()) ?? 0,
        id_consultor: int.tryParse((json['id_consultor'] ?? json['ID_CONSULTOR'] ?? '0').toString()) ?? 0,
        documentacao: (json['documentacao'] ?? json['DOCUMENTACAO'] ?? '').toString(),
    );
  }
}