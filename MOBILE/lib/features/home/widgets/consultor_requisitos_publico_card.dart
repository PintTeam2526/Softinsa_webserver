import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter/material.dart';

class RequisitosPublicoCard extends StatelessWidget {
  final String tituloRequisito;
  final String descricao;
  final String imagem;

  const RequisitosPublicoCard({
    super.key,
    required this.tituloRequisito,
    required this.descricao,
    required this.imagem,
  });

  @override
  Widget build(BuildContext context) {
    Uint8List? imageBytes;
    try {
      String cleanBase64 = imagem.contains(',') ? imagem.split(',').last : imagem;
      imageBytes = base64Decode(cleanBase64);
    } catch (e) {
      imageBytes = null;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // PARTE SUPERIOR: Título e Imagem
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Requisito',
                        style: TextStyle(
                          fontSize: 12,
                          color: Color(0xFF676D75),
                          fontWeight: FontWeight.w600,
                          letterSpacing: 0.5,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        tituloRequisito,
                        maxLines: 3,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 20, // Reduzido para evitar overflow
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF1A1C1E),
                          height: 1.1,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: Colors.grey[100],
                    image: imageBytes != null
                        ? DecorationImage(
                            image: MemoryImage(imageBytes),
                            fit: BoxFit.cover,
                          )
                        : null,
                  ),
                  child: imageBytes == null
                      ? const Icon(Icons.image_not_supported, color: Colors.grey, size: 30)
                      : null,
                ),
              ],
            ),
          ),

          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Divider(color: Colors.grey.withOpacity(0.15)),
          ),

          // PARTE INFERIOR: Descrição
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Descrição',
                  style: TextStyle(
                    fontSize: 12,
                    color: Color(0xFF676D75),
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  descricao,
                  style: const TextStyle(
                    fontSize: 14,
                    color: Color(0xFF42474E),
                    height: 1.4,
                  ),
                  textAlign: TextAlign.justify,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
