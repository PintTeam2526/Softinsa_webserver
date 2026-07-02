import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_appbar.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_filtro_chip.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_infoMiniCards.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_searchBar.dart';

import 'package:pint_26_mobile/core/repositories/learningPaths_repository.dart';
import 'package:pint_26_mobile/core/services/sync_service.dart';

class EcraMostrarLearningpaths extends ConsumerStatefulWidget {
  final Function(String)? nomeLearningPathPai;

  const EcraMostrarLearningpaths({
    super.key,
    this.nomeLearningPathPai
  });

  @override
  ConsumerState<EcraMostrarLearningpaths> createState() => _EcraLearningpathsState();
}

class _EcraLearningpathsState extends ConsumerState<EcraMostrarLearningpaths> {
  final TextEditingController _controllerPesquisa = TextEditingController();
  String _filtroAtivo = 'Todos';

  @override
  void initState() {
    super.initState();
    // Escuta as atualizações do SyncService e invalida o provider
    ref.read(syncServiceProvider).syncStream.listen((tableName) {
      // Tabelas que influenciam o progresso ou a lista de LP, força o refresh para evitar dados errados
      final listToRefresh = [
        'learningPaths', 
        'serviceLines', 
        'areas', 
        'badges', 
        'badgesConcluidos'
      ];
      
      if (listToRefresh.contains(tableName) && mounted) {
        ref.invalidate(allLearningPathsProvider);
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

    final learningPathsAsync = ref.watch(allLearningPathsProvider);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: const PaginaAppBar(
          titulo: 'Learning Paths',
          logo: 'lib/assets/icons/Icon_LearningPaths.svg'
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(allLearningPathsProvider);
          await ref.read(allLearningPathsProvider.future);
        },
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 15),
            ConsultorSearchBar(
              controller: _controllerPesquisa,
              placeholder: 'Pesquisar Learning Paths',
              onChanged: (value) => setState(() {}),
            ),
        
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 10),
              child: Row(
                children: [
                  ConsultorFiltroChip(
                    texto: 'Favoritos',
                    icone: 'lib/assets/icons/Icon_Favoritos.svg',
                    isSelected: _filtroAtivo == 'Favoritos',
                    onTap: () => setState(() => _filtroAtivo = 'Favoritos'),
                  ),
                  const SizedBox(width: 9),
                  ConsultorFiltroChip(
                    texto: 'Todos',
                    icone: 'lib/assets/icons/Icon_LearningPaths.svg',
                    isSelected: _filtroAtivo == 'Todos',
                    onTap: () {
                      setState(() => _filtroAtivo = 'Todos');
                      ref.invalidate(allLearningPathsProvider);
                    },
                  )
                ],
              ),
            ),
        
            const SizedBox(height: 10),
        
            Expanded(
              child: learningPathsAsync.when(
                loading: () => const Center(child: CircularProgressIndicator(color: Color(0xFF39639C))),
                error: (err, stack) => ListView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  children: [
                    SizedBox(height: MediaQuery.of(context).size.height * 0.3),
                    Center(child: Text("Erro: $err")),
                  ],
                ),
                data: (listaLearingPaths) {
                  final listaFiltrada = listaLearingPaths.where((lp) {
                    final matchesSearch = lp.nome.toLowerCase().contains(_controllerPesquisa.text.toLowerCase());
                    return matchesSearch && lp.estado_a_i;
                  }).toList();
        
                  if (listaFiltrada.isEmpty) {
                    return ListView(
                      physics: const AlwaysScrollableScrollPhysics(),
                      children: [
                        SizedBox(height: MediaQuery.of(context).size.height * 0.3),
                        const Center(child: Text("Nenhuma correspondência encontrada.")),
                      ],
                    );
                  }
        
                  return GridView.builder(
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.only(left: 16, right: 16, top: 5, bottom: 80),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 3,
                      crossAxisSpacing: 10,
                      mainAxisSpacing: 0,
                      childAspectRatio: 0.7,
                    ),
                    itemCount: listaFiltrada.length,
                    itemBuilder: (context, index) {
                      final lp = listaFiltrada[index];
                      return InkWell(
                        onTap: () async {
                          final res = await context.push<String>('/mostrarLearningPathInfo', extra: lp.id);
                          if (res != null && mounted) widget.nomeLearningPathPai?.call(res);
                        },
                        child: InfoMiniCard(
                            imagem: lp.imagem,
                            titulo: lp.nome,
                            progresso: lp.progresso
                        ),
                      );
                    },
                  );
                },
              ),
            )
          ],
        ),
      ),
    );
  }
}
