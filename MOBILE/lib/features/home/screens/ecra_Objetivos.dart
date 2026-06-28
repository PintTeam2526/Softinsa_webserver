import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pint_26_mobile/core/app_state.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_appbar.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_filtro_chip.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_searchBar.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_objetivosCard.dart';
import 'package:intl/intl.dart'; 
import 'package:go_router/go_router.dart';

import 'package:pint_26_mobile/core/repositories/objetivos_repository.dart';
import 'package:pint_26_mobile/core/services/sync_service.dart';

class EcraObjetivos extends ConsumerStatefulWidget {
  const EcraObjetivos({super.key});

  @override
  ConsumerState<EcraObjetivos> createState() => _EcraObjetivosState();
}

class _EcraObjetivosState extends ConsumerState<EcraObjetivos> {
  final TextEditingController _controllerPesquisa = TextEditingController();

  @override
  void initState() {
    super.initState();
    
    // Escuta atualizações do sync para esta tabela
    ref.read(syncServiceProvider).syncStream.listen((tableName) {
      if (tableName == 'objetivos' && mounted) {
        ref.invalidate(objetivosConsultorProvider(AppState().idConsultor));
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
    final objetivosAsync = ref.watch(objetivosConsultorProvider(idConsultor));

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: const PaginaAppBar(
        titulo: 'Meus Objetivos',
        logo: 'lib/assets/icons/Icon_Objetivos.svg',
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(objetivosConsultorProvider(idConsultor));
          await ref.read(objetivosConsultorProvider(idConsultor).future);
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
                    texto: 'Novo Objetivo',
                    icone: 'lib/assets/icons/Icon_Adicionar.svg',
                    onTap: () async {
                      await context.push('/adicionarObjetivo');
                      // Invalida o provider para forçar refresh ao voltar
                      ref.invalidate(objetivosConsultorProvider(idConsultor));
                    }
                  ),
                  const SizedBox(width: 10),
                  ConsultorFiltroChip(
                    texto: 'Por Concluir',
                    icone: 'lib/assets/icons/Icon_Objetivos.svg',
                    onTap: () => print('Por Concluir'),
                  ),
                  const SizedBox(width: 10),
                  ConsultorFiltroChip(
                    texto: 'Expirados',
                    icone: 'lib/assets/icons/Icon_Expirado.svg',
                    onTap: () => print('Expirados'),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 5),
            Expanded(
              child: objetivosAsync.when(
                loading: () => const Center(child: CircularProgressIndicator(color: Color(0xFF39639C))),
                error: (err, stack) => ListView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  children: [
                    SizedBox(height: MediaQuery.of(context).size.height * 0.3),
                    Center(child: Text("Erro ao carregar dados: $err")),
                  ],
                ),
                data: (listaObjetivos) {
                  final listaObjetivosFiltrada = listaObjetivos.where((obj){
                    return obj.nome.toLowerCase().contains(_controllerPesquisa.text.toLowerCase());
                  }).toList();
        
                  if(listaObjetivosFiltrada.isEmpty){
                    return ListView(
                      physics: const AlwaysScrollableScrollPhysics(),
                      children: [
                        SizedBox(height: MediaQuery.of(context).size.height * 0.3),
                        const Center(child: Text("Nenhum Objetivo Encontrado.")),
                      ],
                    );
                  }
                  return ListView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.only(left: 16, right: 16, bottom: 100), // AJUSTADO BOTTOM PADDING
                    children: [
                      Wrap(
                        spacing: 5,
                        runSpacing: 5,
                        alignment: WrapAlignment.start,
                        children: listaObjetivosFiltrada.map((objetivo){
                          DateTime dataLimite = DateFormat("dd/MM/yyyy").parse(objetivo.data_limite_conclusao);
                          DateTime? dataConclusao;
                          if (objetivo.data_conclusao_objetivo != null && objetivo.data_conclusao_objetivo!.isNotEmpty) {
                            try {
                              dataConclusao = DateFormat("dd/MM/yyyy").parse(objetivo.data_conclusao_objetivo!);
                            } catch (e) {
                              dataConclusao = null;
                            }
                          }
        
                          return ConsultorObjetivosCard(
                            nomeBadge: objetivo.nome,
                            dataLimiteObjetivo: objetivo.data_limite_conclusao,
                            dataExpiracao: dataLimite,
                            dataConclusao: dataConclusao,
                            onTap: () {
                              context.push('/mostrarCandidaturaBadge', extra: objetivo.id_badge);
                            }
                          );
                        }).toList()
                      ),
                    ],
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
