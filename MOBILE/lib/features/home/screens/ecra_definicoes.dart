import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_appbar.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_header_card.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_basicoInfoRetangulo.dart';
import 'package:pint_26_mobile/core/app_state.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:pint_26_mobile/core/database/database_helper.dart';

//CARREGAR OS DADOS
import 'package:pint_26_mobile/core/models/consultores_model.dart';
import 'package:pint_26_mobile/core/repositories/consultores_repository.dart';
import 'package:pint_26_mobile/core/services/sync_service.dart';


class EcraDefinicoes extends StatefulWidget {

  const EcraDefinicoes({
    super.key,
  });

  @override
  State<EcraDefinicoes> createState() => _EcraDefinicoesState();
}

class _EcraDefinicoesState extends State<EcraDefinicoes> {
  bool _notificacoesAtivas = false; 
  final ConsultoresRepository _repositorioConsultores = ConsultoresRepository();
  late Future<ConsultoresModel> _futureConsultor;
  StreamSubscription? _syncSubscription;


  @override
  void initState(){
    super.initState();
    _carregarDados();

    // Fica a ouvir se a tabela de consultores na BD local muda
    _syncSubscription = SyncService.instance.syncStream.listen((tabela) {
      if (tabela == 'consultores' && mounted) {
        _carregarDados();
      }
    });
  }

  void _carregarDados() {
    setState(() {
      _futureConsultor = _repositorioConsultores.getConsultorById(AppState().idConsultor);
    });
  }

  @override
  void dispose() {
    _syncSubscription?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final primaryColor = const Color(0xFF39639C);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: const PaginaAppBar(
        titulo: 'Definições',
        logo: 'lib/assets/icons/Icon_Definicoes.svg',
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
            return const Center(child: Text("Dados do consultor não encontrados."));
          }

          final consultor = snapshot.data!;

          return SingleChildScrollView(
            child: Column(
              children: [
                const SizedBox(height: 20),
                
                // CARD DE PERFIL COM DADOS REAIS
                ConsultorHeaderCard(
                    nomeConsultor: consultor.nomeUtilizador,
                    areaPreferencia: consultor.nomeAreaPreferencia,
                    imagemPerfil: consultor.imagemPerfil,
                    definicoes: false,
                ),

                const SizedBox(height: 10),

                // BOTÃO ALTERAR PERFIL
                OutlinedButton(
                  onPressed: () async {
                    // Ao voltar da alteração, forçamos refresh manual por precaução
                    await context.push('/alterarDefinicoes');
                    if (mounted) _carregarDados();
                  },
                  style: OutlinedButton.styleFrom(
                    backgroundColor: primaryColor,
                    side: BorderSide(color: primaryColor, width: 1.5),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(25),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 12),
                  ),
                  child: const Text(
                    'Alterar Perfil',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w500,
                      fontSize: 16,
                    ),
                  ),
                ),

                const SizedBox(height: 15),
                InkWell(
                  onTap: () async {
                    AppState().logout();
                    if (context.mounted) {
                      context.go('/login');
                    }
                  },
                  child: const BasicInfoRetanguloCard(
                      titulo: 'Log Out',
                      icone: 'lib/assets/icons/Icon_Logout.svg'
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
