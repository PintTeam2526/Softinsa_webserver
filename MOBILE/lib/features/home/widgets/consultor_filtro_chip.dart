import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class ConsultorFiltroChip extends StatelessWidget {
  final String texto;
  final String icone;
  final VoidCallback onTap;

  const ConsultorFiltroChip({
    super.key,
    required this.texto,
    required this.icone,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(10),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey.shade300),
          borderRadius: BorderRadius.circular(10),
          color: Colors.white,
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            SvgPicture.asset(
              icone,
              width: 14,
              height: 14,
              colorFilter: const ColorFilter.mode(
                Color(0xFF39639C),
                BlendMode.srcIn,
              ),
            ),
            const SizedBox(width: 4),
            Text(
              texto,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w500,
                color: Color(0xFF4A4A4A),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
