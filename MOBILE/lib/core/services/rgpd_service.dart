import 'dart:convert';
import 'package:http/http.dart' as http;
import '../api_config.dart';
import '../app_state.dart';

import '../models/rgpd_model.dart';

class RgpdService {
  final String _endpoint = ApiConfig.baseUrlApi;

  Future<RgpdModel> fetchRgpd() async {
  try{
    final response = await http.get(Uri.parse('$_endpoint/gestao/rgpd/get'));

    if(response.statusCode == 200){
      final resultado = jsonDecode(response.body);
      return RgpdModel.fromJson(resultado);
    }else{
      throw Exception('Erro ao obter RGPD: ${response.statusCode}');
    }
  }catch(e){
      throw Exception('Falha na comunicação com a API: $e');
    }
  }
}