import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:pint_26_mobile/features/home/screens/ecra_principal.dart';
import 'package:pint_26_mobile/features/home/screens/ecra_pedidos.dart';
import 'package:pint_26_mobile/features/home/screens/ecra_notificacoes.dart';
import 'package:pint_26_mobile/features/home/screens/ecra_definicoes.dart';
import 'package:pint_26_mobile/features/home/screens/ecra_perfilPublico.dart';
import 'package:pint_26_mobile/features/home/screens/ecra_MostrarLearningPaths.dart';
import 'package:pint_26_mobile/features/home/screens/ecra_MostrarServiceLines.dart';
import 'package:pint_26_mobile/features/home/screens/ecra_MostrarAreas.dart';
import 'package:pint_26_mobile/features/home/screens/ecra_MostrarBadgesArea.dart';
import 'package:pint_26_mobile/features/home/screens/ecra_Objetivos.dart';
import 'package:pint_26_mobile/features/home/screens/ecra_badgesPorObter.dart';
import 'package:pint_26_mobile/features/home/screens/ecra_badgesObtidos.dart';
import 'package:pint_26_mobile/features/home/screens/ecra_conquistas.dart';

class ConsultorNavBar extends StatefulWidget {
  final int indexInicial;
  final int idConsultorLogado;

  const ConsultorNavBar({
    super.key,
    this.indexInicial = 1,
    required this.idConsultorLogado
  });

  @override
  State<ConsultorNavBar> createState() => _ConsultorNavBarState();
}

class _ConsultorNavBarState extends State<ConsultorNavBar> {
  late int indexSelecionado;

  //guarda as variaveis de filtros de pesquisa
  String? nomeLPparaBarraPesquisa;
  String? nomeSLparaBarraPesquisa;
  int idAreaParaBadge = 0;

  @override
  void initState() {
    super.initState();
    indexSelecionado = widget.indexInicial;
  }




  List<Widget> _buildScreens() {
    return [
      EcraPedidos(),     // 0
      EcraPrincipal( // 1
          idConsultor: widget.idConsultorLogado,
          onConsultorHeaderCardTap: () => setState(() => indexSelecionado = 4),
          onLearningPathsCardTap: () => setState(() => indexSelecionado = 5),
          onServiceLinesCardTap: () => setState(() => indexSelecionado = 6),
          onAreasCardTap: () => setState(() => indexSelecionado = 7),
          onObjetivosCardTap: () => setState(() => indexSelecionado = 9),
          onBadgesPorObterCardTap: () => setState(() => indexSelecionado = 10),
          onBadgesObtidosCardTap: () => setState(() => indexSelecionado = 11),
          onConquistasCardTap: () => setState(() => indexSelecionado = 12),
      ),
      EcraNotificacoes(), // 2
      EcraPerfilPublico(),      // 3 - Perfil Público
      EcraDefinicoes(),// 4 -EcraDefinicoes
      EcraMostrarLearningpaths(
        nomeLearningPathPai: (nome) {
          setState(() {
            nomeLPparaBarraPesquisa = nome;
            indexSelecionado = 6;
          });
        },
      ), // 5 - EcraLearningPaths
      EcraMostrarServiceLines(

        filtroPesquisa: nomeLPparaBarraPesquisa,
        nomeServiceLinePai: (nome){
          setState((){
            nomeSLparaBarraPesquisa = nome;
            indexSelecionado = 7;
          });
        },
      ), //6 - EcraServiceLines

      EcraMostrarAreas(
        filtroPesquisa: nomeSLparaBarraPesquisa,
        idAreaPai: (id){
          setState(() {
            idAreaParaBadge = id; //SO CONSIGO CHEGAR AO INDEX = 8 ATRAVES DESTA SEQUENCIA ENTAO NAO TEM MAL INICIAR A VARIAVEL (idAreaParaBadge) A 0
            indexSelecionado = 8;
          });
        }
      ), //7- EcraÁreas

      EcraMostrarBadgesArea(
          idArea: idAreaParaBadge
      ), //8 - EcraMostrarBadgesArea

      EcraObjetivos(), //9 - EcraObjetivos

      EcraBadgesPorObter(), //10 - EcraBadgesPorObter

      EcraBadgesObtidos(), //11 - EcraBadgesObtidos

      EcraConquistas() //12 - EcraConquistas
    ];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBody: true,
      backgroundColor: Colors.white,
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 30),
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(30),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.3),
                blurRadius: 4,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(30),
            child: NavigationBarTheme(
              data: NavigationBarThemeData(
                labelTextStyle: WidgetStateProperty.all(
                  const TextStyle(fontSize: 10, fontWeight: FontWeight.w500),
                ),
              ),
              child: NavigationBar(
                height: 55,
                  // Se o index for 4, passamos 0 apenas para a barra não crashar,
                  // mas vamos esconder a seleção abaixo
                  selectedIndex: indexSelecionado > 3 ? 0 : indexSelecionado,

                  // O TRUQUE: Se estivermos no ecra maior que 3, a cor do indicador fica transparente
                  indicatorColor: indexSelecionado > 3
                      ? Colors.transparent
                      : const Color(0xFFE8E4F3),

                onDestinationSelected: (index) {
                  setState(() {
                    indexSelecionado = index;
                  });
                },
                backgroundColor: Colors.white,
                destinations: [
                  _navItem('Icon_Pedidos_Navbar.svg', 'Pedidos'),      // 0
                  _navItem('Icon_Home_Navbar.svg', 'Home'),            // 1
                  _navItem('Icon_Notificacoes_Navbar.svg', 'Notificações'), // 2
                  _navItem('Icon_PerfilPublico_Navbar.svg', 'Perfil Público'),  // 3
                ],
              ),
            ),
          ),
        ),
      ),
      body: IndexedStack(
        index: indexSelecionado,
        children: _buildScreens(),
      ),
    );
  }

  NavigationDestination _navItem(String asset, String label) {
    return NavigationDestination(
      icon: SvgPicture.asset(
        'lib/assets/icons/$asset',
        width: 22,
        colorFilter: const ColorFilter.mode(Color(0xFF39639C), BlendMode.srcIn),
      ),
      label: label,
    );
  }
}