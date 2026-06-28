import 'package:flutter/material.dart';
import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter_svg/flutter_svg.dart';

class BadgePorObterRetangulo extends StatelessWidget {
  final String titulo;
  final String nivel;
  final String subtitulo;
  final String imagem;
  final int pontos;
  final VoidCallback onTapCandidatar;

  const BadgePorObterRetangulo({
    super.key,
    required this.titulo,
    required this.subtitulo,
    required this.imagem,
    required this.nivel,
    required this.pontos,
    required this.onTapCandidatar,
  });

  Uint8List _getImageBytes(String base64String) {
    try {
      String cleanBase64 = base64String.contains(',')
          ? base64String.split(',').last
          : base64String;
      cleanBase64 = cleanBase64.replaceAll(RegExp(r'\s+'), '');
      int paddingNeeded = (4 - (cleanBase64.length % 4)) % 4;
      cleanBase64 += '=' * paddingNeeded;
      return base64Decode(cleanBase64);
    } catch (e) {
      return Uint8List(0);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // IMAGEM DO BADGE
          Container(
            width: 75,
            height: 75,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.grey[100],
            ),
            child: ClipOval(
              child: imagem.isNotEmpty && imagem != "null"
                  ? Image.memory(
                _getImageBytes(imagem),
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) =>
                const Icon(Icons.badge, size: 35, color: Colors.grey),
              )
                  : const Icon(Icons.badge, size: 35, color: Colors.grey),
            ),
          ),
          const SizedBox(width: 16),

          // TEXTOS E BOTÃO (Centro)
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  titulo,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF1A1C1E),
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  nivel,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: Colors.grey[700],
                  ),
                ),
                Text(
                  subtitulo,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 13,
                    color: Colors.grey[600],
                  ),
                ),
                const SizedBox(height: 12),

                // BOTÃO CANDIDATAR
                SizedBox(
                  height: 36,
                  child: OutlinedButton(
                    onPressed: onTapCandidatar,
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: Color(0xFF39639C), width: 1.2),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                      ),
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                    ),
                    child: const Text(
                      'Candidatar ao badge',
                      style: TextStyle(
                        color: Color(0xFF39639C),
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),

          // PONTOS (Direita)
          Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              SvgPicture.asset(
                'lib/assets/icons/Icon_Pontos.svg',
                width: 55,
                height: 55,
                colorFilter: const ColorFilter.mode(
                  Color(0xFF39639C),
                  BlendMode.srcIn,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                '$pontos',
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF39639C),
                ),
              ),
            ],
          ),
          const SizedBox(width: 15), // puxa o conteudo para a esquerda
        ],
      ),
    );
  }
}
