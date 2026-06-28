import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_appbar.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_perfilPublico_headerCard.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_retanguloBadge_publico.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_modal_requisitos.dart';
import 'package:pint_26_mobile/core/app_state.dart';

import 'package:pint_26_mobile/core/repositories/consultores_repository.dart';
import 'package:pint_26_mobile/core/models/consultores_model.dart';
import 'package:pint_26_mobile/core/repositories/badgesConcluidos_repository.dart';
import 'package:pint_26_mobile/core/models/badgesConcluidos_model.dart';
import 'package:pint_26_mobile/core/repositories/requisitos_repository.dart';

class EcraPerfilPublico extends ConsumerStatefulWidget {
  const EcraPerfilPublico({super.key});

  @override
  ConsumerState<EcraPerfilPublico> createState() => _EcraPerfilPublicoState();
}

class _EcraPerfilPublicoState extends ConsumerState<EcraPerfilPublico> {
  late Future<List<dynamic>> _futureIniciais;

  void _carregarDados() {
    final repoCons = ref.read(consultoresRepositoryProvider);
    final repoBadges = ref.read(badgesConcluidosRepositoryProvider);
    final idConsultor = AppState().idConsultor;

    setState(() {
      _futureIniciais = Future.wait([
        repoCons.getConsultorById(idConsultor),
        repoCons.getCountBadgesObtidos(idConsultor),
        repoBadges.fetchBadgesConcluidos(idConsultor),
      ]);
    });
  }

  @override
  void initState() {
    super.initState();
    _carregarDados();
  }

  void _carregarEAbrirRequisitos(BadgesConcluidosModel badge) async {
    // Feedback de loading
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => const Center(child: CircularProgressIndicator(color: Color(0xFF39639C))),
    );

    try {
      final repoReq = ref.read(requisitosRepositoryProvider);
      final reqs = await repoReq.getRequisitosBadge(badge.idBadge);

      if (!mounted) return;
      Navigator.pop(context);

      showDialog(
        context: context,
        builder: (_) => ModalRequisitos(nomeBadge: badge.nomeBadge, requisitos: reqs),
      );
    } catch (e) {
      if (!mounted) return;
      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro ao carregar requisitos: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: PaginaAppBar(
        titulo: 'Perfil Público',
        logo: 'lib/assets/icons/Icon_PerfilPublico_Navbar.svg',
        onLogoTap: () => _carregarDados(),
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          _carregarDados();
          await _futureIniciais;
        },
        child: FutureBuilder<List<dynamic>>(
          future: _futureIniciais,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator(color: Color(0xFF39639C)));
            }
            if (snapshot.hasError) {
              return ListView(
                physics: const AlwaysScrollableScrollPhysics(),
                children: [
                  SizedBox(height: MediaQuery.of(context).size.height * 0.3),
                  Center(child: Text('Erro: ${snapshot.error}')),
                ],
              );
            }
            if (!snapshot.hasData) {
              return ListView(
                physics: const AlwaysScrollableScrollPhysics(),
                children: [
                  SizedBox(height: MediaQuery.of(context).size.height * 0.3),
                  const Center(child: Text('Sem dados')),
                ],
              );
            }

            final consultor = snapshot.data![0] as ConsultoresModel;
            final totalBadges = snapshot.data![1] as int;
            final badges = List<BadgesConcluidosModel>.from(snapshot.data![2]);

            return Column(
              children: [
                const SizedBox(height: 15),
                PerfilConsultorWidget(
                  nomeConsultor: consultor.nomeUtilizador,
                  areaPreferencia: consultor.nomeAreaPreferencia,
                  imagemPerfil: consultor.imagemPerfil,
                  totalBadges: totalBadges,
                  totalPontos: consultor.pontos,
                ),
                const SizedBox(height: 10),

                Expanded(
                  child: badges.isEmpty
                      ? ListView(
                          physics: const AlwaysScrollableScrollPhysics(),
                          children: [
                            SizedBox(height: MediaQuery.of(context).size.height * 0.1),
                            const Center(child: Text("Nenhum badge encontrado.")),
                          ],
                        )
                      : ListView.builder(
                          physics: const AlwaysScrollableScrollPhysics(),
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          itemCount: badges.length,
                          itemBuilder: (context, index) {
                            final b = badges[index];
                            return Padding(
                              padding: const EdgeInsets.only(bottom: 12),
                              child: BadgePerfilPublico(
                                imagemBadge: b.imagemBadge,
                                nomeBadge: b.nomeBadge,
                                nivel: 'Nível ${b.nivelBadge}',
                                dataConclusao: b.dataConclusao,
                                onTapRequisitos: () => _carregarEAbrirRequisitos(b),
                              ),
                            );
                          },
                        ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}
