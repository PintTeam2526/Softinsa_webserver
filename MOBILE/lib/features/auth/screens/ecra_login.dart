import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:pint_26_mobile/core/services/sync_service.dart';

import '../../../core/router/app_router.dart';
import '../../../core/app_state.dart';

import 'package:pint_26_mobile/features/auth/widgets/login_input.dart';
import 'package:pint_26_mobile/core/repositories/consultores_repository.dart';

import 'package:shared_preferences/shared_preferences.dart';

class EcraLogin extends ConsumerStatefulWidget {
  const EcraLogin({super.key});

  @override
  ConsumerState<EcraLogin> createState() => _EcraLoginState();
}

class _EcraLoginState extends ConsumerState<EcraLogin> {
  late final TextEditingController _emailController;
  late final TextEditingController _passwordController;
  bool _manterSessao = false;

  @override
  void initState() {
    super.initState();
    _emailController = TextEditingController();
    _passwordController = TextEditingController();
  }
  Future<void> _guardarSessao(int idConsultor, String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt('idConsultor', idConsultor);
    await prefs.setString('token', token);
    await prefs.setBool('isLoggedIn', true);
  }

  void _mostrarErro(String mensagem) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
            mensagem,
            textAlign: TextAlign.center,
        ),
        backgroundColor: Colors.redAccent,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );
  }

  @override
  void dispose() { 
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 60),
          children: [
            const Text(
              'BEM-VINDO',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.bold,
                color: Color(0xFF39639C),
                letterSpacing: 2,
              ),
            ),
            const SizedBox(height: 5),
            const Text(
              'Faça login para continuar',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 16, color: Colors.grey),
            ),
            const SizedBox(height: 50),

            LoginInput(
              texto: 'Email',
              placeholder: 'email@softinsa.pt',
              icone: 'lib/assets/icons/Icon_PerfilPublico_Navbar.svg',
              controller: _emailController,
            ),

            LoginInput(
              texto: 'Palavra-passe',
              placeholder: '••••••••',
              icone: 'lib/assets/icons/Icon_Password.svg',
              controller: _passwordController,
              isPassword: true,
            ),
            Row(
              children: [
                Checkbox(
                  value: _manterSessao,
                  onChanged: (value) {
                    setState(() {
                      _manterSessao = value ?? false;
                    });
                  },
                  activeColor: const Color(0xFF39639C),
                ),
                const Text(
                  'Manter sessão iniciada',
                  style: TextStyle(
                    color: Colors.grey,
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),

            const SizedBox(height: 10),
            
            SizedBox(
              width: double.infinity,
              height: 55,
              child: ElevatedButton(
                onPressed: () async{
                  final email = _emailController.text.trim();
                  final password = _passwordController.text.trim();

                  if(email.isEmpty || password.isEmpty){
                    _mostrarErro('Preencha todos os campos');
                    return;
                  }

                  final emailRegex = RegExp(r"^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.[a-zA-Z]+");
                  if(!emailRegex.hasMatch(email)){
                    _mostrarErro('Introduza um email válido.');
                    return;
                  }

                  final repositorio = ref.read(consultoresRepositoryProvider);
                  
                  try {
                    final idConsultorLogin = await repositorio.loginConsultor(email, password);

                    if(idConsultorLogin == 0){
                      _mostrarErro('Nome de utilizador ou palavra-passe incorretos');
                      return;
                    } else {
                      print("Login Efetuado com sucesso");
                      print("Token Armazenado com sucesso");

                      // Atualiza o estado global, a funcao repositorio.loginConsultor ja guarda o token no appState
                      AppState().idConsultor = idConsultorLogin;
                      //GUARDAR O TOKEN NO SHARED PREFERENCES
                      var prefs = await SharedPreferences.getInstance();
                      await prefs.setString('token', AppState().tokenLogin);
                      print("Token APPSTATE: ${AppState().tokenLogin}");
                      // GUARDA O ID DO CONSULTOR e token NAS SHARED PREFERENCES se o utilizador quiser
                      if (_manterSessao) {
                        await _guardarSessao(idConsultorLogin, AppState().tokenLogin);
                      }

                      print("Token Shared Preferences : ${prefs.getString('token')}");
                      // Navega para a homepage
                      context.go('/homepage', extra: idConsultorLogin);
                    }
                  } catch (e) {
                    _mostrarErro('Erro ao realizar login. Verifique a sua conexão.');
                    print("Erro Login: $e");
                  }

                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF39639C),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(15),
                  ),
                ),
                child: const Text(
                  'ENTRAR',
                  style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                ),
              ),
            ),
            const SizedBox(height: 15),
            Center(
              child: InkWell(
                onTap: () {
                },
                child: const Text(
                  'Esqueci-me da palavra-passe',
                  style: TextStyle(
                    color: Color(0xFF39639C),
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 10),
            Center(
              child: InkWell(
                onTap: () {
                    context.push(AppRoutes.registar);
                },
                child: const Text(
                  'Sou novo, pretendo registar uma nova conta',
                  style: TextStyle(
                    color: Color(0xFF39639C),
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
