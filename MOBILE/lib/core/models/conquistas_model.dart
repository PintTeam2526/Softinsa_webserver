class ConquistasModel {
  final int id_conquista;
  final String descricao_conquista;
  final int pontos_conquista;
  final String tipo_conquista;
  final int valor_conquista;
  final String estado_conquista;
  final double progresso;

  ConquistasModel({
    required this.id_conquista,
    required this.descricao_conquista,
    required this.pontos_conquista,
    required this.tipo_conquista,
    required this.valor_conquista,
    required this.estado_conquista,
    this.progresso = 0.0,
  });

  factory ConquistasModel.fromJson(Map<String, dynamic> json) {
    return ConquistasModel(
      id_conquista: int.tryParse(json['id_conquista']?.toString() ?? '0') ?? 0,
      descricao_conquista: json['descricao_conquista']?.toString() ?? '',
      pontos_conquista: int.tryParse(json['pontos_conquista']?.toString() ?? '0') ?? 0,
      tipo_conquista: json['tipo_conquista']?.toString() ?? '',
      valor_conquista: int.tryParse(json['valor_conquista']?.toString() ?? '0') ?? 0,
      estado_conquista: json['estado_conquista']?.toString() ?? 'Por Obter',
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'ID_CONQUISTA': id_conquista,
      'DESCRICAO_CONQUISTA': descricao_conquista,
      'PONTOS_CONQUISTA': pontos_conquista,
      'TIPO_CONQUISTA': tipo_conquista,
      'VALOR_CONQUISTA': valor_conquista,
      'ESTADO_CONQUISTA': estado_conquista,
    };
  }

  ConquistasModel copyWith({double? progresso}) {
    return ConquistasModel(
      id_conquista: id_conquista,
      descricao_conquista: descricao_conquista,
      pontos_conquista: pontos_conquista,
      tipo_conquista: tipo_conquista,
      valor_conquista: valor_conquista,
      estado_conquista: estado_conquista,
      progresso: progresso ?? this.progresso,
    );
  }
}
