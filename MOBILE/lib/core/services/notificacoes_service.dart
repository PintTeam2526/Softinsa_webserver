import 'dart:convert';
import 'package:http/http.dart' as http;
import '../api_config.dart';
import '../models/notificacoes_model.dart';

class NotificacoesService {
  final String _endpoint = '${ApiConfig.baseUrlApi}';

  Future<List<NotificacoesModel>> fetchNotificacoesConsultor(int idConsultor) async {
    try{
      final response = await http.get(Uri.parse('$_endpoint/notificacoes/consultor/$idConsultor'));
      if(response.statusCode == 200){
        List<dynamic> body = jsonDecode(response.body);
        return body.map((item) => NotificacoesModel.fromJson(item)).toList();
      }else {
        throw Exception('Erro ao obter Notificacoes do consultor: ${response.statusCode}');
      }
    }catch(e){
      throw Exception('Falha na comunicação com a API: $e');
    }
  }


}