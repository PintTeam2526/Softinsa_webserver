import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../widgets/consultor_appbar.dart';
import '../widgets/consultor_filtro_chip.dart';
import '../widgets/consultor_infoMiniCards.dart';
import '../widgets/consultor_searchBar.dart';

//PEDIDOS DE DADOS
import 'package:pint_26_mobile/core/repositories/serviceLines_repository.dart';
import 'package:pint_26_mobile/core/services/sync_service.dart';


class EcraMostrarServiceLines extends ConsumerStatefulWidget{
  final String? filtroPesquisa;
  final Function(String)? nomeServiceLinePai;

  const EcraMostrarServiceLines({
    super.key,
    this.filtroPesquisa,
    this.nomeServiceLinePai
  });

  @override
  ConsumerState<EcraMostrarServiceLines> createState() => _EcraMostrarServiceLines();
}

class _EcraMostrarServiceLines extends ConsumerState<EcraMostrarServiceLines>{
  final TextEditingController _controllerPesquisa = TextEditingController();
  String _filtroAtivo = 'Todas';

  @override
  void initState(){
    super.initState();
    
    //se receber o filtro por parametro troca
    if(widget.filtroPesquisa != null){
      _controllerPesquisa.text = widget.filtroPesquisa!;
    }

    // Escuta atualizações do sync para esta tabela
    ref.read(syncServiceProvider).syncStream.listen((tableName) {
      if (tableName == 'serviceLines' && mounted) {
        ref.invalidate(allServiceLinesProvider);
      }
    });
  }


  @override
  void didUpdateWidget(EcraMostrarServiceLines oldWidget) {
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
  Widget build (BuildContext context){
    final serviceLinesAsync = ref.watch(allServiceLinesProvider);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: const PaginaAppBar(titulo: 'Service Lines', logo: 'lib/assets/icons/Icon_ServiceLines.svg'),
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(allServiceLinesProvider);
          await ref.read(allServiceLinesProvider.future);
        },
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 15),
        
            ConsultorSearchBar(
              controller: _controllerPesquisa,
              placeholder: widget.filtroPesquisa ?? 'Pesquisar Service Lines',
              onChanged: (value){
                setState(() {}); 
              },
            ),
        
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal:25, vertical: 10),
            ),
            const SizedBox(height: 10),
        
            Expanded(
              child: serviceLinesAsync.when(
                loading: () => const Center(child: CircularProgressIndicator(color: Color(0xFF39639C))),
                error: (err, stack) => ListView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  children: [
                    SizedBox(height: MediaQuery.of(context).size.height * 0.3),
                    Center(child: Text("Erro ao carregar dados: $err")),
                  ],
                ),
                data: (listaServiceLines) {
                  final listaServiceLinesFiltrada = listaServiceLines.where((sl){
                    final matchesNome = sl.nome.toLowerCase().contains(_controllerPesquisa.text.toLowerCase());
                    final matchesPai = (sl.nome_learning_path_pai ?? "").toLowerCase().contains(_controllerPesquisa.text.toLowerCase());
                    final isAtivo = sl.estado_a_i == true;
                    return (matchesPai || matchesNome) && isAtivo;
                  }).toList();
        
                  if (listaServiceLinesFiltrada.isEmpty) {
                    return ListView(
                      physics: const AlwaysScrollableScrollPhysics(),
                      children: [
                        SizedBox(height: MediaQuery.of(context).size.height * 0.3),
                        const Center(child: Text("Nenhum Service Line disponível localmente.")),
                      ],
                    );
                  }
        
                  return GridView.builder(
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 3,
                      crossAxisSpacing: 10,
                      mainAxisSpacing: 5,
                      childAspectRatio: 0.55,
                    ),
                    itemCount: listaServiceLinesFiltrada.length,
                    itemBuilder: (context, index) {
                      final serviceLine = listaServiceLinesFiltrada[index];
                      return InkWell(
                        onTap: () async {
                          final String? nomeServiceLinePaiRetornada = await context.push<String>(
                            '/mostrarServiceLineInfo',
                            extra: serviceLine.id,
                          );
        
                          if(nomeServiceLinePaiRetornada != null && mounted){
                            widget.nomeServiceLinePai?.call(nomeServiceLinePaiRetornada);
                          }
                        },
                        child: InfoMiniCard(
                          imagem: serviceLine.imagem,
                          titulo: serviceLine.nome,
                          pai: serviceLine.nome_learning_path_pai,
                        ),
                      );
                    },
                  );
                },
              ),
            )
          ]
        ),
      )
    );
  }
}
