import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/rgpd_service.dart';
import '../models/rgpd_model.dart';
import 'dart:io';
//PROVIDER
final rgpdServiceProvider = Provider((ref) => RgpdRepository());

class RgpdRepository {

  Future<RgpdModel> fetchRgpd() async {
    try{
      var resultado = await RgpdService().fetchRgpd();
      if(!resultado.politica.isEmpty){
        return resultado;
      }else{
        throw Exception('Erro ao obter RGPD');
      }
    }catch(e){
      throw Exception('Falha na comunicação com o rgpd_service.dart: $e');
    }
  }

}



