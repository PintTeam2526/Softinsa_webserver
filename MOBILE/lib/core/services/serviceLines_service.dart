import 'dart:convert';
import 'package:http/http.dart' as http;
import '../api_config.dart';
import '../models/serviceLines_model.dart';

class ServiceLinesService {

  final String _endpoint = '${ApiConfig.baseUrlApi}';

  //Vai buscar todos os Service Lines
  Future<List<ServiceLinesModel>> fetchAllServiceLines() async {
    try{
      final response = await http.get(Uri.parse('$_endpoint/servicelines/get/mobile'));

      if(response.statusCode == 200)
        {
            List<dynamic> body = jsonDecode(response.body);
            return body.map((item) => ServiceLinesModel.fromJson(item)).toList();
        }else{
          throw Exception('Erro ao obter Service Lines: ${response.statusCode}');
        }
      } catch(e){
      throw Exception('Falha na comunicação com a API: $e');
    }
  }


  Future <ServiceLinesModel> fetchServiceLineByID(int id) async{
    try{
      final response = await http.get(Uri.parse('$_endpoint/servicelines/get/mobile/$id'));

      if(response.statusCode == 200){
        final resultado = jsonDecode(response.body);
        if(response.body.isNotEmpty){
          return ServiceLinesModel.fromJson(resultado[0]);
        }else{
          throw Exception('Service Line não encontrada.');
        }
      }else{
        throw Exception('Erro ao obter o Service Line com id: $id');
      }
    }catch(e){
      throw Exception('Falha na comunicação com a API: $e');
    }
  }
  //ADICIONAR MAIS

}