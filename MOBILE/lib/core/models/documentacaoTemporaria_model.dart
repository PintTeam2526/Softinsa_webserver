import 'package:intl/intl.dart';

class DocumentacaoTemporariaModel {
  final int id;
  final String sessao_id;
  final String documentacao;
  final String data_insercao;

  DocumentacaoTemporariaModel({
    required this.id,
    required this.sessao_id,
    required this.documentacao,
    required this.data_insercao,
  });

  factory DocumentacaoTemporariaModel.fromJson(Map<String, dynamic> json) {

    String dataFormatada = "";
    if (json['data_insercao'] != null) {
      try {
        DateTime dataOriginal = DateTime.parse(json['data_insercao'].toString());
        dataFormatada = DateFormat('dd/MM/yyyy').format(dataOriginal);
      } catch (e) {
        dataFormatada = json['data_insercao'].toString();
      }
    }

    return DocumentacaoTemporariaModel(
      id: int.tryParse((json['id'] ?? json['ID'] ?? '0').toString()) ?? 0,
      sessao_id: (json['sessao_id'] ?? json['SESSAO_ID'] ?? '').toString(),
      documentacao: (json['documentacao'] ?? json['DOCUMENTACAO'] ?? '').toString(),
      data_insercao: dataFormatada,
    );
  }



}