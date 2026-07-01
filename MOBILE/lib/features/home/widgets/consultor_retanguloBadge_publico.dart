import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';

class BadgePerfilPublico extends StatelessWidget {
  final String imagemBadge; // Agora contém o caminho do ficheiro ou Base64
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

  Widget _buildImage() {
    if (imagemBadge.isEmpty) {
      return const Icon(Icons.workspace_premium, size: 60, color: Colors.grey);
    }

    // Se começar com '/' é um ficheiro local (novo formato)
    if (imagemBadge.startsWith('/')) {
      return Image.file(
        File(imagemBadge),
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) => const Icon(Icons.broken_image, size: 60),
      );
    }

    // Caso contrário, tenta como Base64 (formato antigo/legado)
    try {
      String cleanBase64 = imagemBadge.contains(',')
          ? imagemBadge.split(',').last
          : imagemBadge;
      return Image.memory(
        base64Decode(cleanBase64.trim()),
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) => const Icon(Icons.broken_image, size: 60),
      );
    } catch (e) {
      return const Icon(Icons.broken_image, size: 60);
    }
  }

  @override
  Widget build(BuildContext context) {
    const azulEscuro = Color(0xFF39639C);

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
          Container(
            width: 120,
            height: 120,
            decoration: const BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.white,
            ),
            child: ClipOval(
              child: _buildImage(),
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
