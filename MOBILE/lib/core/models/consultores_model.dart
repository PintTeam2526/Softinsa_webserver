class ConsultoresModel {
  final int idConsultor;
  final int pontos;
  final int idAreaPreferencia;
  final String nomeAreaPreferencia;
  final String username;
  final String nomeUtilizador;
  final String emailUtilizador;
  final String imagemPerfil;

  ConsultoresModel({
    required this.idConsultor,
    required this.pontos,
    required this.idAreaPreferencia,
    required this.nomeAreaPreferencia,
    required this.nomeUtilizador,
    required this.emailUtilizador,
    required this.imagemPerfil,
    required this.username,
  });

  factory ConsultoresModel.fromJson(Map<String, dynamic> json) {
    int toInt(dynamic value) {
      if (value == null) return 0;
      if (value is int) return value;
      if (value is String) return int.tryParse(value) ?? 0;
      return 0;
    }

    // Mapeamento extremamente robusto para aceitar chaves da BD e da API (várias versões)
    return ConsultoresModel(
      idConsultor: toInt(json['ID_CONSULTOR'] ?? json['id_consultor'] ?? json['idConsultor'] ?? json['id']),
      pontos: toInt(json['TOTAL_PONTOS'] ?? json['total_pontos'] ?? json['totalPontos'] ?? json['pontos'] ?? json['PONTOS']),
      idAreaPreferencia: toInt(json['ID_AREA_PREFERENCIA'] ?? json['id_area_preferencia'] ?? json['idAreaPreferencia'] ?? json['idAreaPref']),
      nomeAreaPreferencia: (json['NOME_AREA_PREFERENCIA'] ?? json['nome_area_preferencia'] ?? json['nomeAreaPreferencia'] ?? json['nomeAreaPref'] ?? '').toString(),
      nomeUtilizador: (json['NOME_UTILIZADOR'] ?? json['nome_utilizador'] ?? json['nomeUtilizador'] ?? json['nome'] ?? json['NOME'] ?? '').toString(),
      emailUtilizador: (json['EMAIL_UTILIZADOR'] ?? json['email_utilizador'] ?? json['emailUtilizador'] ?? json['email'] ?? json['EMAIL'] ?? '').toString(),
      imagemPerfil: (json['IMAGEM_PERFIL'] ?? json['imagem_perfil'] ?? json['imagemPerfil'] ?? json['fotoPerfil'] ?? json['foto'] ?? '').toString(),
      username: (json['USERNAME_UTILIZADOR'] ?? json['username_utilizador'] ?? json['usernameUtilizador'] ?? json['username'] ?? '').toString(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'ID_CONSULTOR': idConsultor,
      'TOTAL_PONTOS': pontos,
      'ID_AREA_PREFERENCIA': idAreaPreferencia,
      'NOME_AREA_PREFERENCIA': nomeAreaPreferencia,
      'NOME_UTILIZADOR': nomeUtilizador,
      'EMAIL_UTILIZADOR': emailUtilizador,
      'IMAGEM_PERFIL': imagemPerfil,
      'USERNAME_UTILIZADOR': username,
    };
  }
}
