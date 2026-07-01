import 'dart:io';
import 'package:flutter/material.dart';
import 'dart:typed_data';
import 'dart:convert';
import 'package:flutter_svg/flutter_svg.dart';

class ConsultorRequisitosBadgeCard extends StatelessWidget {
  final String titulo;
  final String imagem;
  final String descricaoDocumentacao;
  final VoidCallback? onUpload;
  final bool isAprovado; // Adicionado para controlar o estado visual

  const ConsultorRequisitosBadgeCard({
    super.key,
    required this.titulo,
    required this.imagem,
    required this.descricaoDocumentacao,
    this.onUpload,
    this.isAprovado = false,
  });

  Widget _buildImage() {
    if (imagem.isEmpty) {
      return Container(color: Colors.grey[300], child: const Icon(Icons.image));
    }

    // Se for um caminho de ficheiro local
    if (imagem.startsWith('/')) {
      return Image.file(
        File(imagem),
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) =>
            Container(color: Colors.grey[300], child: const Icon(Icons.broken_image)),
      );
    }

    // Fallback para Base64
    try {
      String cleanBase64 = imagem.contains(',')
          ? imagem.split(',').last
          : imagem;
      return Image.memory(
        base64Decode(cleanBase64.trim()),
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) =>
            Container(color: Colors.grey[300], child: const Icon(Icons.broken_image)),
      );
    } catch (e) {
      return Container(color: Colors.grey[300], child: const Icon(Icons.broken_image));
    }
  }

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFF39639C);
    const textColor = Color(0xFF1A1C1E);
    const subtitleColor = Color(0xFF42474E);

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // CABEÇALHO: Imagem + Título + Ícone (Upload ou Aprovado)
          Row(
            children: [
              // Imagem circular
              Container(
                width: 60,
                height: 60,
                child: ClipOval(
                  child: _buildImage(),
                ),
              ),
              const SizedBox(width: 16),
              // Título
              Expanded(
                child: Text(
                  titulo,
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: textColor,
                  ),
                ),
              ),
              
              // Lógica de Ícones
              if (isAprovado)
                Padding(
                  padding: const EdgeInsets.only(right: 8.0),
                  child: SvgPicture.asset(
                    'lib/assets/icons/Icon_Aceite.svg',
                    width: 40,
                    colorFilter: const ColorFilter.mode(primaryColor, BlendMode.srcIn),
                  ),
                )
              else if (onUpload != null)
                IconButton(
                  onPressed: onUpload,
                  icon: const Icon(
                    Icons.file_upload_outlined,
                    color: primaryColor,
                    size: 45,
                  ),
                ),
            ],
          ),
          const SizedBox(height: 20),
          // SEÇÃO DE DOCUMENTAÇÃO
          const Text(
            'Documentos a submeter:',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: subtitleColor,
            ),
          ),
          const SizedBox(height: 12),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                '-> ',
                style: TextStyle(
                  fontSize: 16,
                  color: subtitleColor,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Expanded(
                child: Text(
                  descricaoDocumentacao,
                  style: const TextStyle(
                    fontSize: 16,
                    color: textColor,
                    height: 1.2,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
