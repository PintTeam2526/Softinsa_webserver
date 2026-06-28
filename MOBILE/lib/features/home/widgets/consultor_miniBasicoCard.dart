import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class MiniBadgesCard extends StatelessWidget {
  const MiniBadgesCard({
    super.key,
    required this.titulo,
    required this.icone,
  });

  final String titulo;
  final String icone;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 4), // Sombra com altura
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            titulo,
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: Color(0xFF1D1B20),
            ),
          ),
          const SizedBox(height: 16),
          SvgPicture.asset(
            icone,
            width: 36,
            height: 36,
            colorFilter: const ColorFilter.mode(
              Color(0xFF39639C), // Corrigido para azul Softinsa consistente
              BlendMode.srcIn,
            ),
          ),
        ],
      ),
    );
  }
}
