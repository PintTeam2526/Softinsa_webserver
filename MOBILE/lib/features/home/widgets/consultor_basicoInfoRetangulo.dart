import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart'; // ← importa o flutter_svg

class BasicInfoRetanguloCard extends StatelessWidget {
  const BasicInfoRetanguloCard({
    super.key,
    required this.titulo,
    required this.icone,
  });

  final String titulo;
  final String icone; // caminho do SVG


  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 10,
              spreadRadius: 0,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
        child: Row(
          children: [
            // LADO ESQUERDO — título e subtítulo
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    titulo,
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontFamily: 'Roboto',
                      fontWeight: FontWeight.w600,
                      fontSize: 28,
                      color: Colors.black87,
                    ),
                  ),
                ],
              ),
            ),

            // LADO DIREITO — número grande
            SvgPicture.asset(
              icone,
              width: 52,
              height: 52,
              colorFilter: const ColorFilter.mode(
                Color(0xFF39639C), // COR DO ÍCONE
                BlendMode.srcIn,
              ),
            ),
          ],
        ),
      ),
    );
  }
}