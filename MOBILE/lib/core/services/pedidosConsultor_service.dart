import 'dart:convert';
import 'package:http/http.dart' as http;
import '../api_config.dart';
import '../models/pedidosEcra_model.dart';



class PedidosConsultorService {
  final String _endpoint = '${ApiConfig.baseUrlApi}';


  //VAI POPULAR OS CARDS NA PAGINA DE PEDIDOS
  Future<List<PedidoEcraModel>> fetchPedidosConsultor(int idConsultor) async {
    try {
      final response = await http.get(Uri.parse('$_endpoint/pedidos/estado/consultor/$idConsultor'));

      if (response.statusCode == 200) {
        final List<dynamic> jsonData = jsonDecode(utf8.decode(response.bodyBytes));
        return jsonData.map((item) => PedidoEcraModel.fromJson(item)).toList();
      } else {
        throw Exception('Erro ao obter pedidos: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Falha na comunicação com a API: $e');
    }
  }
}

