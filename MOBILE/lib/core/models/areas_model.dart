import 'package:intl/intl.dart';

class AreasModel {
  final int id;
  final int id_service_line;
  final String nome;
  final String descricao;
  final String imagem;
  final bool estado_a_i;
  final String data_insercao;
  final String? nome_service_line_pai;

  AreasModel({
    required this.id,
    required this.id_service_line,
    required this.nome,
    required this.descricao,
    required this.imagem,
    required this.estado_a_i,
    required this.data_insercao,
    this.nome_service_line_pai,
  });

  factory AreasModel.fromJson(Map<String, dynamic> json) {
    // Função auxiliar para chaves insensíveis a maiúsculas
    dynamic getValue(List<String> keys) {
      for (var key in keys) {
        if (json.containsKey(key)) return json[key];
      }
      return null;
    }

    // Conversão robusta da data
    String dataFormatada = "";
    var rawData = getValue(['data_insercao', 'DATA_INSERCAO']);
    if (rawData != null) {
      try {
        DateTime dataOriginal = DateTime.parse(rawData.toString());
        dataFormatada = DateFormat('dd/MM/yyyy').format(dataOriginal);
      } catch (e) {
        dataFormatada = rawData.toString();
      }
    }

    bool toBool(dynamic value) {
      if (value is bool) return value;
      if (value is int) return value == 1;
      if (value is String) return { 'true', '1', 'yes' }.contains(value.toLowerCase());
      return false;
    }

    String? nomeSL;
    var rawSL = getValue(['ServiceLine', 'SERVICELINE', 'service_line']);
    if (rawSL != null) {
      if (rawSL is Map) {
        nomeSL = (rawSL['nomeServiceLine'] ?? rawSL['NOME_SERVICELINE'])?.toString();
      } else if (rawSL is List && rawSL.isNotEmpty) {
        nomeSL = (rawSL.first['nomeServiceLine'] ?? rawSL.first['NOME_SERVICELINE'])?.toString();
      }
    }

    return AreasModel(
      id: int.tryParse(getValue(['id_area', 'ID_AREA', 'id', 'ID'])?.toString() ?? '0') ?? 0,
      id_service_line: int.tryParse(getValue(['id_service_line', 'ID_SERVICELINE'])?.toString() ?? '0') ?? 0,
      nome: getValue(['nome_area', 'NOME_AREA', 'nome', 'NOME'])?.toString() ?? '',
      descricao: getValue(['descricao_area', 'DESCRICAO_AREA', 'descricao'])?.toString() ?? '',
      imagem: getValue(['imagem_area', 'IMAGEM_AREA', 'imagem'])?.toString() ?? '',
      estado_a_i: toBool(getValue(['estado_a_i', 'ESTADO_A_I_'])),
      data_insercao: dataFormatada,
      nome_service_line_pai: nomeSL ?? getValue(['nome_service_line', 'NOME_SERVICE_LINE'])?.toString() ?? '',
    );
  }
}
