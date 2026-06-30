class BadgesRecomendadosModel {
  final int idBadge;
  final String nomeBadge;
  final String imagemBadge;

  BadgesRecomendadosModel({
   required this.idBadge,
   required this.nomeBadge,
   required this.imagemBadge,
});

  factory BadgesRecomendadosModel.fromJson(Map<String, dynamic> json) {
    return BadgesRecomendadosModel(
      idBadge: json['id_badge'],
      nomeBadge: json['nome_badge'],
      imagemBadge: json['imagem_badge']
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'ID_BADGE': idBadge,
      'NOME_BADGE': nomeBadge,
      'IMAGEM_BADGE': imagemBadge,
    };
  }
}