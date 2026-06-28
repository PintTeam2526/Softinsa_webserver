import 'package:intl/intl.dart'; //BIBLIOTECA PARA CONVERTER A DATA EM DIA/MES/ANO

class NotificacoesModel {
  final int idNotificacao;
  final int idConsultor;
  final String notificacao;
  final String data_de_envio;
  final String remetente;
  final String descricao;



  NotificacoesModel({
    required this.idNotificacao,
    required this.idConsultor,
    required this.notificacao,
    required this.data_de_envio,
    required this.remetente,
    required this.descricao,
  });

  factory NotificacoesModel.fromJson(Map<String,dynamic> json){
    //FUNCAO DE CONVERSAO DA DATA

    String dataFormatada = "";
    if (json['DATA_DE_ENVIO'] != null) {
      DateTime dataOriginal = DateTime.parse(json['DATA_DE_ENVIO'] as String);
      dataFormatada = DateFormat('dd/MM/yyyy').format(dataOriginal);
    }

    return NotificacoesModel(
      idNotificacao: json['ID_NOTIFICACAO'] as int,
      idConsultor: json['ID_CONSULTOR'] as int,
      notificacao: json['NOTIFICACAO'] as String,
      remetente: json['REMETENTE'] as String,
      descricao: json['DESCRICAO'] as String,
      data_de_envio: dataFormatada,
    );
  }


}