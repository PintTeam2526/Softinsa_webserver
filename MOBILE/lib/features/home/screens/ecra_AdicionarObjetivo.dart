import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_appbar.dart';
import 'package:go_router/go_router.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_filtro_chip.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_searchBar.dart';
import '../widgets/consultor_infoMiniCards.dart';
import 'package:pint_26_mobile/core/app_state.dart';
//PEDIDOS DE DADOS
import 'package:pint_26_mobile/core/repositories/objetivos_repository.dart';
import 'package:pint_26_mobile/core/models/badges_model.dart';

class EcraAdicionarObjetivo extends ConsumerStatefulWidget {
  const EcraAdicionarObjetivo({super.key});

  @override
  ConsumerState<EcraAdicionarObjetivo> createState() => _EcraAdicionarObjetivoState();
}

class _EcraAdicionarObjetivoState extends ConsumerState<EcraAdicionarObjetivo> {
  final TextEditingController _controllerPesquisa = TextEditingController();
  late Future<List<BadgesModel>> _futureBadges;
  String _filtroAtivo = 'Todos';

  void _carregarDados() {
    final repositorio = ref.read(objetivosRepositoryProvider);
    setState(() {
      _futureBadges = repositorio.fetchBadgesParaObjetivos(AppState().idConsultor);
    });
  }

  @override
  void initState(){
    super.initState();
    _carregarDados();
  }

  @override
  void dispose() {
    _controllerPesquisa.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: const PaginaAppBar(
        titulo: 'Adicionar Objetivo',
        logo: 'lib/assets/icons/Icon_Objetivos.svg',
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 10),
          //BARRA DE PESQUISA
          ConsultorSearchBar(
            controller: _controllerPesquisa,
            placeholder: 'Nome do Badge',
            onChanged: (value){
              setState((){});
            },
          ),
          const SizedBox(height:10),
          // Filtros Horizontais
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 10),
            child: Row(
              children: [
                ConsultorFiltroChip(
                    texto: 'Badges Favoritos',
                    icone: 'lib/assets/icons/Icon_Favoritos.svg',
                    isSelected: _filtroAtivo == 'Favoritos',
                    onTap: () {
                      setState(() => _filtroAtivo = 'Favoritos');
                      print('SO MOSTRO OS FAVORITOS');
                    }
                ),
                const SizedBox(width: 10),
                ConsultorFiltroChip(
                    texto: 'Todos',
                    icone: 'lib/assets/icons/Icon_Objetivos.svg',
                    isSelected: _filtroAtivo == 'Todos',
                    onTap: () {
                      setState(() => _filtroAtivo = 'Todos');
                      _carregarDados();
                    },
                ),
              ],
            ),
          ),
          const SizedBox(height: 5), // Espaço reduzido
          Expanded(
            child: FutureBuilder<List<BadgesModel>>(
              future: _futureBadges,
              builder: (context,snapshot){

                if(snapshot.connectionState == ConnectionState.waiting){
                  return const Center(
                    child: CircularProgressIndicator(
                      color: Color(0xFF39639C),
                    ),
                  );
                }

                if(snapshot.hasError){
                  return Center(child: Text("Erro ao carregar dados: ${snapshot.error}"));
                }

                if(!snapshot.hasData || snapshot.data!.isEmpty){
                  return const Center(child: Text("Não existem objetivos por concluir disponíveis."));
                }

                final listaBadges = snapshot.data!;

                //FILTRAR A LISTA DE BADGES DE ACORDO COM O TEXTO QUE ESTA NA BARRA DE PESQUISA
                final listaBadgesFiltrada = listaBadges.where((badge){
                  final matchesNome = badge.nome.toLowerCase().contains(_controllerPesquisa.text.toLowerCase());
                  final matchesNomeArea = (badge.nome_area_pai ?? "").toLowerCase().contains(_controllerPesquisa.text.toLowerCase());
                  final isAtivo = badge.estado_a_i;
                  return (matchesNome || matchesNomeArea) && isAtivo;
                }).toList();

                if (listaBadgesFiltrada.isEmpty) {
                  return const Center(child: Text("Nenhum Badge Encontrado."));
                }

                return GridView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 3,
                    crossAxisSpacing: 10,
                    mainAxisSpacing: 10,
                    childAspectRatio: 0.65, // Ajustado para ser idêntico à página das áreas
                  ),
                  itemCount: listaBadgesFiltrada.length,
                  itemBuilder: (context, index) {
                    final badge = listaBadgesFiltrada[index];
                    return InkWell(
                      onTap: () async {
                        await context.push('/adicionarDataObjetivo', extra: [badge.id, badge.nome]);
                        if (mounted) _carregarDados();
                      },
                      child: InfoMiniCard(
                        imagem: badge.imagem,
                        titulo: badge.nome,
                        pai: badge.nome_area_pai,
                      ),
                    );
                  },
                );
              }
            ),
          ),
        ],
      ),
    );
  }
}
