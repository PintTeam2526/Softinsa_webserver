import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/repositories/consultores_repository.dart';
import '../widgets/login_input.dart';
import '../widgets/modal_inserirCodigoRecuperacao.dart';

class EcraRecuperarPassword extends ConsumerStatefulWidget {
  const EcraRecuperarPassword({super.key});

  @override
  ConsumerState<EcraRecuperarPassword> createState() => _EcraRecuperarPasswordState();
}

class _EcraRecuperarPasswordState extends ConsumerState<EcraRecuperarPassword> {
  late final TextEditingController _emailController;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _emailController = TextEditingController();
  }

  void _mostrarErro(String mensagem) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(mensagem, textAlign: TextAlign.center),
        backgroundColor: Colors.redAccent,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );
  }

  void _abrirModalCodigo(String email) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => ModalRecuperacaoPassword(email: email),
    ).then((sucesso) {
      if (sucesso == true) {
        // Se a password foi alterada com sucesso no modal, voltamos para o login
        context.go('/login');
      }
    });
  }

  @override
  void dispose() {
    _emailController.dispose();
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
              'Recuperar Password',
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
              'Introduz o teu email e enviamos um código de recuperação',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 16, color: Colors.grey),
            ),
            const SizedBox(height: 150),

            LoginInput(
              texto: 'Email',
              placeholder: 'email@softinsa.pt',
              icone: 'lib/assets/icons/Icon_PerfilPublico_Navbar.svg',
              controller: _emailController,
            ),

            const SizedBox(height: 10),

            SizedBox(
              width: double.infinity,
              height: 55,
              child: ElevatedButton(
                onPressed: _isLoading ? null : () async {
                  final email = _emailController.text.trim();

                  if (email.isEmpty) {
                    _mostrarErro('Preencha o email');
                    return;
                  }

                  final emailRegex = RegExp(r"^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.[a-zA-Z]+");
                  if (!emailRegex.hasMatch(email)) {
                    _mostrarErro('Introduza um email válido.');
                    return;
                  }

                  setState(() => _isLoading = true);
                  
                  try {
                    final repositorio = ref.read(consultoresRepositoryProvider);
                    final sucesso = await repositorio.enviarCodigoRecuperacao(email);
                    
                    setState(() => _isLoading = false);

                    if (sucesso) {
                      _abrirModalCodigo(email);
                    } else {
                      _mostrarErro('Erro ao enviar o código. Verifique o email.');
                    }
                  } catch (e) {
                    setState(() => _isLoading = false);
                    _mostrarErro('Erro de ligação à API.');
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF39639C),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(15),
                  ),
                ),
                child: _isLoading 
                  ? const CircularProgressIndicator(color: Colors.white)
                  : const Text(
                      'ENVIAR CÓDIGO',
                      style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                    ),
              ),
            ),
            const SizedBox(height: 15),
            Center(
              child: InkWell(
                onTap: () => context.pop(),
                child: const Text(
                  'Lembrei-me da password',
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
