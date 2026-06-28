import 'dart:convert'; // Necessário para base64Decode
import 'package:flutter/material.dart';

class BadgePerfilPublico extends StatelessWidget {
  final String imagemBadge; // Agora espera a String Base64
  final String nomeBadge;
  final String nivel;
  final String dataConclusao;
  final VoidCallback onTapRequisitos;

  const BadgePerfilPublico({
    super.key,
    required this.imagemBadge,
    required this.nomeBadge,
    required this.nivel,
    required this.dataConclusao,
    required this.onTapRequisitos,
  });

  @override
  Widget build(BuildContext context) {
    const azulEscuro = Color(0xFF39639C);

    // Converte a string Base64 em bytes (Uint8List)
    // Se a string vier com o prefixo "data:image/png;base64,", terás de o remover primeiro.
    final imageBytes = base64Decode(imagemBadge);

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 5, vertical: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.3),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          // Imagem do Badge renderizada da Memória
          Container(
            width: 120,
            height: 120,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              image: DecorationImage(
                // Substituído AssetImage por MemoryImage
                image: MemoryImage(imageBytes),
                fit: BoxFit.cover,
              ),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  nomeBadge,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF42474E),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  nivel,
                  style: const TextStyle(
                    fontSize: 14,
                    color: Colors.grey,
                  ),
                ),
                Text(
                  'Concluido: $dataConclusao',
                  style: const TextStyle(
                    fontSize: 14,
                    color: Colors.grey,
                  ),
                ),
                const SizedBox(height: 12),
                OutlinedButton(
                  onPressed: onTapRequisitos,
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: azulEscuro, width: 2),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(25),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                  ),
                  child: const Text(
                    'Ver Requisitos',
                    style: TextStyle(
                      color: azulEscuro,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}