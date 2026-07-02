import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class BadgesFavoritosModel {
  int id;
  int id_consultor;
  int? setFavorito; //boolean para indicar a api se e para adicionar como favorito (para remover colocar a null)

  BadgesFavoritosModel({
    required this.id,
    required this.id_consultor,
    required this.setFavorito,
  });

  factory BadgesFavoritosModel.fromJson(Map<String, dynamic> json) {

    return BadgesFavoritosModel(
      id: int.tryParse((json['id_badge'] ?? '0').toString()) ?? 0,
      id_consultor: int.tryParse((json['id_consultor'] ?? '0').toString()) ?? 0,
      setFavorito: int.tryParse((json['setFavorito'] ?? '0').toString()) ?? 1, //por defeito o que vem do sync e sempre favorito
    );
  }
}
