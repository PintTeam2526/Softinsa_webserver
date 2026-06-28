class PedidosBadgeModel {
  final int idPedidoBadge;
  final int idConsultor;
  final int idBadge;
  final int idEstadoAtual;


  PedidosBadgeModel({
    required this.idPedidoBadge,
    required this.idConsultor,
    required this.idBadge,
    required this.idEstadoAtual,
  });


  factory PedidosBadgeModel.fromJson(Map<String,dynamic> json){
    return PedidosBadgeModel(
      idPedidoBadge: json['ID_PEDIDO_BADGE'] as int,
      idConsultor: json['ID_CONSULTOR'] as int,
      idBadge: json['ID_BADGE'] as int,
      idEstadoAtual: json['ESTADO_ATUAL'] as int,
    );
  }
}

