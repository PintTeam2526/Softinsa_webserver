import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
class InfoRetanguloCard extends StatelessWidget {
  const InfoRetanguloCard({
    super.key,
    required this.titulo,
    required this.textoLead,
    required this.total,
    this.leadingInt,
    this.showIconPontos = false,
  });

  final String titulo;
  final String textoLead; 
  final int total;
  final int? leadingInt;
  final bool showIconPontos;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    titulo,
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w500,
                      color: Color(0xFF1D1B20),
                    ),
                  ),
                  const SizedBox(height: 4),
                  RichText(
                    text: TextSpan(
                      style: const TextStyle(color: Color(0xFF49454F), fontSize: 13),
                      children: [
                          TextSpan(
                            text: '${leadingInt ?? ''}',
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                        TextSpan(text: textoLead),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  '$total',
                  style: const TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF6383B3),
                  ),
                ),
                if (showIconPontos) ...[
                  const SizedBox(width: 4),
                  SvgPicture.asset(
                    'lib/assets/icons/Icon_Pontos.svg',
                    width: 25,
                    height: 25,
                    colorFilter: const ColorFilter.mode(
                      Color(0xFF6383B3),
                      BlendMode.srcIn,
                    ),
                  ),
                ]
              ],
            ),
          ],
        ),
      ),
    );
  }
}
