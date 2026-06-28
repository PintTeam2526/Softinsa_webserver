class EstadosModel {
  final int idEstado;
  final String nome;
  final String descricao;

  EstadosModel({
    required this.idEstado,
    required this.nome,
    required this.descricao,
  });

  factory EstadosModel.fromJson(Map<String, dynamic> json) {
    return EstadosModel(
      // Suporta tanto id_estado (API padrão) quanto ID_ESTADO (DB padrão)
      idEstado: int.tryParse((json['id_estado'] ?? json['ID_ESTADO'] ?? '0').toString()) ?? 0,
      nome: (json['nome_estado'] ?? json['NOME_ESTADO'] ?? '').toString(),
      descricao: (json['descricao_estado'] ?? json['DESCRICAO_ESTADO'] ?? '').toString(),
    );
  }
}
