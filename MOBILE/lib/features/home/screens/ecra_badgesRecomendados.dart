import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pint_26_mobile/core/app_state.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_appbar.dart';
import 'package:pint_26_mobile/core/repositories/badgesRecomendados_repository.dart';
import 'package:pint_26_mobile/core/repositories/objetivos_repository.dart';
import 'package:pint_26_mobile/core/repositories/badgesConcluidos_repository.dart';
import 'package:pint_26_mobile/core/services/sync_service.dart';
import 'package:go_router/go_router.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_ListaBadgesSugeridos.dart';
import 'package:intl/intl.dart';

class EcraBadgesRecomendados extends ConsumerStatefulWidget {
  const EcraBadgesRecomendados({super.key});

  @override
  ConsumerState<EcraBadgesRecomendados> createState() => _EcraBadgesRecomendadosState();
}

class _EcraBadgesRecomendadosState extends ConsumerState<EcraBadgesRecomendados> {
  bool _isInitialSyncDone = false;

  @override
  void initState() {
    super.initState();

    // Sincroniza a tabela apenas uma vez ao entrar para evitar loops
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      if (!_isInitialSyncDone) {
        await SyncService.instance.syncTableByName('badgesRecomendados');
        if (mounted) {
          setState(() {
            _isInitialSyncDone = true;
          });
        }
      }
    });

    // Escuta atualizações do sync para estas tabelas
    ref.read(syncServiceProvider).syncStream.listen((tableName) {
      final id = AppState().idConsultor;
      if (tableName == 'badgesRecomendados' && mounted) {
        ref.invalidate(badgesFutureProvider(id));
      }
      if (tableName == 'objetivos' && mounted) {
        ref.invalidate(objetivosConsultorProvider(id));
      }
      if (tableName == 'badgesConcluidos' && mounted) {
        ref.invalidate(badgesConcluidosProvider(id));
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final idConsultor = AppState().idConsultor;

    // Agora passamos o idConsultor para o badgesFutureProvider
    final badgesAsync = ref.watch(badgesFutureProvider(idConsultor));
    final objetivosAsync = ref.watch(objetivosConsultorProvider(idConsultor));
    final concluidosAsync = ref.watch(badgesConcluidosProvider(idConsultor));

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: const PaginaAppBar(
        titulo: 'Adicionar Objetivo',
        logo: 'lib/assets/icons/Icon_Objetivos.svg',
      ),
      body: Column(
        children: [
          const SizedBox(height: 70),
          Center(
            child: Text(
              'Badges Sugeridos',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.w400,
                color: Colors.black.withOpacity(0.8),
              ),
            ),
          ),
          const SizedBox(height: 15),

          Expanded(
            child: badgesAsync.when(
              data: (listaDeBadges) {
                return objetivosAsync.when(
                  data: (listaObjetivos) {
                    return concluidosAsync.when(
                      data: (listaConcluidos) {
                        final now = DateTime.now();
                        final today = DateTime(now.year, now.month, now.day);

                        // Filtrar IDs de badges que são objetivos ATIVOS (não concluídos e dentro do prazo)
                        // Se estiver expirado e não concluído, ele deve aparecer nas sugestões.
                        final idsObjetivosAtivos = listaObjetivos.where((o) {
                          // Se já está concluído, deve ser excluído da lista de sugestões
                          if (o.data_conclusao_objetivo != null && o.data_conclusao_objetivo!.isNotEmpty) {
                            return true;
                          }
                          
                          // Verificar se está expirado
                          try {
                            final dataLimite = DateFormat('dd/MM/yyyy').parse(o.data_limite_conclusao);
                            // Se a data limite é hoje ou no futuro, está ATIVO (deve ser excluído)
                            return !dataLimite.isBefore(today);
                          } catch (e) {
                            return true;
                          }
                        }).map((o) => o.id_badge).toSet();

                        // Filtrar IDs de badges que já estão na tabela badgesConcluidos
                        final idsConcluidos = listaConcluidos.map((c) => c.idBadge).toSet();

                        final listaFiltrada = listaDeBadges?.where((badge) {
                          return !idsObjetivosAtivos.contains(badge.idBadge) &&
                              !idsConcluidos.contains(badge.idBadge);
                        }).toList() ?? [];

                        if (listaFiltrada.isEmpty) {
                          return const Center(
                            child: Text(
                              'Não existem badges sugeridos no momento.',
                              style: TextStyle(color: Colors.grey),
                            ),
                          );
                        }

                        return ConsultorListaBadgesSugeridos(
                          badges: listaFiltrada,
                        );
                      },
                      loading: () => const Center(child: CircularProgressIndicator(color: Color(0xFF39639C))),
                      error: (err, stack) => Center(child: Text('Erro ao carregar concluídos: $err')),
                    );
                  },
                  loading: () => const Center(child: CircularProgressIndicator(color: Color(0xFF39639C))),
                  error: (err, stack) => Center(child: Text('Erro ao carregar objetivos: $err')),
                );
              },
              loading: () => const Center(
                child: CircularProgressIndicator(
                  color: Color(0xFF39639C),
                ),
              ),
              error: (err, stack) => Center(
                child: Text('Erro ao carregar badges sugeridos: $err'),
              ),
            ),
          ),

          Padding(
            padding: const EdgeInsets.only(bottom: 190, top: 20),
            child: OutlinedButton(
              onPressed: () {
                context.push('/adicionarObjetivo');
              },
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: Color(0xFF39639C), width: 1.5),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(25),
                ),
                padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
              ),
              child: const Text(
                'Ver mais',
                style: TextStyle(
                  color: Color(0xFF39639C),
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
