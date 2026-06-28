//definir a tabela Learning Paths com os mesmos atributos e tipo de dados
import 'package:intl/intl.dart'; // PACOTE RESPONSAVEL POR CONVERTER A DATA DA API

class LearningPathsModel {
  final int id;
  final String nome;
  final String descricao;
  final String imagem;
  final bool estado_a_i;
  final String data_insercao;
  final int progresso;

  LearningPathsModel({
    required this.id,
    required this.nome,
    required this.descricao,
    required this.imagem,
    required this.estado_a_i,
    required this.data_insercao,
    this.progresso = 0,
  });

  //CONVERTE O MAP do JSON no objeto LEARNING_PATHS (factory -> converter o JSON (Map) num objeto Dart)
  factory LearningPathsModel.fromJson(Map<String, dynamic> json) {
    String dataFormatada = "";

    //FUNCAO DE CONVERSAO DA DATA
    if (json['DATA_INSERCAO'] != null) {
      try {
        DateTime dataOriginal = DateTime.parse(json['DATA_INSERCAO'] as String);
        dataFormatada = DateFormat('dd/MM/yyyy').format(dataOriginal);
      } catch (e) {
        dataFormatada = json['DATA_INSERCAO'].toString();
      }
    }

    return LearningPathsModel(
      id: json['ID_LEARNINGPATH'] as int,
      nome: json['NOME_LEARNINGPATH'] as String,
      descricao: json['DESCRICAO_LEARNINGPATH'] as String,
      imagem: json['IMAGEM_LEARNING_PATH'] as String,
      estado_a_i: json['ESTADO_A_I_'] is int
          ? json['ESTADO_A_I_'] == 1
          : json['ESTADO_A_I_'] as bool,
      data_insercao: dataFormatada,
      progresso: 0, //por defeito comeca a 0
    );
  }

  LearningPathsModel copyWith({
    int? id,
    String? nome,
    String? descricao,
    String? imagem,
    bool? estado_a_i,
    String? data_insercao,
    int? progresso,
  }) {
    return LearningPathsModel(
      id: id ?? this.id,
      nome: nome ?? this.nome,
      descricao: descricao ?? this.descricao,
      imagem: imagem ?? this.imagem,
      estado_a_i: estado_a_i ?? this.estado_a_i,
      data_insercao: data_insercao ?? this.data_insercao,
      progresso: progresso ?? this.progresso,
    );
  }
}
