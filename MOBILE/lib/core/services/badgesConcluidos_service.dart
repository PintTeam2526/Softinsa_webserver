import 'dart:convert';
import 'package:http/http.dart' as http;
import '../api_config.dart';
import '../models/badgesConcluidos_model.dart';

class BadgesConcluidosService{
  final String _endpoint = '${ApiConfig.baseUrlApi}';

  Future<List<BadgesConcluidosModel>> fetchBadgesConcluidos(int idConsultor) async{
    try{
      final response = await http.get(Uri.parse('$_endpoint/badges/get/obtidos/$idConsultor'));
      if(response.statusCode == 200){
        List<dynamic> body = jsonDecode(response.body);
        return body.map((item) => BadgesConcluidosModel.fromJson(item)).toList();
      }else{
        throw Exception('Erro ao obter Badges Concluidos: ${response.statusCode}');
      }
    }catch(e){
      throw Exception('Falha na comunicação com a API: $e');
    }
  }
}
