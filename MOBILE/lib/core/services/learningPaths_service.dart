import 'dart:convert';
import 'package:http/http.dart' as http;
import '../api_config.dart';
import '../models/learningPaths_model.dart';

// Classe de serviço para gerir os pedidos à API relacionados com Learning Paths
class LearningPathsService {
  // A URL base agora vem do ficheiro centralizado ApiConfig
  final String _endpoint = '${ApiConfig.baseUrlApi}';

  Future<List<LearningPathsModel>> fetchAllLearningPaths() async {
    try {
      final response = await http.get(Uri.parse('$_endpoint/learningpaths/get/mobile'));

      if (response.statusCode == 200) {
        List<dynamic> body = jsonDecode(response.body);
        return body.map((item) => LearningPathsModel.fromJson(item)).toList();
      } else {
        throw Exception('Erro ao obter Learning Paths: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Falha na comunicação com a API: $e');
    }
  }


  Future<LearningPathsModel> fetchLearningPathById(int id) async {
    try {
      final response = await http.get(Uri.parse('$_endpoint/learningpaths/get/mobile/$id'));

      if (response.statusCode == 200) {
        //vai guardar a resposta da api na variavel resultado
        final resultado = jsonDecode(response.body);

          if (resultado.isNotEmpty) {
            // RETORNA O PRIMEIRO ELEMENTO DA LISTA (POIS A API DEVOLVE SEMPRE OS DADOS EM LISTA)
            return LearningPathsModel.fromJson(resultado[0]);
          } else {
            throw Exception('Learning Path não encontrado.');
          }

      } else {
        throw Exception('Erro ao obter o Learning Path com id: $id');
      }
    } catch (e) {
      throw Exception('Falha na comunicação com a API: $e');
    }
  }
}
