import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class AppState {
  static final AppState _instance = AppState._internal();
  factory AppState() => _instance;
  AppState._internal();

  int idConsultor = 0;
  String tokenLogin = "";

  // VERIFICA SE O TOKEN ESTÁ EXPIRADO
  bool isTokenExpired() {
    if (tokenLogin.isEmpty) return true;

    try {
      // O JWT tem 3 partes separadas por pontos: Header.Payload.Signature
      final partes = tokenLogin.split('.');
      if (partes.length != 3) return true;

      // O Payload é a segunda parte
      final payload = partes[1];

      // Normalizar a string base64 (o Dart exige que o tamanho seja múltiplo de 4)
      String normalizedSource = base64Url.normalize(payload);
      final String resp = utf8.decode(base64Url.decode(normalizedSource));
      final Map<String, dynamic> data = jsonDecode(resp);

      if (data.containsKey('exp')) {
        final int exp = data['exp'];
        final DateTime dataExpiracao = DateTime.fromMillisecondsSinceEpoch(exp * 1000);

        // Se a data atual for depois da expiração, retornamos true (expirou)
        return DateTime.now().isAfter(dataExpiracao);
      }
    } catch (e) {
      print("Erro ao validar token: $e");
      return true; // Na dúvida, assume que expirou
    }
    return false;
  }

  // LIMPA TUDO (AppState + Shared Preferences), usar no logout
  Future<void> logout() async {
    idConsultor = 0;
    tokenLogin = "";

    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('idConsultor');
    await prefs.remove('token');
    await prefs.remove('isLoggedIn');
    print("Sessão terminada e dados removidos.");
  }
}