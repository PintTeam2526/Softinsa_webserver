import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:pint_26_mobile/core/models/badgesRecomendados_model.dart';

class ConsultorListaBadgesSugeridos extends StatefulWidget {
  final List<BadgesRecomendadosModel> badges;

  const ConsultorListaBadgesSugeridos({super.key, required this.badges});

  @override
  State<ConsultorListaBadgesSugeridos> createState() => _ConsultorListaBadgesSugeridosState();
}

class _ConsultorListaBadgesSugeridosState extends State<ConsultorListaBadgesSugeridos> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (widget.badges.isEmpty) return const SizedBox.shrink();

    const int itemsPerPage = 6;
    final int pageCount = (widget.badges.length / itemsPerPage).ceil();

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(
          height: 350, // Aumentado para acomodar nomes longos que ocupem mais linhas
          child: PageView.builder(
            controller: _pageController,
            onPageChanged: (index) {
              setState(() {
                _currentPage = index;
              });
            },
            itemCount: pageCount,
            itemBuilder: (context, pageIndex) {
              int start = pageIndex * itemsPerPage;
              int end = (start + itemsPerPage < widget.badges.length)
                  ? start + itemsPerPage
                  : widget.badges.length;
              List<BadgesRecomendadosModel> pageItems = widget.badges.sublist(start, end);

              // Se houver apenas 1 a 3 badges no TOTAL, centramos a exibição
              if (widget.badges.length <= 3) {
                return Center(
                  child: SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: pageItems.map((badge) => Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 10),
                        child: SizedBox(
                          width: 110,
                          child: BadgeItem(badge: badge),
                        ),
                      )).toList(),
                    ),
                  ),
                );
              }

              return GridView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 3,
                  mainAxisSpacing: 15, //ALTURA ENTRE BADGES RECOMENDADOS
                  crossAxisSpacing: 15,
                  childAspectRatio: 0.62, // Ajustado para dar mais altura ao item e mostrar o texto completo
                ),
                itemCount: pageItems.length,
                itemBuilder: (context, index) {
                  return BadgeItem(badge: pageItems[index]);
                },
              );
            },
          ),
        ),
        const SizedBox(height: 10),
        // Indicadores de página (bolas)
        if (pageCount > 0)
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(pageCount, (index) {
              bool isActive = _currentPage == index;
              return Container(
                margin: const EdgeInsets.symmetric(horizontal: 6),
                width: 20,
                height: 20,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: isActive ? const Color(0xFF39639C) : Colors.grey.shade600,
                    width: 2,
                  ),
                ),
                padding: const EdgeInsets.all(3.5),
                child: isActive
                    ? Container(
                        decoration: const BoxDecoration(
                          color: Color(0xFF39639C),
                          shape: BoxShape.circle,
                        ),
                      )
                    : null,
              );
            }),
          ),
      ],
    );
  }
}

class BadgeItem extends StatelessWidget {
  final BadgesRecomendadosModel badge;

  const BadgeItem({super.key, required this.badge});

  Uint8List _getImageBytes(String base64String) {
    try {
      String cleanBase64 = base64String.contains(',')
          ? base64String.split(',').last
          : base64String;
      return base64Decode(cleanBase64.trim());
    } catch (e) {
      return Uint8List(0);
    }
  }

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () async {
        await context.push('/adicionarDataObjetivo', extra: [badge.idBadge, badge.nomeBadge]);
      },
      borderRadius: BorderRadius.circular(10),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Imagem circular com sombra
          Container(
            width: 90,
            height: 90,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.15),
                  blurRadius: 8,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: ClipOval(
              child: badge.imagemBadge.startsWith('http')
                  ? Image.network(
                      badge.imagemBadge,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) => Container(
                        color: Colors.grey.shade200,
                        child: const Icon(Icons.workspace_premium, size: 40, color: Colors.grey),
                      ),
                    )
                  : Image.memory(
                      _getImageBytes(badge.imagemBadge),
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) => Container(
                        color: Colors.grey.shade200,
                        child: const Icon(Icons.workspace_premium, size: 40, color: Colors.grey),
                      ),
                    ),
            ),
          ),
          const SizedBox(height: 10),
          // Nome do Badge
          Text(
            badge.nomeBadge,
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 13,
              color: Colors.black87,
            ),
          ),
        ],
      ),
    );
  }
}
