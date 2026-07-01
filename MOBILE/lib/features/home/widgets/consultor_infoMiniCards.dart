import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';
import 'package:flutter/material.dart';

class InfoMiniCard extends StatelessWidget {
  final String imagem;
  final String titulo;
  final int? progresso;
  final String? pai;

  const InfoMiniCard({
    super.key,
    required this.imagem,
    required this.titulo,
    this.progresso,
    this.pai,
  });

  Widget _buildImage() {
    if (imagem.isEmpty) {
      return Container(
        color: Colors.grey[200],
        child: const Icon(Icons.image, size: 40, color: Colors.grey),
      );
    }

    // Se for um caminho de ficheiro local (novo formato)
    if (imagem.startsWith('/')) {
      return Image.file(
        File(imagem),
        width: 80,
        height: 80,
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) =>
            const Icon(Icons.broken_image, size: 40),
      );
    }

    // Caso contrário, tenta como Base64 (formato legado)
    try {
      String cleanBase64 = imagem.contains(',')
          ? imagem.split(',').last
          : imagem;
      return Image.memory(
        base64Decode(cleanBase64.trim()),
        width: 80,
        height: 80,
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) =>
            const Icon(Icons.broken_image, size: 40),
      );
    } catch (e) {
      return const Icon(Icons.broken_image, size: 40);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 80, // Reduzido para caber melhor em 3 colunas
          height: 80,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.15),
                blurRadius: 6,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          child: ClipOval(
            child: _buildImage(),
          ),
        ),
        const SizedBox(height: 8),
        Text(
          titulo,
          textAlign: TextAlign.center,
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
          style: const TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.bold,
            color: Color(0xFF1A1C1E),
          ),
        ),
        if (progresso != null)
          Text(
            'Progresso: $progresso%',
            style: TextStyle(fontSize: 11, color: Colors.grey[600]),
          ),
        if (pai != null)
          Text(
            pai!,
            textAlign: TextAlign.center,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(fontSize: 11, color: Colors.grey[600]),
          ),
      ],
    );
  }
}
