import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_appbar.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_filtro_chip.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_conquista_retangulo.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_searchBar.dart';

import 'package:pint_26_mobile/core/repositories/conquistas_repository.dart';
import 'package:pint_26_mobile/core/services/sync_service.dart';

class EcraConquistas extends ConsumerStatefulWidget {
  const EcraConquistas({super.key});

  @override
  ConsumerState<EcraConquistas> createState() => _EcraConquistasState();
}

class _EcraConquistasState extends ConsumerState<EcraConquistas> {
  final TextEditingController _controllerPesquisa = TextEditingController();
  String _filtroEstado = 'todas';

  @override
  void initState() {
    super.initState();
    ref.read(syncServiceProvider).syncStream.listen((tableName) {
      if (tableName == 'conquistas' && mounted) {
        ref.invalidate(allConquistasProvider);
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
    final conquistasAsync = ref.watch(allConquistasProvider);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: const PaginaAppBar(
        titulo: 'Minhas Conquistas',
        logo: 'lib/assets/icons/Icon_Conquista.svg',
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(allConquistasProvider);
          await ref.read(allConquistasProvider.future);

        },
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 15),
            
            ConsultorSearchBar(
              controller: _controllerPesquisa,
              placeholder: 'Pesquisar Conquistas',
              onChanged: (value) => setState(() {}),
            ),
        
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 10),
              child: Row(
                children: [
                  ConsultorFiltroChip(
                    texto: 'Todas',
                    icone: 'lib/assets/icons/Icon_Conquista.svg',
                    onTap: () => setState(() => _filtroEstado = 'todas'),
                  ),
                  const SizedBox(width: 10),
                  ConsultorFiltroChip(
                    texto: 'Por Obter',
                    icone: 'lib/assets/icons/Icon_Objetivos.svg',
                    onTap: () => setState(() => _filtroEstado = 'por obter'),
                  ),
                  const SizedBox(width: 10),
                  ConsultorFiltroChip(
                    texto: 'Obtidas',
                    icone: 'lib/assets/icons/Icon_Conquista.svg',
                    onTap: () => setState(() => _filtroEstado = 'obtido'),
                  ),
                ],
              ),
            ),
        
            const SizedBox(height: 5),
        
            Expanded(
              child: conquistasAsync.when(
                loading: () => const Center(child: CircularProgressIndicator(color: Color(0xFF2E599A))),
                error: (err, stack) => ListView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  children: [
                    SizedBox(height: MediaQuery.of(context).size.height * 0.3),
                    Center(child: Text("Erro ao carregar: $err")),
                  ],
                ),
                data: (listaConquistas) {
                  final listaFiltrada = listaConquistas.where((conquista) {
                    final matchesPesquisa = conquista.descricao_conquista
                        .toLowerCase()
                        .contains(_controllerPesquisa.text.toLowerCase());
                    
                    bool matchesFiltro = true;
                    if (_filtroEstado == 'por obter') {
                      matchesFiltro = conquista.estado_conquista.toLowerCase() == 'por obter';
                    } else if (_filtroEstado == 'obtido') {
                      matchesFiltro = conquista.estado_conquista.toLowerCase() == 'obtido' || 
                                     conquista.estado_conquista.toLowerCase() == 'concluído';
                    }
        
                    return matchesPesquisa && matchesFiltro;
                  }).toList();
        
                  if (listaFiltrada.isEmpty) {
                    return ListView(
                      physics: const AlwaysScrollableScrollPhysics(),
                      children: [
                        SizedBox(height: MediaQuery.of(context).size.height * 0.3),
                        const Center(child: Text("Nenhuma conquista encontrada.")),
                      ],
                    );
                  }
        
                  return ListView.builder(
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.only(bottom: 80),
                    itemCount: listaFiltrada.length,
                    itemBuilder: (context, index) {
                      final conquista = listaFiltrada[index];
                      return ConsultorConquistaRetangulo(
                        id_conquista: conquista.id_conquista,
                        descricao_conquista: conquista.descricao_conquista,
                        pontos_conquista: conquista.pontos_conquista,
                        estado_conquista: conquista.estado_conquista,
                        progresso: conquista.progresso,
                      );
                    },
                  );
                },
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}
