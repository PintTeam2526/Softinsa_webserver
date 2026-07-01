import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:pint_26_mobile/core/app_state.dart';
import '../api_config.dart';

//PARA JA SO VAI CHAMAR O "sp_InserirDocumentacaoBadges" e o "sp_CandidaturaBadge"

class CandidaturasBadgeService {

  final String _endpoint = '${ApiConfig.baseUrlApi}';

  //CHAMAR O INSERIR DOCUMENTACAO
  Future<bool> submeterDocumentacao(String documentoBase64, String SessaoID) async {
    try{
      final response = await http.post(Uri.parse('$_endpoint/candidaturas/documentacao'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          "documentacao": documentoBase64,
          "sessaoId": SessaoID
        }),
      );
      if(response.statusCode == 200){
        return true;
      }else{
        print("Erro ao submeter a documentação: ${response.statusCode}");
        return false;
      }
    }catch(e){
      throw Exception('Falha na comunicação com a API: $e');
    }
  }

  //CHAMAR O SUBMETER DOCUMENTACAO
  Future<bool> candidatarBadge(int idConsultor, int idBadge, String SessaoID) async {
    try{
      var token = AppState().tokenLogin;
      //usar a mesma rota da web
      //final response = await http.post(Uri.parse('$_endpoint/candidaturas/candidatar'),
          final response = await http.post(Uri.parse('$_endpoint/pedidos/create'),
        headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer $token'},
        //body: jsonEncode({
          //"idConsultor": idConsultor,
         // "SessaoID": SessaoID,
          //"idBadge": idBadge
        //}),
            body: jsonEncode({
              "sessao_id": SessaoID,
              "id_badge": idBadge
            }),
      );
      if(response.statusCode == 200){
        return true;
      }else{
        print("Erro ao candidatar o badge: ${response.statusCode}");
        return false;
      }
    }catch(e){
      throw Exception('Falha na comunicação com a API: $e');
    }
  }

}