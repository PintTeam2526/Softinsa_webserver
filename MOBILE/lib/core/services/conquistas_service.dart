import 'dart:convert';
import 'package:http/http.dart' as http;
import '../api_config.dart';
import '../models/conquistas_model.dart';
import '../app_state.dart';

class ConquistasService {
  final String _endpoint = ApiConfig.baseUrlApi;

  Future<List<ConquistasModel>> fetchAllConquistas() async {
    try {
      final idConsultor = AppState().idConsultor;
      final response = await http.get(Uri.parse('$_endpoint/conquistas/mobile/get/$idConsultor'));

      if (response.statusCode == 200) {
        List<dynamic> body = jsonDecode(response.body);
        return body.map((item) => ConquistasModel.fromJson(item)).toList();
      } else {
        throw Exception('Erro ao obter a lista das Conquistas: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Falha na comunicação com a API: $e');
    }
  }
}
