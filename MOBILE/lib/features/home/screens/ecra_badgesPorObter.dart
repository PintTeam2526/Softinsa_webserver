import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_appbar.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_filtro_chip.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_searchBar.dart';
import 'package:pint_26_mobile/core/app_state.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_badgePorObter_retangulo.dart';
import 'package:go_router/go_router.dart';

import 'package:pint_26_mobile/core/repositories/badges_repository.dart';
import 'package:pint_26_mobile/core/services/sync_service.dart';
import 'package:pint_26_mobile/core/repositories/badgesFavoritos_repository.dart';

class EcraBadgesPorObter extends ConsumerStatefulWidget {
  const EcraBadgesPorObter({super.key});

  @override
  ConsumerState<EcraBadgesPorObter> createState() => _EcraBadgesPorObterState();
}

class _EcraBadgesPorObterState extends ConsumerState<EcraBadgesPorObter>{
  final TextEditingController _controllerPesquisa = TextEditingController();
  String _filtroAtivo = 'Por Obter';

  @override
  void initState(){
    super.initState();
    
    // Escuta atualizações do sync para tabelas relacionadas
    ref.read(syncServiceProvider).syncStream.listen((tableName) {
      if ((tableName == 'badges' || tableName == 'badgesConcluidos' || tableName == 'badgesFavoritos') && mounted) {
        ref.invalidate(badgesPorObterProvider(AppState().idConsultor));
        ref.invalidate(favoriteBadgeIdsProvider);
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
    final badgesAsync = ref.watch(badgesPorObterProvider(idConsultor));
    final favoritosIdsAsync = ref.watch(favoriteBadgeIdsProvider);
    final favoritosIds = favoritosIdsAsync.value ?? {};

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: const PaginaAppBar(
        titulo: 'Badges por obter',
        logo: 'lib/assets/icons/Icon_BadgePorObter.svg',
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(badgesPorObterProvider(idConsultor));
          ref.invalidate(favoriteBadgeIdsProvider);
          await ref.read(badgesPorObterProvider(idConsultor).future);
        },
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 10),
            ConsultorSearchBar(
              controller: _controllerPesquisa,
              placeholder: 'Nome do Badge',
              onChanged: (value) => setState((){}),
            ),
            const SizedBox(height:10),
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 10),
              child: Row(
                children: [
                  ConsultorFiltroChip(
                      texto: 'Badges Favoritos',
                      icone: _filtroAtivo == 'Favoritos' 
                        ? 'lib/assets/icons/Icon_Favorito-Preenchido.svg' 
                        : 'lib/assets/icons/Icon_Favoritos.svg',
                      isSelected: _filtroAtivo == 'Favoritos',
                      onTap: () => setState(() => _filtroAtivo = 'Favoritos')
                  ),
                  const SizedBox(width: 10),
                  ConsultorFiltroChip(
                      texto: 'Por Obter',
                      icone: 'lib/assets/icons/Icon_BadgePorObter.svg',
                      isSelected: _filtroAtivo == 'Por Obter',
                      onTap: () {
                        setState(() => _filtroAtivo = 'Por Obter');
                        ref.invalidate(badgesPorObterProvider(idConsultor));
                      }
                  ),
                ],
              ),
            ),
            
            Expanded(
              child: badgesAsync.when(
                loading: () => const Center(child: CircularProgressIndicator(color: Color(0xFF39639C))),
                error: (err, stack) => ListView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  children: [
                    SizedBox(height: MediaQuery.of(context).size.height * 0.3),
                    Center(child: Text("Erro ao carregar dados: $err")),
                  ],
                ),
                data: (listaBadges) {
                  final listaBadgesFiltrada = listaBadges.where((badge){
                    final matchesNome = badge.nome.toLowerCase().contains(_controllerPesquisa.text.toLowerCase());
                    final areaPai = badge.nome_area_pai ?? "";
                    final matchesNomeArea = areaPai.toLowerCase().contains(_controllerPesquisa.text.toLowerCase());
                    final isAtivo = badge.estado_a_i;
                    
                    bool matchesFavoritos = true;
                    if (_filtroAtivo == 'Favoritos') {
                      matchesFavoritos = favoritosIds.contains(badge.id);
                    }

                    return (matchesNome || matchesNomeArea) && isAtivo && matchesFavoritos;
                  }).toList();
        
                  if (listaBadgesFiltrada.isEmpty) {
                    return ListView(
                      physics: const AlwaysScrollableScrollPhysics(),
                      children: [
                        SizedBox(height: MediaQuery.of(context).size.height * 0.3),
                        const Center(child: Text("Nenhum Badge Encontrado.")),
                      ],
                    );
                  }
        
                  return ListView.builder(
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.only(top: 10, bottom: 80), // ESPAÇO PARA A NAVBAR
                    itemCount: listaBadgesFiltrada.length,
                    itemBuilder: (context, index) {
                      final badge = listaBadgesFiltrada[index];
                      return BadgePorObterRetangulo(
                          titulo: badge.nome,
                          nivel: 'Nivel Badge: ${badge.nivel}',
                          subtitulo: badge.nome_area_pai ?? '',
                          pontos: badge.pontos,
                          imagem: badge.imagem,
                          onTapCandidatar: () {
                            context.push('/mostrarCandidaturaBadge', extra: badge.id);
                          }
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
