import 'dart:convert';
import 'package:http/http.dart' as http;
import '../api_config.dart';
import '../models/areas_model.dart';

class AreasService{
  final String _endpoint = '${ApiConfig.baseUrlApi}';

  Future<List<AreasModel>> fetchAllAreas() async{
    try{
      final response = await http.get(Uri.parse('$_endpoint/areas/get'));
      if(response.statusCode == 200){
        List<dynamic> body = jsonDecode(response.body);
        return body.map((item) => AreasModel.fromJson(item)).toList();
      }else{
        throw Exception('Erro ao obter Areas: ${response.statusCode}');
      }
    }catch(e){
      throw Exception('Falha na comunicação com a API: $e');
    }
  }

  Future<AreasModel> fetchArea(int id) async{
    try {
      final response = await http.get(Uri.parse('$_endpoint/areas/$id/get'));
      if(response.statusCode == 200){
        final resultado = jsonDecode(response.body);
          return AreasModel.fromJson(resultado);
      }else{
        throw Exception('Erro ao obter Area: ${response.statusCode}');
      }
    }catch(e){
      throw Exception('Falha na comunicação com a API: $e');
    }
  }



  

}


