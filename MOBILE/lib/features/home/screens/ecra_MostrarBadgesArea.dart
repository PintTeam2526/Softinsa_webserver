import 'package:flutter/material.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_appbar.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_mostrarDetalhes.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_badgeArea_retangulo.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_searchBar.dart';
import 'package:go_router/go_router.dart';

//PEDIDOS DADOS
import 'package:pint_26_mobile/core/repositories/areas_repository.dart';
import 'package:pint_26_mobile/core/models/areas_model.dart';
import 'package:pint_26_mobile/core/repositories/badges_repository.dart';
import 'package:pint_26_mobile/core/models/badges_model.dart';


class EcraMostrarBadgesArea extends StatefulWidget {

  final int idArea;

  const EcraMostrarBadgesArea({
    super.key,
    required this.idArea
  });

  @override
  State<EcraMostrarBadgesArea> createState() => _EcraMostrarBadgesAreaState();
}

class _EcraMostrarBadgesAreaState extends State<EcraMostrarBadgesArea> {
  //instanciar o repositorio dos Learning Path
  final AreasRepository _repositorioAreas = AreasRepository();
  final BadgesRepository _repositorioBadges = BadgesRepository();
  final TextEditingController _controllerPesquisa = TextEditingController();

  //criar a variavel que guarda o future (pedido)
  late Future<AreasModel> _futureArea;
  late Future<List<BadgesModel>> _futureBadges;

  Future<List<dynamic>>? _pedidoDados;

  void _carregarDados(){
    setState(() {
      _pedidoDados  = Future.wait([
        _futureArea = _repositorioAreas.getAreaById(widget.idArea),
        _futureBadges = _repositorioBadges.getBadgesByAreaId(widget.idArea),
      ]);
    });
  }

  //override no initstate para fazer a chamada do repositorio
  @override
  void initState(){
    super.initState();
    //Fazer um future.wait para fazer os pedidos simultaneamente
    _carregarDados();
  }

  @override
  void dispose() {
    _controllerPesquisa.dispose();
    super.dispose();
  }

  //COMO o idArea vem da NavBar pode mudar sem este ecra ser destruido, dai vai verificar sempre se atualizou
  @override
  void didUpdateWidget(EcraMostrarBadgesArea oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.idArea != widget.idArea) {
      _carregarDados();
    }
  }

  @override
  Widget build(BuildContext context) {
    // Se os pedidos ainda não foram disparados
    if (_pedidoDados == null) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return FutureBuilder<List<dynamic>>(
      future: _pedidoDados,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            body: Center(
              child: CircularProgressIndicator(color: Color(0xFF39639C)),
            ),
          );
        }

        // ESTADO DE ERRO
        if (snapshot.hasError) {
          return Scaffold(
            appBar: AppBar(title: const Text("Erro")),
            body: RefreshIndicator(
              onRefresh: () async => _carregarDados(),
              child: ListView(
                children: [
                  SizedBox(height: MediaQuery.of(context).size.height * 0.4),
                  Center(child: Text("Erro: ${snapshot.error}")),
                ],
              ),
            ),
          );
        }

        // DADOS RECEBIDOS COM SUCESSO
        final area = snapshot.data![0] as AreasModel;
        final List<BadgesModel> listaBadgesArea = snapshot.data![1] as List<BadgesModel>;

        // Filtragem por nome do badge
        final listaBadgesFiltrada = listaBadgesArea.where((badge) {
          final matchesPesquisa = badge.nome.toLowerCase().contains(_controllerPesquisa.text.toLowerCase());
          return badge.estado_a_i == true && matchesPesquisa;
        }).toList();

        return Scaffold(
          backgroundColor: Colors.white,
          appBar: PaginaAppBar(
            titulo: 'Badges ${area.nome}',
            logo: 'lib/assets/icons/Icon_BadgePorObter.svg',
            onLogoTap: () => print('Favoritos'),
          ),
          body: RefreshIndicator(
            onRefresh: () async {
              _carregarDados();
              await _pedidoDados;
            },
            child: Column(
              children: [
                MostrarDetalhes(
                  titulo: area.nome,
                  imagem: area.imagem,
                  dataInsercao: area.data_insercao,
                  textoBotao: 'Ver outros Badges',
                  onTapBotao: () => print('Clicou'),
                ),
                const SizedBox(height: 10),
                // BARRA DE PESQUISA
                ConsultorSearchBar(
                  controller: _controllerPesquisa,
                  placeholder: 'Pesquisar Badge...',
                  onChanged: (value) {
                    setState(() {});
                  },
                ),
                const SizedBox(height: 10),
                Expanded(
                  child: SingleChildScrollView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    child: Column(
                      children: [
                        if (listaBadgesFiltrada.isEmpty)
                          const Padding(
                            padding: EdgeInsets.only(top: 50.0),
                            child: Center(child: Text("Nenhum Badge encontrado.")),
                          )
                        else
                          ...listaBadgesFiltrada.map((badge) {
                            return ConsultorBadgeAreaRetangulo(
                              nivel: badge.nivel,
                              nomeBadge: badge.nome,
                              onTap: () {
                                //print('Badge: ${badge.nome}');
                                context.push('/mostrarCandidaturaBadge', extra: badge.id);
                              },
                            );
                          }).toList(),
                        const SizedBox(height: 130), // ESPACO PARA NAO SOBREPOR A NAVBAR
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
