import 'package:intl/intl.dart'; //BIBLIOTECA PARA CONVERTER A DATA EM DIA/MES/ANO

class BadgesConcluidosModel {
  final int idBadgeConcluido;
  final int idConsultor;
  final int idBadge;
  final String nomeBadge;
  final String nomeAreaPai;
  final String nivelBadge;
  final int pontosBadge;
  final String imagemBadge;
  final int? validadeDias; // pode ser nulo (nao tem data de expiracao)
  final String dataConclusao;
  final String? dataExpiracaoBadge;
  final String nomeServiceLine;

  BadgesConcluidosModel({
    required this.idBadgeConcluido,
    required this.idConsultor,
    required this.idBadge,
    required this.nomeBadge,
    required this.nomeAreaPai,
    required this.nivelBadge,
    required this.pontosBadge,
    required this.imagemBadge,
    required this.dataConclusao,
    this.validadeDias,
    this.dataExpiracaoBadge,
    required this.nomeServiceLine,

  });

  factory BadgesConcluidosModel.fromJson(Map<String, dynamic> json) {
    String dataFormatada = "";
    String? expiracaoFormatada;

    if (json['DATA_CONCLUSAO'] != null && (json['DATA_CONCLUSAO'] as String).isNotEmpty) {
      String rawDate = json['DATA_CONCLUSAO'] as String;
      DateTime? dataOriginal;


      try {
        dataOriginal = DateTime.parse(rawDate);
      } catch (_) {
        try {
          dataOriginal = DateFormat('dd/MM/yyyy').parse(rawDate);
        } catch (_) {
          print(">>> [MODEL] Erro crítico ao dar parse da data: $rawDate");
        }
      }

      if (dataOriginal != null) {
        // Formatar sempre para dd/MM/yyyy para consistência no resto da App
        dataFormatada = DateFormat('dd/MM/yyyy').format(dataOriginal);

        // TRATAMENTO DA VALIDADE
        if (json['VALIDADE'] != null) {
          int dias = 0;
          if (json['VALIDADE'] is int) {
            dias = json['VALIDADE'];
          } else {
            dias = int.tryParse(json['VALIDADE'].toString()) ?? 0;
          }

          if (dias > 0) {
            DateTime dataExpiracao = dataOriginal.add(Duration(days: dias));
            expiracaoFormatada = DateFormat('dd/MM/yyyy').format(dataExpiracao);
          }
        }
      }
    }

    return BadgesConcluidosModel(
      idBadgeConcluido: json['ID_BADGE_CONCLUIDO'] ?? 0,
      idBadge: json['ID_BADGE'] ?? 0,
      idConsultor: json['ID_CONSULTOR'] ?? 0,
      nomeBadge: json['NOME_BADGE'] ?? "Sem Nome",
      nomeAreaPai: json['nome_area_pai'] ?? "Sem Área",
      nivelBadge: json['NIVEL_BADGE'] ?? "",
      pontosBadge: json['PONTOS_BADGE'] ?? 0,
      imagemBadge: json['IMAGEM_BADGE'] ?? "",
      nomeServiceLine: json['nome_sl_pai'] ?? "",
      dataConclusao: dataFormatada,
      dataExpiracaoBadge: expiracaoFormatada,
      validadeDias: json['VALIDADE'] != null ? int.tryParse(json['VALIDADE'].toString()) : null,
    );
  }
}
