import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_header_card.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_infoRetangulo_card.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_CardsObter_card.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_miniBasicoCard.dart';
import 'package:pint_26_mobile/core/router/app_router.dart';
import 'package:pint_26_mobile/core/models/consultores_model.dart';
import 'package:pint_26_mobile/core/repositories/consultores_repository.dart';
import 'package:pint_26_mobile/core/repositories/conquistas_repository.dart';
import 'package:pint_26_mobile/core/repositories/conquistasConsultores_repository.dart';
import 'dart:io';
import '../../../core/services/sync_service.dart';

class EcraPrincipal extends ConsumerStatefulWidget {
  final VoidCallback onConsultorHeaderCardTap;
  final VoidCallback onLearningPathsCardTap;
  final VoidCallback onServiceLinesCardTap;
  final VoidCallback onConquistasCardTap;
  final VoidCallback onAreasCardTap;
  final VoidCallback onObjetivosCardTap;
  final VoidCallback onBadgesPorObterCardTap;
  final VoidCallback onBadgesObtidosCardTap;
  final int idConsultor;

  const EcraPrincipal({
    super.key,
    required this.onConsultorHeaderCardTap,
    required this.onLearningPathsCardTap,
    required this.onServiceLinesCardTap,
    required this.onConquistasCardTap,
    required this.onAreasCardTap,
    required this.onObjetivosCardTap,
    required this.onBadgesPorObterCardTap,
    required this.onBadgesObtidosCardTap,
    required this.idConsultor
  });

  @override
  ConsumerState<EcraPrincipal> createState() => _EcraPrincipalState();
}

//CONSUMERSTATE é do riverpod
class _EcraPrincipalState extends ConsumerState<EcraPrincipal> with RouteAware {
  late Future<List<dynamic>> _futureDadosConsultor;
  StreamSubscription? _syncSubscription;


  void _atualizarDados() {
    // acedemos aos repositórios através dos Providers do Riverpod
    final repositorio = ref.read(consultoresRepositoryProvider);
    final repositorioConquistasConsultor = ref.read(conquistasConsultoresRepositoryProvider);

    setState(() {
      _futureDadosConsultor = Future.wait([
        repositorio.getConsultorById(widget.idConsultor),
        repositorio.getCountBadgesObtidos(widget.idConsultor),
        repositorio.getCountBadgesPorObter(widget.idConsultor),
        repositorio.getCountObjetivosPorCompletar(widget.idConsultor),
        repositorio.getDiasObjetivoExpirar(widget.idConsultor),
        repositorioConquistasConsultor.getCountConquistasConsultor(widget.idConsultor),
      ]);
    });


    //forcar sync do consultor

    //forcar sync dos objetivos

  }

  @override
  void initState(){
    super.initState();
    _atualizarDados();
    //Fica sempre a escuta por toda a aplicação se alguma destas tabelas alterar
    _syncSubscription = SyncService.instance.syncStream.listen((tabela) {
      if ((tabela == 'consultores' || tabela == 'objetivos') && mounted) {
        _atualizarDados();
      }
    });
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final route = ModalRoute.of(context);
    if (route is PageRoute) {
      routeObserver.subscribe(this, route);
    }
  }

  @override
  void dispose() {
    routeObserver.unsubscribe(this);
    _syncSubscription?.cancel();
    super.dispose();
  }

  @override
  void didPopNext() {
    _atualizarDados();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<dynamic>>(
      future: _futureDadosConsultor,
      builder: (context, snapshot) {
        //Mesmo no erro mostramos o circularProgress pois pode dar algum erro inicial a dar sync com a api
        if (snapshot.connectionState == ConnectionState.waiting || snapshot.hasError || !snapshot.hasData) {
          return const Center(child: CircularProgressIndicator(color: Color(0xFF39639C)));
        }

        final consultor = snapshot.data![0] as ConsultoresModel;
        final countBadgesObtidos = snapshot.data![1] as int;
        final countBadgesPorObter = snapshot.data![2] as int;
        final countObjetivosPorConcluir = snapshot.data![3] as int;
        final countDiasObjetivoExpirar = snapshot.data![4] as int?;
        final countConquistas = snapshot.data![5] as int;

        return SafeArea(
          child: RefreshIndicator(
            onRefresh: () async {
              _atualizarDados();
              await _futureDadosConsultor;
            },
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              child: Column(
                children: [
                  // HEADER
                  InkWell(
                    onTap: widget.onConsultorHeaderCardTap,
                    child: ConsultorHeaderCard(
                      nomeConsultor: consultor.nomeUtilizador,
                      areaPreferencia: consultor.nomeAreaPreferencia,
                      imagemPerfil: consultor.imagemPerfil,
                    ),
                  ),
                  const SizedBox(height: 15),
                  // PONTUAÇÃO TOTAL
                  InfoRetanguloCard(
                    titulo: 'Pontuação total',
                    textoLead: 'Já tens ${consultor.pontos} pontos, não pares por aqui',
                    total: consultor.pontos,
                    showIconPontos: true,
                  ),
        
                  // OBJETIVOS
                  InkWell(
                    onTap: widget.onObjetivosCardTap,
                    child: InfoRetanguloCard(
                      titulo: 'Objetivos por completar',
                      textoLead: ' dias até o próximo objetivo expirar',
                      total: countObjetivosPorConcluir,
                      leadingInt: countDiasObjetivoExpirar,
                    ),
                  ),
                  // CONQUISTAS
                  InkWell(
                    onTap: widget.onConquistasCardTap,
                    child:InfoRetanguloCard(
                      titulo: 'Conquistas',
                      textoLead: 'Alcança marcos para progredir na carreira',
                      total: countConquistas
                    )
                  ),
                  // BADGES ROW (2 cards)
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: Row(
                      children: [
                        Expanded(
                          child: InkWell(
                            onTap: widget.onBadgesPorObterCardTap,
                            child: BadgesCard(
                              titulo: 'Badges por obter',
                              totalBadges: countBadgesPorObter,
                              icone: 'lib/assets/icons/Icon_BadgePorObter.svg',
                            ),
                          )
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: InkWell(
                            onTap: widget.onBadgesObtidosCardTap,
                            child: BadgesCard(
                              titulo: 'Badges obtidos',
                              totalBadges: countBadgesObtidos,
                              icone: 'lib/assets/icons/Icon_BadgeObtido.svg',
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
        
                  // BOTTOM ROW (3 cards: Áreas, Service Lines, Learning Paths)
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: Row(
                      children: [
                        Expanded(
                          child: InkWell(
                            onTap: widget.onAreasCardTap,
                            child: const MiniBadgesCard(
                              titulo: 'Áreas',
                              icone: 'lib/assets/icons/Icon_Areas.svg',
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: InkWell(
                            onTap: widget.onServiceLinesCardTap,
                            child: const MiniBadgesCard(
                              titulo: 'Service Lines',
                              icone: 'lib/assets/icons/Icon_ServiceLines.svg',
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: InkWell(
                            onTap: widget.onLearningPathsCardTap,
                            child: const MiniBadgesCard(
                              titulo: 'Learning Paths',
                              icone: 'lib/assets/icons/Icon_LearningPaths.svg',
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
        
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
