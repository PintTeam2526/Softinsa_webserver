import 'dart:convert';
import 'package:http/http.dart' as http;
import '../api_config.dart';
import '../models/objetivos_model.dart';
import '../models/badges_model.dart';

class ObjetivosService {
  final String _endpoint = '${ApiConfig.baseUrlApi}';

  Future<List<ObjetivosModel>> fetchObjetivos(int idConsultor) async {
    try{
      final response = await http.get(Uri.parse('$_endpoint/objetivos/get/$idConsultor'));
      if(response.statusCode == 200){
        List<dynamic> body = jsonDecode(response.body);
        return body.map((item) => ObjetivosModel.fromJson(item)).toList();
      }else {
        throw Exception('Erro ao obter Objetivos do consultor: ${response.statusCode}');
      }
    }catch(e){
      throw Exception('Falha na comunicação com a API: $e');
    }
  }

  Future<List<BadgesModel>> fetchBadgesParaObjetivos(int idConsultor) async {
    try{
        final response = await http.get(Uri.parse('$_endpoint/objetivos/badgesDisponiveis/$idConsultor'));
        if(response.statusCode == 200){
          List<dynamic> body = jsonDecode(response.body);
          return body.map((item) => BadgesModel.fromJson(item)).toList();
        }else{
          throw Exception('Erro ao obter Badges para Objetivos do consultor: ${response.statusCode}');
        }
    }catch(e){
      throw Exception('Falha na comunicação com a API: $e');
    }
  }

  Future<bool> adicionarObjetivo(int idConsultor, int idBadge, String nomeBadge,DateTime dataLimiteConclusao) async {
    try{
      final response = await http.post(Uri.parse('$_endpoint/objetivos/adicionar'),
        headers: {'Content-Type': 'application/json'},
        body : jsonEncode({
          "idBadge" : idBadge,
          "idConsultor" : idConsultor,
          "dataLimiteConclusao" : dataLimiteConclusao.toIso8601String(), //// transforma em String
          "nomeBadge" : nomeBadge,
        }),
      );

      if(response.statusCode == 500){
        print("Erro ao adicionar objetivo: ${response.statusCode}");
        return false;
      }else{
        return true;
      }
    }catch(e){
      throw Exception('Falha na comunicação com a API: $e');
    }
  }
}