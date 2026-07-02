import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_appbar.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_filtro_chip.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_infoMiniCards.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_searchBar.dart';

import 'package:pint_26_mobile/core/repositories/areas_repository.dart';
import 'package:pint_26_mobile/core/services/sync_service.dart';

class EcraMostrarAreas extends ConsumerStatefulWidget {
  final String? filtroPesquisa;
  final Function(int)? idAreaPai;

  const EcraMostrarAreas({
    super.key,
    this.filtroPesquisa,
    this.idAreaPai,
  });

  @override
  ConsumerState<EcraMostrarAreas> createState() => _EcraMostrarAreasState();
}

class _EcraMostrarAreasState extends ConsumerState<EcraMostrarAreas> {
  final TextEditingController _controllerPesquisa = TextEditingController();
  String _filtroAtivo = 'Todos';

  @override
  void initState() {
    super.initState();
    if (widget.filtroPesquisa != null) {
      _controllerPesquisa.text = widget.filtroPesquisa!;
    }

    // Escuta atualizações do sync para esta tabela
    ref.read(syncServiceProvider).syncStream.listen((tableName) {
      if (tableName == 'areas' && mounted) {
        ref.invalidate(allAreasProvider);
      }
    });
  }

  @override
  void didUpdateWidget(EcraMostrarAreas oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.filtroPesquisa != oldWidget.filtroPesquisa) {
      _controllerPesquisa.text = widget.filtroPesquisa ?? '';
      setState(() {});
    }
  }

  @override
  void dispose() {
    _controllerPesquisa.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final areasAsync = ref.watch(allAreasProvider);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: const PaginaAppBar(
        titulo: 'Áreas',
        logo: 'lib/assets/icons/Icon_Areas.svg',
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(allAreasProvider);
          await ref.read(allAreasProvider.future);
        },
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 15),
            ConsultorSearchBar(
              controller: _controllerPesquisa,
              placeholder: widget.filtroPesquisa ?? 'Pesquisar Áreas',
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
                    icone: 'lib/assets/icons/Icon_Areas.svg',
                    isSelected: _filtroAtivo == 'Todos',
                    onTap: () {
                      setState(() => _filtroAtivo = 'Todos');
                      ref.invalidate(allAreasProvider);
                    },
                  )
                ],
              ),
            ),
            const SizedBox(height: 10),
            Expanded(
              child: areasAsync.when(
                loading: () => const Center(child: CircularProgressIndicator(color: Color(0xFF39639C))),
                error: (err, stack) => ListView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  children: [
                    SizedBox(height: MediaQuery.of(context).size.height * 0.3),
                    Center(child: Text("Erro: $err")),
                  ],
                ),
                data: (listaAreas) {
                  final listaAreasFiltrada = listaAreas.where((area) {
                    final matchesNome = area.nome.toLowerCase().contains(_controllerPesquisa.text.toLowerCase());
                    final matchesPai = (area.nome_service_line_pai ?? "").toLowerCase().contains(_controllerPesquisa.text.toLowerCase());
                    return (matchesPai || matchesNome) && area.estado_a_i;
                  }).toList();
        
                  if (listaAreasFiltrada.isEmpty) {
                    return ListView(
                      physics: const AlwaysScrollableScrollPhysics(),
                      children: [
                        SizedBox(height: MediaQuery.of(context).size.height * 0.3),
                        const Center(child: Text("Nenhuma Área Encontrada.")),
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
                    itemCount: listaAreasFiltrada.length,
                    itemBuilder: (context, index) {
                      final area = listaAreasFiltrada[index];
                      return InkWell(
                        onTap: () async {
                          final int? idAreaRetornada = await context.push<int>(
                            '/mostrarAreasInfo',
                            extra: area.id,
                          );
                          if (idAreaRetornada != null && mounted) {
                            widget.idAreaPai?.call(idAreaRetornada);
                          }
                        },
                        child: InfoMiniCard(
                          imagem: area.imagem,
                          titulo: area.nome,
                          pai: area.nome_service_line_pai,
                        ),
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
