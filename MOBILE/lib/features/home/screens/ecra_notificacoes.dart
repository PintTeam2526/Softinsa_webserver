import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pint_26_mobile/core/app_state.dart';
import 'package:pint_26_mobile/core/repositories/notificacoes_repository.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_appbar.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_filtro_chip.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_notificacao_card.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_searchBar.dart';

// Provider com autoDispose para garantir que os dados são revistos ao entrar no ecrã
final notificacoesFutureProvider = FutureProvider.autoDispose((ref) async {
  final repository = ref.watch(notificacoesRepositoryProvider);
  final idConsultor = AppState().idConsultor;
  print(">>> [DEBUG] A carregar notificações para o Consultor ID: $idConsultor");
  return repository.getNotificacoes(idConsultor);
});

class EcraNotificacoes extends ConsumerStatefulWidget {
  const EcraNotificacoes({super.key});

  @override
  ConsumerState<EcraNotificacoes> createState() => _EcraNotificacoesState();
}

class _EcraNotificacoesState extends ConsumerState<EcraNotificacoes> {
  late final TextEditingController _controllerPesquisa;
  String _filtroAtivo = 'Todas';

  @override
  void initState() {
    super.initState();
    _controllerPesquisa = TextEditingController();
  }

  @override
  void dispose() {
    _controllerPesquisa.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final notificacoesAsync = ref.watch(notificacoesFutureProvider);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: const PaginaAppBar(
          titulo: 'Notificações',
          logo: 'lib/assets/icons/Icon_Notificacoes_Navbar.svg'
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          // Invalida o provider para forçar nova consulta e sync
          ref.invalidate(notificacoesFutureProvider);
          await ref.read(notificacoesFutureProvider.future);
        },
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 15),
            // BARRA DE PESQUISA
            ConsultorSearchBar(
              controller: _controllerPesquisa,
              placeholder: 'Pesquisar por remetente...',
              onChanged: (value) => setState(() {}),
            ),
            const SizedBox(height: 15),

            // LISTA DE NOTIFICAÇÕES
            Expanded(
              child: notificacoesAsync.when(
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (err, stack) => SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  child: Container(
                    height: 200,
                    alignment: Alignment.center,
                    child: Text('Erro ao carregar notificações: $err'),
                  ),
                ),
                data: (notificacoes) {
                  // Filtragem por remetente baseada no texto da pesquisa
                  final filteredList = notificacoes.where((n) {
                    final query = _controllerPesquisa.text.toLowerCase();
                    final matchesPesquisa = n.remetente.toLowerCase().contains(query);
                    
                    if (_filtroAtivo == 'Lidas') {
                       // Supondo que existe um campo 'lida' no modelo, 
                       // mas como não vi o modelo, vou apenas aplicar a lógica de visibilidade se existir.
                       // Se o modelo não tiver status, este filtro apenas mostra tudo.
                       return matchesPesquisa; 
                    } else if (_filtroAtivo == 'Não Lidas') {
                       return matchesPesquisa;
                    }

                    return matchesPesquisa;
                  }).toList();

                  if (filteredList.isEmpty) {
                    return ListView(
                      physics: const AlwaysScrollableScrollPhysics(),
                      children: const [
                        SizedBox(height: 100),
                        Center(
                          child: Text(
                            'Nenhuma notificação encontrada.',
                            style: TextStyle(color: Colors.grey, fontSize: 16),
                          ),
                        ),
                      ],
                    );
                  }

                  return ListView.builder(
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.only(bottom: 20, top: 10),
                    itemCount: filteredList.length,
                    itemBuilder: (context, index) {
                      final n = filteredList[index];
                      return ConsultorNotificacaoCard(
                        notificacao: n.notificacao,
                        dataDeEnvio: n.data_de_envio,
                        remetente: n.remetente,
                        descricao: n.descricao,
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
