//ESTE MODEL E USADO PARA A PAGINA DE PEDIDOS NAO PRECISA DE REPO POIS OS DADOS VEM DE UM SELECT

class PedidoEcraModel{
  final int idBadge;
  final String nomeBadge;
  final String nivelBadge;
  final String imagemBadge;
  final String estadoBadge;


  PedidoEcraModel({
    required this.idBadge,
    required this.nomeBadge,
    required this.nivelBadge,
    required this.imagemBadge,
    required this.estadoBadge,
  });

  factory PedidoEcraModel.fromJson(Map<String,dynamic> json){
    return PedidoEcraModel(
        idBadge: json['ID_BADGE'] as int,
        nomeBadge: json['NOME_BADGE'] as String,
        nivelBadge: json['NIVEL_BADGE'] as String,
        imagemBadge: json['IMAGEM_BADGE'] as String,
        estadoBadge: json['ESTADO_BADGE'] as String,
    );
  }


}