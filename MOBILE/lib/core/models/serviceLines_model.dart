//definir a tabela Learning Paths com os mesmos atributos e tipo de dados
import 'package:intl/intl.dart'; //BIBLIOTECA PARA CONVERTER A DATA EM DIA/MES/ANO

class ServiceLinesModel{
  final int id;
  final int id_learning_path;
  final String? nome_learning_path_pai; //nao tem que ser definido logo ao chamar a API pois nao existe ainda
  final String nome;
  final String descricao;
  final String imagem;
  final bool estado_a_i;
  final String data_insercao;

  ServiceLinesModel({
    required this.id,
    required this.id_learning_path,
    required this.nome,
    required this.descricao,
    required this.imagem,
    required this.estado_a_i,
    required this.data_insercao,
    this.nome_learning_path_pai,
  });

  //CONVERTE O MAP do JSON no objeto LEARNING_PATHS (factory -> converter o JSON (Map) num objeto Dart)
  factory ServiceLinesModel.fromJson(Map<String,dynamic> json){

    //FUNCAO DE CONVERSAO DA DATA
    String dataFormatada = "";
    if (json['DATA_INSERCAO'] != null) {
      DateTime dataOriginal = DateTime.parse(json['DATA_INSERCAO'] as String);
      dataFormatada = DateFormat('dd/MM/yyyy').format(dataOriginal);
    }


    return ServiceLinesModel(
      id: json['ID_SERVICELINE'] as int,
      id_learning_path: json['ID_LEARNINGPATH'] as int,
      nome: json['NOME_SERVICELINE'] as String,
      descricao: json['DESCRICAO_SERVICELINE'] as String,
      imagem: json['IMAGEM_SERVICE_LINE'] as String,
      estado_a_i: json['ESTADO_A_I_'] as bool,
      data_insercao: dataFormatada,
      nome_learning_path_pai: json['NOME_LP_PAI'] as String?, //pode receber nulo, dependendo da resposta da api
    );
  }
}