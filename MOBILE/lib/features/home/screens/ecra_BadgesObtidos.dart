import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_appbar.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_badgeObtidoRetangulo.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_searchBar.dart';
import 'package:pint_26_mobile/core/app_state.dart';

// REPOSITORIOS
import 'package:pint_26_mobile/core/repositories/badgesConcluidos_repository.dart';
import 'package:pint_26_mobile/core/models/badgesConcluidos_model.dart';
import 'package:pint_26_mobile/core/repositories/consultores_repository.dart';
import 'package:pint_26_mobile/core/models/consultores_model.dart';

// SERVICOS
import 'package:pint_26_mobile/core/services/certificado_badge_service.dart';
import 'package:pint_26_mobile/core/models/certificado_badge_model.dart';
import 'package:pint_26_mobile/core/services/sync_service.dart';

class EcraBadgesObtidos extends ConsumerStatefulWidget {
  final String? nomeBadgePesquisa;

  const EcraBadgesObtidos({
    super.key,
    this.nomeBadgePesquisa,
  });

  @override
  ConsumerState<EcraBadgesObtidos> createState() => _EcraBadgesObtidosState();
}

class _EcraBadgesObtidosState extends ConsumerState<EcraBadgesObtidos> {
  final TextEditingController _controllerPesquisa = TextEditingController();

  @override
  void initState() {
    super.initState();
    if (widget.nomeBadgePesquisa != null) {
      _controllerPesquisa.text = widget.nomeBadgePesquisa!;
    }

    // Escuta atualizações do sync
    ref.read(syncServiceProvider).syncStream.listen((tableName) {
      if (mounted) {
        final idConsultor = AppState().idConsultor;
        if (tableName == 'badgesConcluidos') {
          ref.invalidate(badgesConcluidosProvider(idConsultor));
        }
        if (tableName == 'consultores') {
          ref.invalidate(currentConsultorProvider(idConsultor));
        }
      }
    });
  }

  @override
  void dispose() {
    _controllerPesquisa.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final idConsultor = AppState().idConsultor;
    final badgesAsync = ref.watch(badgesConcluidosProvider(idConsultor));
    final consultorAsync = ref.watch(currentConsultorProvider(idConsultor));

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: PaginaAppBar(
        titulo: 'Badges Obtidos',
        logo: 'lib/assets/icons/Icon_BadgeObtido.svg',
        onLogoTap: () {
          ref.invalidate(badgesConcluidosProvider(idConsultor));
          ref.invalidate(currentConsultorProvider(idConsultor));
        },
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(badgesConcluidosProvider(idConsultor));
          ref.invalidate(currentConsultorProvider(idConsultor));
          await Future.wait([
            ref.read(badgesConcluidosProvider(idConsultor).future),
            ref.read(currentConsultorProvider(idConsultor).future),
          ]);
        },
        child: Column(
          children: [
            const SizedBox(height: 15),
            ConsultorSearchBar(
              controller: _controllerPesquisa,
              placeholder: 'Pesquisar por nome ou área...',
              onChanged: (value) => setState(() {}),
            ),
            const SizedBox(height: 10),
            Expanded(
              child: badgesAsync.when(
                loading: () => const Center(child: CircularProgressIndicator(color: Color(0xFF39639C))),
                error: (err, stack) => ListView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  children: [
                    SizedBox(height: MediaQuery.of(context).size.height * 0.3),
                    Center(child: Text("Erro: $err")),
                  ],
                ),
                data: (listaBadges) {
                  return consultorAsync.when(
                    loading: () => const Center(child: CircularProgressIndicator(color: Color(0xFF39639C))),
                    error: (err, stack) => ListView(
                      physics: const AlwaysScrollableScrollPhysics(),
                      children: [
                        SizedBox(height: MediaQuery.of(context).size.height * 0.3),
                        Center(child: Text("Erro ao carregar consultor: $err")),
                      ],
                    ),
                    data: (consultor) {
                      if (listaBadges.isEmpty) {
                        return ListView(
                          physics: const AlwaysScrollableScrollPhysics(),
                          children: [
                            SizedBox(height: MediaQuery.of(context).size.height * 0.3),
                            const Center(child: Text("Ainda não tens badges concluídos.")),
                          ],
                        );
                      }
        
                      final listaFiltrada = listaBadges.where((badge) {
                        final termo = _controllerPesquisa.text.toLowerCase();
                        return badge.nomeBadge.toLowerCase().contains(termo) || 
                               (badge.nomeAreaPai ?? "").toLowerCase().contains(termo);
                      }).toList();
        
                      if (listaFiltrada.isEmpty) {
                        return ListView(
                          physics: const AlwaysScrollableScrollPhysics(),
                          children: [
                            SizedBox(height: MediaQuery.of(context).size.height * 0.3),
                            const Center(child: Text("Nenhum badge encontrado.")),
                          ],
                        );
                      }
        
                      return ListView.builder(
                        physics: const AlwaysScrollableScrollPhysics(),
                        padding: const EdgeInsets.only(bottom: 80), // Ajustado para não sobrepor navbar
                        itemCount: listaFiltrada.length,
                        itemBuilder: (context, index) {
                          final badge = listaFiltrada[index];
                          return ConsultorBadgeObtidoRetangulo(
                            titulo: badge.nomeBadge,
                            idBadge: badge.idBadge,
                            subtitulo: '${badge.nomeAreaPai ?? "Sem Área"}, ${badge.nivelBadge}',
                            imagem: badge.imagemBadge,
                            dataExpiracao: badge.dataExpiracaoBadge,
                            pontos: badge.pontosBadge,
                            onCertificado: () {
                             final certificado = CertificadoModel(
                                 nomeConsultor: consultor.nomeUtilizador,
                                 nomeBadge: badge.nomeBadge,
                                 nivel: badge.nivelBadge,
                                 area: badge.nomeAreaPai ?? "Sem Área",
                                 serviceLine: badge.nomeServiceLine,
                                 dia: badge.dataConclusao.split('/')[0],
                                 mes: badge.dataConclusao.split('/')[1],
                                 ano: badge.dataConclusao.split('/')[2],
                             );
                              CertificadoService.gerarEVisualizar(certificado);
                            },
                            onPartilhar: () {
                              print('Partilhar badge: ${badge.nomeBadge}');
                            },
                          );
                        },
                      );
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
