import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pint_26_mobile/core/app_state.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_appbar.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_filtro_chip.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_searchBar.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_objetivosCard.dart';
import 'package:intl/intl.dart'; 
import 'package:go_router/go_router.dart';
import 'package:pint_26_mobile/core/repositories/badgesRecomendados_repository.dart';
import 'package:pint_26_mobile/core/repositories/objetivos_repository.dart';
import 'package:pint_26_mobile/core/services/sync_service.dart';
import 'package:pint_26_mobile/core/models/objetivos_model.dart';

class EcraObjetivos extends ConsumerStatefulWidget {
  const EcraObjetivos({super.key});

  @override
  ConsumerState<EcraObjetivos> createState() => _EcraObjetivosState();
}

class _EcraObjetivosState extends ConsumerState<EcraObjetivos> {
  final TextEditingController _controllerPesquisa = TextEditingController();
  String _filtroAtivo = 'Todos';

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
                      final repo = ref.read(badgesRecomendadosRepositoryProvider);


                      final badges = await repo.getAllBadgesRecomendados(idConsultor);

                      if (badges != null && badges.isNotEmpty) {
                        if (mounted) {
                          await context.push('/mostrarBadgesRecomendados');
                        }
                      } else {
                        if (mounted) {
                          await context.push('/adicionarObjetivo');
                        }
                      }
                      ref.invalidate(objetivosConsultorProvider(idConsultor));
                    }
                  ),
                  const SizedBox(width: 10),
                  ConsultorFiltroChip(
                    texto: 'Todos',
                    icone: 'lib/assets/icons/Icon_Objetivos.svg',
                    isSelected: _filtroAtivo == 'Todos',
                    onTap: () => setState(() => _filtroAtivo = 'Todos'),
                  ),
                  const SizedBox(width: 10),
                  ConsultorFiltroChip(
                    texto: 'Por Concluir',
                    icone: 'lib/assets/icons/Icon_Objetivos.svg',
                    isSelected: _filtroAtivo == 'Por Concluir',
                    onTap: () => setState(() => _filtroAtivo = 'Por Concluir'),
                  ),
                  const SizedBox(width: 10),
                  ConsultorFiltroChip(
                    texto: 'Expirados',
                    icone: 'lib/assets/icons/Icon_Expirado.svg',
                    isSelected: _filtroAtivo == 'Expirados',
                    onTap: () => setState(() => _filtroAtivo = 'Expirados'),
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
                  // Ordenar: Não concluídos primeiro
                  final listaOrdenada = List<ObjetivosModel>.from(listaObjetivos);
                  listaOrdenada.sort((a, b) {
                    bool aConcluido = a.data_conclusao_objetivo != null && a.data_conclusao_objetivo!.isNotEmpty;
                    bool bConcluido = b.data_conclusao_objetivo != null && b.data_conclusao_objetivo!.isNotEmpty;
                    
                    if (!aConcluido && bConcluido) return -1;
                    if (aConcluido && !bConcluido) return 1;
                    return 0;
                  });

                  // Filtrar por pesquisa e por estado (Todos / Por Concluir / Expirados)
                  final listaObjetivosFiltrada = listaOrdenada.where((obj) {
                    final matchPesquisa = obj.nome.toLowerCase().contains(_controllerPesquisa.text.toLowerCase());
                    
                    if (_filtroAtivo == 'Por Concluir') {
                      final naoConcluido = obj.data_conclusao_objetivo == null || obj.data_conclusao_objetivo!.isEmpty;
                      return matchPesquisa && naoConcluido;
                    }

                    if (_filtroAtivo == 'Expirados') {
                      // ANTIGO -> final naoConcluido = obj.data_conclusao_objetivo == null || obj.data_conclusao_objetivo!.isEmpty;
                      final naoConcluido = obj.data_conclusao_objetivo == null || obj.data_conclusao_objetivo!.isEmpty;
                      if (!naoConcluido) return false;
                      try {
                        //DateTime dataLimite = DateFormat("dd/MM/yyyy").parse(obj.data_limite_conclusao);
                        //final today = DateTime.now();
                        //final todayDate = DateTime(today.year, today.month, today.day);
                        //return matchPesquisa && dataLimite.isBefore(todayDate);

                        DateTime dataLimite = DateFormat("dd/MM/yyyy").parse(obj.data_limite_conclusao);

                        final agora = DateTime.now();
                        final hoje = DateTime(agora.year, agora.month, agora.day);

                        return matchPesquisa && dataLimite.isBefore(hoje);
                      } catch (e) {
                        return false;
                      }
                    }

                    return matchPesquisa;
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
                    padding: const EdgeInsets.only(left: 16, right: 16, bottom: 100),
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
