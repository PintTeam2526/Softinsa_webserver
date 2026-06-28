import 'package:intl/intl.dart';

class BadgesModel {
  int id;
  int id_area;
  String nome;
  String descricao;
  int pontos;
  bool pago_S_N;
  String nivel;
  String imagem;
  String? nome_area_pai;
  String data_insercao;
  bool estado_a_i;

  BadgesModel({
    required this.id,
    required this.id_area,
    required this.nome,
    required this.descricao,
    required this.pontos,
    required this.pago_S_N,
    required this.nivel,
    required this.imagem,
    this.nome_area_pai,
    required this.data_insercao,
    required this.estado_a_i,
  });

  factory BadgesModel.fromJson(Map<String, dynamic> json) {
    String formatDate(dynamic value) {
      if (value == null || value.toString().isEmpty) return "";
      if (value.toString().contains('/')) return value.toString();
      
      try {
        DateTime parsed = DateTime.parse(value.toString());
        return DateFormat('dd/MM/yyyy').format(parsed);
      } catch (e) {
        return value.toString();
      }
    }

    // Função auxiliar para converter valores dinâmicos (API ou SQLite) em booleano
    bool toBool(dynamic value) {
      if (value == null) return false;
      if (value is bool) return value;
      if (value is int) return value == 1;
      if (value is String) return value == '1' || value.toLowerCase() == 'true';
      return false;
    }

    return BadgesModel(
      id: int.tryParse((json['ID_BADGE'] ?? json['id'] ?? '0').toString()) ?? 0,
      id_area: int.tryParse((json['ID_AREA'] ?? json['id_area'] ?? '0').toString()) ?? 0,
      nome: (json['NOME_BADGE'] ?? json['nome'] ?? '').toString(),
      descricao: (json['DESCRICAO_BADGE'] ?? json['descricao'] ?? '').toString(),
      pontos: int.tryParse((json['PONTOS_BADGE'] ?? json['pontos'] ?? '0').toString()) ?? 0,
      pago_S_N: toBool(json['PAGO'] ?? json['pago_S_N']),
      nivel: (json['NIVEL_BADGE'] ?? json['nivel'] ?? '').toString(),
      imagem: (json['IMAGEM_BADGE'] ?? json['imagem'] ?? '').toString(),
      nome_area_pai: (json['nome_area_pai'] ?? json['nome_area_pai']).toString(),
      data_insercao: formatDate(json['DATA_INSERCAO'] ?? json['data_insercao']),
      estado_a_i: toBool(json['ESTADO_A_I_'] ?? json['estado_a_i']),
    );
  }
}
