import 'dart:convert';
import 'package:http/http.dart' as http;
import '../api_config.dart';
import '../models/requisitos_model.dart';


class RequisitosService {
  final String _endpoint = '${ApiConfig.baseUrlApi}';

  Future<List<RequisitosModel>> fetchRequisitosBadge(int idBadge) async{
    try{
      final response = await http.get(Uri.parse('$_endpoint/requisitos/get/badge/$idBadge'));
      if(response.statusCode == 200){
        List<dynamic> body = jsonDecode(response.body);
        return body.map((item) => RequisitosModel.fromJson(item)).toList();
      }else{
        throw Exception('Erro ao obter Requisitos: ${response.statusCode}');
      }
    }catch(e){
      throw Exception('Falha na comunicação com a API: $e');
    }
  }





}