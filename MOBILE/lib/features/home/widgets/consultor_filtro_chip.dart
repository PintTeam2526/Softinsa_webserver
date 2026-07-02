import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class ConsultorFiltroChip extends StatelessWidget {
  final String texto;
  final String icone;
  final VoidCallback onTap;
  final bool isSelected;

  const ConsultorFiltroChip({
    super.key,
    required this.texto,
    required this.icone,
    required this.onTap,
    this.isSelected = false,
  });

  @override
  Widget build(BuildContext context) {
    // Definimos uma cor azul mais suave para o estado selecionado
    const Color azulSuave = Color(0xFF4A78B5);
    const Color fundoAzulSuave = Color(0xFFF0F5FA);

    return TweenAnimationBuilder<double>(
      duration: const Duration(milliseconds: 400),
      tween: Tween(begin: 0.0, end: 1.0),
      curve: Curves.easeOutBack,
      builder: (context, value, child) {
        return Transform.scale(
          scale: value,
          child: Opacity(
            opacity: value,
            child: child,
          ),
        );
      },
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(10),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 250),
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          decoration: BoxDecoration(
            border: Border.all(
              color: isSelected ? azulSuave : Colors.grey.shade300,
              width: 1.5,
            ),
            borderRadius: BorderRadius.circular(10),
            color: isSelected ? fundoAzulSuave : Colors.white,
            boxShadow: isSelected 
              ? [BoxShadow(color: azulSuave.withOpacity(0.1), blurRadius: 4, offset: const Offset(0, 2))]
              : [],
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              SvgPicture.asset(
                icone,
                width: 14,
                height: 14,
                colorFilter: ColorFilter.mode(
                  isSelected ? azulSuave : const Color(0xFF39639C),
                  BlendMode.srcIn,
                ),
              ),
              const SizedBox(width: 6),
              AnimatedDefaultTextStyle(
                duration: const Duration(milliseconds: 200),
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                  color: isSelected ? azulSuave : const Color(0xFF4A4A4A),
                ),
                child: Text(texto),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
