import 'dart:io';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';

import 'package:pint_26_mobile/features/auth/widgets/login_input.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_areaPreferencia.dart';
import 'package:pint_26_mobile/features/home/widgets/rgpd_modal.dart';

//IMPORT DO REPO PARA CRIAR O CONSULTOR
import 'package:pint_26_mobile/core/repositories/consultores_repository.dart';

//IMPORT DO REPO PARA CHAMAR OS TERMOS RGPD
import 'package:pint_26_mobile/core/models/rgpd_model.dart';
import 'package:pint_26_mobile/core/repositories/rgpd_repository.dart';

class EcraRegistar extends ConsumerStatefulWidget {
  const EcraRegistar({super.key});

  @override
  ConsumerState<EcraRegistar> createState() => _EcraRegistarState();
}

class _EcraRegistarState extends ConsumerState<EcraRegistar> {
  late final TextEditingController _emailController;
  late final TextEditingController _passwordController;
  late final TextEditingController _passwordConfirmController;
  late final TextEditingController _nomeController;
  late final TextEditingController _areaController;
  late final TextEditingController _usernameController;

  int? _idAreaSelecionada; 
  File? _imagemSelecionada;
  final ImagePicker _picker = ImagePicker();



  @override
  void initState() {
    super.initState();
    _emailController = TextEditingController();
    _passwordController = TextEditingController();
    _passwordConfirmController = TextEditingController();
    _nomeController = TextEditingController();
    _areaController = TextEditingController();
    _usernameController = TextEditingController();
  }

  // Função para selecionar imagem da galeria
  Future<void> _selecionarImagem() async {
    final XFile? image = await _picker.pickImage(source: ImageSource.gallery, imageQuality: 50);
    if (image != null) {
      setState(() {
        _imagemSelecionada = File(image.path);
      });
    }
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

  void _mostrarSucesso(String mensagem) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(mensagem, textAlign: TextAlign.center),
        backgroundColor: Colors.green,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _nomeController.dispose();
    _passwordConfirmController.dispose();
    _areaController.dispose();
    _usernameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFF39639C);
    // Aceder ao repositório via Provider
    final repositorio = ref.read(consultoresRepositoryProvider);

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
       child: ListView(
         padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 30),
         children: [
           const Text(
             'Registar',
             textAlign: TextAlign.center,
             style: TextStyle(
               fontSize: 32,
               fontWeight: FontWeight.bold,
               color: primaryColor,
               letterSpacing: 2,
             ),
           ),
           const SizedBox(height: 10),
           const Text(
             'Preencha os dados abaixo para registar',
             textAlign: TextAlign.center,
             style: TextStyle(fontSize: 16, color: Colors.grey),
           ),
           const SizedBox(height: 25),

           // SELEÇÃO DE FOTO DE PERFIL
           Center(
             child: Stack(
               children: [
                 CircleAvatar(
                   radius: 60,
                   backgroundColor: Colors.grey[200],
                   backgroundImage: _imagemSelecionada != null 
                       ? FileImage(_imagemSelecionada!) 
                       : const AssetImage('lib/assets/images/default-consultor-pfp.png') as ImageProvider,
                 ),
                 Positioned(
                   bottom: 0,
                   right: 0,
                   child: GestureDetector(
                     onTap: _selecionarImagem,
                     child: Container(
                       padding: const EdgeInsets.all(8),
                       decoration: const BoxDecoration(
                         color: primaryColor,
                         shape: BoxShape.circle,
                       ),
                       child: const Icon(Icons.camera_alt, color: Colors.white, size: 20),
                     ),
                   ),
                 ),
               ],
             ),
           ),
           const SizedBox(height: 25),

           //INPUT NOME
           LoginInput(
               texto: 'Nome Completo',
               placeholder: 'Miguel José',
               icone: 'lib/assets/icons/Icon_PerfilPublico_Navbar.svg',
               controller: _nomeController
           ),
           //INPUT USERNAME
           LoginInput(
               texto: 'Nome Utilizador',
               placeholder: 'migueljose12',
               icone: 'lib/assets/icons/Icon_PerfilPublico_Navbar.svg',
               controller: _usernameController
           ),
           //INPUT EMAIL
           LoginInput(
             texto: 'Email',
             placeholder: 'email@softinsa.pt',
             icone: 'lib/assets/icons/Icon_Email.svg',
             controller: _emailController,
           ),
           // PASWORD
           LoginInput(
             texto: 'Palavra-passe',
             placeholder: '••••••••',
             icone: 'lib/assets/icons/Icon_Password.svg',
             controller: _passwordController,
             isPassword: true,
           ),
           LoginInput(
             texto: 'Confirmar Palavra-passe',
             placeholder: '••••••••',
             icone: 'lib/assets/icons/Icon_Password.svg',
             controller: _passwordConfirmController,
             isPassword: true,
           ),
           
           AreaPreferencia(
               controller: _areaController,
               onAreaSelected: (id) {
                 setState(() {
                   _idAreaSelecionada = id;
                 });
               },
           ),

          const SizedBox(height: 25),

           // Botão de Registar
           SizedBox(
             width: double.infinity,
             height: 55,
             child: ElevatedButton(
               onPressed: () async {
                 final nome = _nomeController.text.trim();
                 final email = _emailController.text.trim();
                 final password = _passwordController.text.trim();
                 final passwordConfirm = _passwordConfirmController.text.trim();
                 final username = _usernameController.text.trim();

                 if(nome.isEmpty || email.isEmpty || password.isEmpty || passwordConfirm.isEmpty || _idAreaSelecionada == null || username.isEmpty){
                   _mostrarErro('Preencha todos os campos corretamente.');
                   return;
                 }

                 final emailRegex = RegExp(r"^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.[a-zA-Z]+");
                 if(!emailRegex.hasMatch(email)){
                   _mostrarErro('Introduza um email válido.');
                   return;
                 }

                 if(password != passwordConfirm){
                   _mostrarErro('As palavras-passe não coincidem.');
                   return;
                 }

                 final usernameRegex = RegExp(r'^[a-zA-Z0-9]+$');
                 if (!usernameRegex.hasMatch(username)) {
                   _mostrarErro(
                       'O nome de utilizador não pode conter espaços, acentos ou carateres especiais.');
                   return;
                 }


                 // CONVERTE A IMAGEM SELECIONADA EM BASE64
                 String imagemBase64 = "";
                 if (_imagemSelecionada != null) {
                   List<int> imageBytes = await _imagemSelecionada!.readAsBytes();
                   imagemBase64 = base64Encode(imageBytes);
                 } else {
                   //CASO NAO TENHA SELECIONADO FOTO CONVERTE A DEFAULT
                   try {
                     final byteData = await DefaultAssetBundle.of(context)
                         .load('lib/assets/images/default-consultor-pfp.png');
                     final bytes = byteData.buffer.asUint8List();
                     imagemBase64 = base64Encode(bytes);
                   } catch (e) {
                     print("Erro ao carregar imagem default: $e");
                     imagemBase64 = ""; // Fallback
                   }

                 }

                 print("A executar");
                 // CHAMAR O REPOSITORIO DE REGISTO via Riverpod
                 try {
                   final registo = await repositorio.criarConsultor(
                     nome,
                     email,
                     password,
                     username,
                     imagemBase64,
                     _idAreaSelecionada!,
                   );

                   if (registo) {
                     _mostrarSucesso('Conta criada com sucesso!');
                     context.pop();
                   } else {
                     _mostrarErro('Erro ao criar conta. Tente novamente com um nome utilizador diferente.');
                   }
                 } catch (e) {
                   _mostrarErro('Erro de ligação. Verifique a sua conexão.');
                   print("Erro Registo: $e");
                 }
               },
               style: ElevatedButton.styleFrom(
                 backgroundColor: primaryColor,
                 shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
               ),
               child: const Text(
                 'Registar',
                 style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
               ),
             ),
           ),
          const SizedBox(height: 10),
           Center(
             child: InkWell(
               onTap: () async {
                 showDialog(
                   context: context,
                   barrierDismissible: true, //Permite Abrir/Fechar o loading manualmente
                   builder: (context) => const Center(
                     child: CircularProgressIndicator(color: primaryColor),
                   ),
                 );

                 try {
                   final rgpd = await ref.read(rgpdServiceProvider).fetchRgpd();

                   if (context.mounted) {
                     Navigator.pop(context);

                     showDialog(
                       context: context,
                       builder: (BuildContext context) => RgpdModal(textoRgpd: rgpd.politica),
                     );
                   }
                 } catch (e) {
                   if (context.mounted) Navigator.pop(context);
                   _mostrarErro("Não foi possível carregar os termos RGPD.");
                 }
               },
               child: const Text.rich(
                 TextSpan(
                   text: 'Ao registar aceito os ',
                   style: TextStyle(color: Colors.grey, fontSize: 14),
                   children: [
                     TextSpan(
                       text: 'Termos e Condições',
                       style: TextStyle(
                         color: primaryColor,
                         fontWeight: FontWeight.bold,
                         decoration: TextDecoration.underline,
                       ),
                     ),
                   ],
                 ),
                 textAlign: TextAlign.center,
               ),
             ),
           ),
           const SizedBox(height: 10),
           Center(
             child: InkWell(
               onTap: () => context.pop(),
               child: const Text(
                 'Já possuo uma conta',
                 style: TextStyle(color: primaryColor, fontSize: 14, fontWeight: FontWeight.w500),
               ),
             ),
           ),
         ],
       ),
      ),
    );
  }
}
