class ConquistasConsultoresModel{
  final int id_conquista_consultor;
  final int id_consultor;
  final int id_conquista;

  ConquistasConsultoresModel({
    required this.id_conquista_consultor,
    required this.id_consultor,
    required this.id_conquista
  });

  factory ConquistasConsultoresModel.fromJson(Map<String, dynamic> json) {
    return ConquistasConsultoresModel(
      id_conquista_consultor: int.tryParse(json['id_conquista_consultor']?.toString() ?? '0') ?? 0,
      id_consultor: int.tryParse(json['id_consultor']?.toString() ?? '0') ?? 0,
      id_conquista: int.tryParse(json['id_conquista']?.toString() ?? '0') ?? 0,
    );
  }
}