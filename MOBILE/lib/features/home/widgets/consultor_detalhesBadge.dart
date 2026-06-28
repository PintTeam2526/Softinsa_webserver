import 'package:flutter/material.dart';
import 'dart:typed_data';
import 'dart:convert';
import 'package:flutter_svg/flutter_svg.dart';

class ConsultorDetalhesBadge extends StatelessWidget {
  final String imagem;
  final String nome;
  final String nivel;
  final String estadoBadge;
  final int pontos;
  final bool isGratuito;
  final String descricaoBadge;

  const ConsultorDetalhesBadge({
    super.key,
    required this.imagem,
    required this.nome,
    required this.nivel,
    required this.estadoBadge,
    required this.pontos,
    required this.isGratuito,
    required this.descricaoBadge,
  });

  Uint8List _getImageBytes(String base64String) {
    String cleanBase64 = base64String.contains(',')
        ? base64String.split(',').last
        : base64String;
    return base64Decode(cleanBase64);
  }

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFF39639C);
    
    // Normalizar o estado para comparação
    final estadoNormalizado = estadoBadge.toLowerCase().trim();

    // Lógica para definir o ícone com base no estado
    String iconPath;
    double iconSize = 40;

    if (estadoNormalizado == 'aprovado' || estadoNormalizado == 'concluido' || estadoNormalizado == 'concluído') {
      iconPath = 'lib/assets/icons/Icon_Aceite.svg'; // Ícone de aprovado
    } else if (estadoNormalizado == 'incorreto' || estadoNormalizado == 'rejeitado' || estadoNormalizado == 'devolvido') {
      iconPath = 'lib/assets/icons/Icon_BadgeRejeitado.svg';
    } else if (estadoNormalizado == 'submetido' || estadoNormalizado == 'em análise') {
      iconPath = 'lib/assets/icons/Icon_RelogioEmEspera.svg';
      iconSize = 38;
    } else {
      iconPath = 'lib/assets/icons/Icon_BadgePorObter.svg';
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 16),
          padding: const EdgeInsets.all(16),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(20),
                child: Container(
                  width: 120,
                  height: 120,
                  color: Colors.grey[50],
                  child: imagem.isNotEmpty
                      ? Image.memory(_getImageBytes(imagem), fit: BoxFit.contain)
                      : const Icon(Icons.image, color: Colors.grey),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      nome,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF1A1C1E),
                      ),
                    ),
                    Text(
                      'Badge $nivel',
                      style: const TextStyle(fontSize: 14, color: Color(0xFF42474E)),
                    ),
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(30),
                        border: Border.all(color: primaryColor, width: 1.5),
                      ),
                      child: Text(
                        estadoBadge,
                        style: const TextStyle(color: primaryColor, fontWeight: FontWeight.w600, fontSize: 12),
                      ),
                    ),
                  ],
                ),
              ),
              Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    isGratuito ? Icons.money_off_rounded : Icons.attach_money_rounded,
                    color: primaryColor,
                    size: 40,
                  ),
                  const SizedBox(height: 8),
                  SvgPicture.asset('lib/assets/icons/Icon_Pontos.svg', width: 40),
                  Text("$pontos pts", style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  SvgPicture.asset(
                    iconPath,
                    width: iconSize,
                    colorFilter: const ColorFilter.mode(primaryColor, BlendMode.srcIn),
                  ),
                ],
              ),
            ],
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 25),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "Resumo:",
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey[700],
                ),
              ),
              const SizedBox(height: 8),
              Text(
                descricaoBadge,
                style: const TextStyle(
                  fontSize: 15,
                  height: 1.6,
                  color: Color(0xFF333333),
                ),
                textAlign: TextAlign.justify,
              ),
            ],
          ),
        ),
      ],
    );
  }
}
