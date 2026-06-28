import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'dart:io';
import 'dart:convert';
import 'dart:typed_data';
import 'package:image_picker/image_picker.dart';

import 'package:pint_26_mobile/features/home/widgets/consultor_appbar.dart';
import '../../auth/widgets/login_input.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_areaPreferencia.dart';
import 'package:pint_26_mobile/core/app_state.dart'; //PARA IR BUSCAR O ID DO CONSULTOR LOGADO

//CARREGAR OS DADOS
import 'package:pint_26_mobile/core/models/consultores_model.dart';
import 'package:pint_26_mobile/core/repositories/consultores_repository.dart';


class EcraAlterarDefinicoes extends StatefulWidget {
  const EcraAlterarDefinicoes({super.key,});

  @override
  State<EcraAlterarDefinicoes> createState() => _EcraAlterarDefinicoesState();
}

class _EcraAlterarDefinicoesState extends State<EcraAlterarDefinicoes> {
  late final TextEditingController _nomeController;
  late final TextEditingController _emailController;
  late final TextEditingController _alterarPasswordController;
  late final TextEditingController _passwordAtualController;
  late final TextEditingController _alterarAreaController;
  
  File? _imagemPerfilLocal;
  final ConsultoresRepository _repositorioConsultores = ConsultoresRepository();
  late Future<ConsultoresModel> _futureConsultor;
  int? _idAreaSelecionada;

  @override
  void initState(){
    super.initState();
    _nomeController = TextEditingController();
    _emailController = TextEditingController();
    _alterarPasswordController = TextEditingController();
    _passwordAtualController = TextEditingController();
    _alterarAreaController = TextEditingController();
    _futureConsultor = _repositorioConsultores.getConsultorById(AppState().idConsultor);
  }

  @override
  void dispose() {
    _nomeController.dispose();
    _emailController.dispose();
    _alterarPasswordController.dispose();
    _passwordAtualController.dispose();
    _alterarAreaController.dispose();
    super.dispose();
  }

  // Função auxiliar Robusta para converter Base64 em bytes
  Uint8List _getImageBytes(String base64String) {
    try {
      // 1. Remove o prefixo se existir
      String cleanBase64 = base64String.contains(',') 
          ? base64String.split(',').last 
          : base64String;
      
      // 2. Limpeza profunda: remove todos os tipos de espaços, tabs e quebras de linha em qualquer parte da string
      cleanBase64 = cleanBase64.replaceAll(RegExp(r'\s+'), '');
      
      // 3. Normaliza caracteres URL-safe se existirem
      cleanBase64 = cleanBase64.replaceAll('-', '+').replaceAll('_', '/');

      // 4. Garante que o comprimento é múltiplo de 4
      int paddingNeeded = (4 - (cleanBase64.length % 4)) % 4;
      cleanBase64 += '=' * paddingNeeded;
      
      return base64Decode(cleanBase64);
    } catch (e) {
      debugPrint("Erro ao processar Base64: $e");
      return Uint8List(0);
    }
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
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Colors.white,
        appBar: const PaginaAppBar(
            titulo: 'Alterar Perfil',
            logo: 'lib/assets/icons/Icon_Definicoes.svg'
        ),
        body: FutureBuilder<ConsultoresModel>(
          future: _futureConsultor,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator(color: Color(0xFF39639C)));
            }

            if (snapshot.hasError) {
              return Center(child: Text("Erro ao carregar dados: ${snapshot.error}"));
            }

            if (!snapshot.hasData) {
              return const Center(child: Text("Dados não encontrados."));
            }

            final consultor = snapshot.data!;

            return SafeArea(
                child: ListView(
                    padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 30),
                    children: [
                      // CIRCULO COM A IMAGEM DE PERFIL
                      Center(
                        child: Container(
                          width: 160,
                          height: 160,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: const Color(0xFF39639C),
                              width: 6.0,
                            ),
                          ),
                          child: ClipOval(
                            child: _imagemPerfilLocal != null 
                                ? Image.file(_imagemPerfilLocal!, fit: BoxFit.cover)
                                : (consultor.imagemPerfil.isNotEmpty && consultor.imagemPerfil != "null"
                                    ? Image.memory(
                                        _getImageBytes(consultor.imagemPerfil), 
                                        fit: BoxFit.cover,
                                        errorBuilder: (context, error, stackTrace) => 
                                          Image.asset('lib/assets/images/default-consultor-pfp.png', fit: BoxFit.cover),
                                      )
                                    : Image.asset('lib/assets/images/default-consultor-pfp.png', fit: BoxFit.cover)),
                          ),
                        ),
                      ),
                      
                      const SizedBox(height: 20),
                      
                      Center(
                        child: InkWell(
                          onTap: () async {
                            final ImagePicker picker = ImagePicker();
                            final XFile? imagemEscolhida = await picker.pickImage(
                              source : ImageSource.gallery,
                              imageQuality: 80,
                              maxWidth: 1024,   // Limita a largura a 1024px
                              maxHeight: 1024,
                            );

                            if (imagemEscolhida != null) {
                              setState(() {
                                _imagemPerfilLocal = File(imagemEscolhida.path);
                              });
                            }
                          },
                          child: const Text(
                            'Alterar Foto de perfil',
                            style: TextStyle(
                              color: Color(0xFF39639C),
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      ),

                      const SizedBox(height: 30),

                      LoginInput(
                          texto: 'Alterar Nome',
                          placeholder: consultor.nomeUtilizador,
                          icone: 'lib/assets/icons/Icon_Areas.svg',
                          controller: _nomeController
                      ),

                      LoginInput(
                          texto: 'Alterar Email',
                          placeholder: consultor.emailUtilizador,
                          icone: 'lib/assets/icons/Icon_Email.svg',
                          controller: _emailController
                      ),

                      AreaPreferencia(
                        controller: _alterarAreaController,
                        placeholder: consultor.nomeAreaPreferencia,
                        onAreaSelected: (id) {
                          setState(() {
                            _idAreaSelecionada = id;
                          });
                        },
                      ),

                      const SizedBox(height: 20),

                      LoginInput(
                          texto: 'Nova Password',
                          placeholder: '••••••••',
                          icone: 'lib/assets/icons/Icon_Password.svg',
                          controller: _alterarPasswordController,
                          isPassword: true,
                      ),

                      LoginInput(
                        texto: 'Confirmar com Password Atual',
                        placeholder: '••••••••',
                        icone: 'lib/assets/icons/Icon_Password.svg',
                        controller: _passwordAtualController,
                        isPassword: true,
                      ),

                      const SizedBox(height: 30),

                      // Botão de Submit
                      SizedBox(
                        width: double.infinity,
                        height: 55,
                        child: ElevatedButton(
                          onPressed: () async {

                            //PEGAR NOS VALORES DAS VARIAVEIS
                           String? nomeConsultor = _nomeController.text.isEmpty
                              ? null
                              : _nomeController.text;

                           String? emailConsultor = _emailController.text.isEmpty
                              ? null
                              : _emailController.text;

                           String? passwordNova = _alterarPasswordController.text.isEmpty
                              ? null
                              : _alterarPasswordController.text;

                           String? passwordAtual = _passwordAtualController.text.isEmpty
                              ? null
                              : _passwordAtualController.text;

                           int? idAreaPreferencia = _idAreaSelecionada.toString().isEmpty //O VALOR GUARDADO NA VARIAVEL CONTINUA A SER INT
                              ? null
                              : _idAreaSelecionada;

                           String? imagemPerfil;
                           if (_imagemPerfilLocal != null) {
                             final bytes = await _imagemPerfilLocal!.readAsBytes();
                             imagemPerfil = base64Encode(bytes);
                           } else{
                             _imagemPerfilLocal = null;
                           }

                           if (passwordAtual == null) {
                             _mostrarErro('Introduza a password atual para confirmar as alterações.');
                             return;
                           }
                           //print('IdConsultor: ${AppState().idConsultor}');
                           //CHAMAR O REPOSITORIO PARA ALTERAR AS COISAS
                           final bool pedidoAlteracao = await _repositorioConsultores.atualizarInfoConsultor (
                             AppState().idConsultor,
                             nomeConsultor,
                             emailConsultor,
                             idAreaPreferencia,
                             imagemPerfil,
                             passwordAtual,
                             passwordNova,
                           );


                           if(pedidoAlteracao == false){
                             _mostrarErro('Erro ao alterar dados');
                             return;
                           }

                           //SE TUDO CORRER BEM
                           _mostrarSucesso('Alterações Efetuadas com sucesso');
                            context.pop();
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF39639C),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(15),
                            ),
                          ),
                          child: const Text(
                            'Submeter Alterações',
                            style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ),
                    ]
                )
            );
          },
        )
    );
  }
}
