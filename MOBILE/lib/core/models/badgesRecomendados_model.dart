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
      idBadge: int.tryParse((json['id_badge'] ?? json['ID_BADGE'] ?? json['id'] ?? '0').toString()) ?? 0,
      nomeBadge: (json['nome_badge'] ?? json['NOME_BADGE'] ?? json['nome'] ?? '').toString(),
      imagemBadge: (json['imagem_badge'] ?? json['IMAGEM_BADGE'] ?? json['imagem'] ?? '').toString(),
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
