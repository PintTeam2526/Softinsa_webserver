class RequisitosModel{
  final int id;
  final int id_badge;
  final String nome;
  final String descricao;
  final String imagem;
  final bool estado_a_i;


  RequisitosModel({
    required this.id,
    required this.id_badge,
    required this.nome,
    required this.descricao,
    required this.imagem,
    required this.estado_a_i,
  });

  factory RequisitosModel.fromJson(Map<String, dynamic> json) {
    bool toBool(dynamic value) {
      if (value is bool) return value;
      if (value is int) return value == 1;
      if (value is String) return { 'true', '1', 'yes' }.contains(value.toLowerCase());
      return false;
    }

    return RequisitosModel(
      id: int.tryParse((json['id_requisito'] ?? json['ID_REQUISITO'] ?? '0').toString()) ?? 0,
      id_badge: int.tryParse((json['id_badge'] ?? json['ID_BADGE'] ?? '0').toString()) ?? 0,
      nome: (json['nome_requisito'] ?? json['NOME_REQUISITO'] ?? '').toString(),
      descricao: (json['descricao_requisito'] ?? json['DESCRICAO_REQUISITO'] ?? '').toString(),
      imagem: (json['imagem_requisito'] ?? json['IMAGEM_REQUISITO'] ?? '').toString(),
      estado_a_i: toBool(json['estado_a_i'] ?? json['ESTADO_A_I_']),
    );
  }
}