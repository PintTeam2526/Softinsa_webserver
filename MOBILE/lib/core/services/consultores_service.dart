import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../api_config.dart';
import '../models/consultores_model.dart';
import '../app_state.dart';

class ConsultoresService {

  final String _endpoint = '${ApiConfig.baseUrlApi}';



  Future <bool> registerConsultor(String nomeConsultor,String emailConsultor, String password, String username, String imagemConsultor, int idAreaPreferencia) async {
    try {
        final response = await http.post(Uri.parse('$_endpoint/autenticacao/register'),
          headers: {'Content-Type': 'application/json'}, // Obrigatório para o Node entender o JSON

          body: jsonEncode({
            "nome": nomeConsultor,
            "email": emailConsultor,
            "password": password,
            "username": username,
            "fotoPerfil": imagemConsultor,
            "idAreaPref": idAreaPreferencia
          }),
        );

        if (response.statusCode == 201) {
          return true;
        } else {
          print("Erro a criar o consultor: ${response.statusCode}");
          return false;
        }
    } catch(e){
      throw Exception('Falha na comunicação com a API: $e');
    }
  }


  //SE O LOGIN CORRER MAL, RETORNA 0 SENAO RETORNA O ID DO CONSULTOR EM QUESTAO
  Future<int> loginConsultor(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$_endpoint/autenticacao/mobile/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          "email": email,
          "password": password,
        }),
      );

      if (response.statusCode == 200) {
        print("Login bem sucedido");

        // 1. Decodificar o body da resposta
        final Map<String, dynamic> data = jsonDecode(response.body);

        // 2. Aceder à chave 'user' e depois ao 'id_consultor'
        // Nota: Na tua resposta da API o campo chama-se 'id_consultor' (com underscore)
        if (data.containsKey('user') && data['user']['id_consultor'] != null) {
          int idConsultor = data['user']['id_consultor'];

          //Guarda o token aqui se precisares dele para outras rotas!
          String token = data['token'];
          AppState().tokenLogin = token;

          return idConsultor;
        }
        return 0;
      } else {
        print("Login mal sucedido: ${response.statusCode}");
        return 0;
      }
    } catch (e) {
      print('Erro: $e');
      throw Exception('Falha na comunicação com a API: $e');
    }
  }

  Future<ConsultoresModel> getConsultorById(int idConsultor) async {
    try{
        final response = await http.get(Uri.parse('$_endpoint/consultores/info/$idConsultor'));
        if(response.statusCode == 200){
          final resultado = jsonDecode(response.body);
          if(response.body.isNotEmpty){
            return ConsultoresModel.fromJson(resultado[0]);
          }else{
            throw Exception('Consultor não encontrado.'); //NAO VAI ACONTECER POIS JA VERIFICAMOS NO LOGIN MAS OK :-)
          }
        }else{
          throw Exception('Erro ao obter Consultor: ${response.statusCode}');
        }
    }catch(e){
      throw Exception('Falha na comunicação com a API: $e');
    }
  }

  //O SP TRATA DOS NULOS, SE EXISTIREM NAO ALTERA
  Future <bool> updateConsultorInfo(int idConsultor, String? nome, String? email, int? idAreaPreferencia, String? imagemPerfil, String? passwordAtual, String? passwordNova) async{
    try{
      final response = await http.put(Uri.parse('$_endpoint/consultores/mobile/update'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${AppState().tokenLogin}',
          },
        body : jsonEncode({
          "idConsultor" : idConsultor,
          "nome": nome,
          "email": email,
          "idAreaPreferencia": idAreaPreferencia,
          "fotoPerfil": imagemPerfil,
          "passwordAtual": passwordAtual,
          "passwordNova": passwordNova
        }),
      );

      if(response.statusCode == 404){
        print("O consultor não existe: ${response.statusCode}");
        return false;
      }

      if(response.statusCode == 401){
        print("A password atual do consultor está incorreta: ${response.statusCode}");
        return false;
      }

      if (response.statusCode == 200){
        return true;
      }else{
        print("Erro ao atualizar dados do consultor: ${response.statusCode}");
        return false;
      }
    }catch(e){
      throw Exception('Falha na comunicação com a API: $e');
    }
  }

  Future <int> getCountBadgesObtidos(int idConsultor) async {
    try{
      final response = await http.get(Uri.parse('$_endpoint/consultores/count/badgesObtidos/$idConsultor'));
      if(response.statusCode == 200){
        final resultado = jsonDecode(response.body);
        return resultado[0]['COUNT_BADGES_OBTIDOS'] ?? -1; //-1 para saber se nao existe o campo
      }else{
        throw Exception('Erro ao obter contagem de badges obtidos: ${response.statusCode}');
      }
    }catch(e){
      throw Exception('Falha na comunicação com a API: $e');
    }
  }

  Future <int> getCountBadgesPorObter(int idConsultor) async {
    try{
      final response = await http.get(Uri.parse('$_endpoint/consultores/count/badgesPorObter/$idConsultor'));
      if(response.statusCode == 200){
        final resultado = jsonDecode(response.body);
        return resultado[0]['COUNT_BADGES_POR_OBTER'] ?? 0;
      }else{
        throw Exception('Erro ao obter contagem de badges por obter: ${response.statusCode}');
      }
    }catch(e){
      throw Exception('Falha na comunicação com a API: $e');
    }
  }

  Future<int> getCountObjetivosPorCompletar(int idConsultor) async {
    try{
      final response = await http.get(Uri.parse('$_endpoint/consultores/count/objetivos/porCompletar/$idConsultor'));
      if(response.statusCode == 200){
        final resultado = jsonDecode(response.body);
        return resultado[0]['COUNT_OBJETIVOS_POR_CONCLUIR'] ?? -1; //-1 para saber se nao existe o campo
      }else{
        throw Exception('Erro ao obter contagem de objetivos por completar: ${response.statusCode}');
      }
    }catch(e){
      throw Exception('Falha na comunicação com a API: $e');
    }
  }

  //POIS PODE SER INT OU NULL
  Future<int?> getDiasObjetivoExpirar(int idConsultor) async {
    try{
      final response = await http.get(Uri.parse('$_endpoint/consultores/objetivos/minDiasAteExpirar/$idConsultor'));
      if(response.statusCode == 200){
        final resultado = jsonDecode(response.body);
        return resultado[0]['DIAS_OBJETIVO_MAIS_RECENTE_EXPIRAR'];
      }else{
        throw Exception('Erro ao obter os dias de expiracao do objetivo mais recente por completar: ${response.statusCode}');
      }
    }catch(e){
      throw Exception('Falha na comunicação com a API: $e');
    }
  }



}



