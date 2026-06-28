import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class BadgesCard extends StatelessWidget {
  const BadgesCard({
    super.key,
    required this.titulo,
    required this.totalBadges,
    required this.icone,
  });

  final String titulo;
  final int totalBadges;
  final String icone;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 4), // Sombra com "altura"
          ),
        ],
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
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
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              SvgPicture.asset(
                icone,
                width: 50,
                height: 50,
                colorFilter: const ColorFilter.mode(
                  Color(0xFF6383B3),
                  BlendMode.srcIn,
                ),
              ),
              const SizedBox(width: 12),
              Text(
                '$totalBadges',
                style: const TextStyle(
                  fontSize: 42,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF6383B3),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
