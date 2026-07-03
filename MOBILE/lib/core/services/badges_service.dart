import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../api_config.dart';
import '../models/badges_model.dart';
import '../app_state.dart';

class BadgesService {
  final String _endpoint = '${ApiConfig.baseUrlApi}';

  Future<List<BadgesModel>> fetchAllBadges() async {
    try {
      final response = await http.get(Uri.parse('$_endpoint/badges'));
      if (response.statusCode == 200) {
        List<dynamic> body = jsonDecode(response.body);
        return body.map((item) => BadgesModel.fromJson(item)).toList();
      } else {
        throw Exception('Erro ao obter Badges: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Falha na comunicação com a API: $e');
    }
  }

  Future<BadgesModel> fetchBadge(int id) async{
    try {
      final response = await http.get(Uri.parse('$_endpoint/badges/get/$id'));
      if(response.statusCode == 200){
        final resultado = jsonDecode(response.body);
        if(response.body.isNotEmpty){
          return BadgesModel.fromJson(resultado[0]);
        }else{
          throw Exception('Badge não encontrado.');
        }
      }else{
        throw Exception('Erro ao obter Badge: ${response.statusCode}');
      }
    }catch(e){
      throw Exception('Falha na comunicação com a API: $e');
    }
  }

  Future<List<BadgesModel>> fetchBadgesByArea(int idArea) async {
    try {
      final response = await http.get(Uri.parse('$_endpoint/badges/get/area/$idArea'));
      if (response.statusCode == 200) {
        List<dynamic> body = jsonDecode(response.body);
        return body.map((item) => BadgesModel.fromJson(item)).toList();
      } else {
        throw Exception('Erro ao obter Badges: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Falha na comunicação com a API: $e');
    }
  }

  Future<List<BadgesModel>> fetchBadgesPorConcluir(int idConsultor) async {
    try{
      final response = await http.get(Uri.parse('$_endpoint/consultores/badgesPorObter/lista/$idConsultor'));
      if(response.statusCode == 200){
        List<dynamic> body = jsonDecode(response.body);
        return body.map((item) => BadgesModel.fromJson(item)).toList();
      }else{
        throw Exception('Erro ao obter Badges Concluidos do consultor: ${response.statusCode}');
      }
    }catch(e){
      throw Exception('Falha na comunicação com a API: $e');
    }
  }

  Future<String> fetchEstadoBadgeConsultor(int idBadge, int idConsultor) async {
    try{
      final response = await http.get(Uri.parse('$_endpoint/badges/mobile/$idBadge/consultor/$idConsultor/estado'));
      if(response.statusCode == 200){
        return response.body;
      }else{
        throw Exception('Erro ao obter o estado do Badge para o Consultor: ${response.statusCode}');
      }
    }catch(e){
      throw Exception('Falha na comunicação com a API: $e');
    }
  }

  Future<bool> setBadgeFavorito(int idBadge, bool set) async {
    try {
      final String token = AppState().tokenLogin;
      final response = await http.post(
        Uri.parse('$_endpoint/badges/favorito/set'),
        headers: {
          'Content-Type': 'application/json',
          if (token.isNotEmpty) HttpHeaders.authorizationHeader: 'Bearer $token',
        },
        body: jsonEncode({
          'id_badge': idBadge,
          'set': set,
        }),
      );
      return response.statusCode == 200 || response.statusCode == 201;
    } catch (e) {
      return false;
    }
  }
}
