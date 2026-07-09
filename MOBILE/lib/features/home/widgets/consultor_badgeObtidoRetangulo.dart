import 'package:flutter/material.dart';
import 'dart:io';
import 'dart:typed_data';
import 'dart:convert';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';

class ConsultorBadgeObtidoRetangulo extends StatelessWidget {
  final String titulo;
  final String subtitulo;
  final String imagem; // Pode ser path de ficheiro ou Base64
  final String? dataExpiracao;
  final int pontos;
  final VoidCallback? onCertificado;
  final VoidCallback? onPartilhar;
  final int idBadge;

  const ConsultorBadgeObtidoRetangulo({
    super.key,
    required this.titulo,
    required this.subtitulo,
    required this.imagem,
    this.dataExpiracao,
    required this.pontos,
    required this.idBadge,
    this.onCertificado,
    this.onPartilhar,
  });

  Widget _buildImage() {
    if (imagem.isEmpty || imagem == "null") {
      return const Icon(Icons.workspace_premium, size: 40, color: Colors.grey);
    }

    // Se for um caminho de ficheiro local
    if (imagem.startsWith('/')) {
      return Image.file(
        File(imagem),
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) =>
            const Icon(Icons.broken_image, size: 40),
      );
    }

    // Se for Base64 (legado)
    try {
      String cleanBase64 = imagem.contains(',')
          ? imagem.split(',').last
          : imagem;
      return Image.memory(
        base64Decode(cleanBase64.trim()),
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
            color: Colors.black.withOpacity(0.12),
            blurRadius: 12,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: IntrinsicHeight(
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 90,
                  height: 90,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.1),
                        blurRadius: 4,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: InkWell(
                    onTap: () {
                      context.push('/mostrarCandidaturaBadge', extra: idBadge);
                    },
                    child: ClipOval(
                      child: _buildImage(),
                    ),
                  ),
                ),
                if (dataExpiracao != null && dataExpiracao!.isNotEmpty) ...[
                  const SizedBox(height: 16),
                  Text(
                    'Expira: $dataExpiracao',
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: subtitleColor,
                    ),
                  ),
                ],
              ],
            ),
            const SizedBox(width: 20),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    titulo,
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: textColor,
                      height: 1.1,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    subtitulo,
                    style: const TextStyle(
                      fontSize: 14,
                      color: subtitleColor,
                    ),
                  ),
                  const Spacer(),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: const BoxDecoration(
                              color: primaryColor,
                              shape: BoxShape.circle,
                            ),
                            child: SvgPicture.asset(
                              'lib/assets/icons/Icon_Pontos.svg',
                              width: 25,
                              height: 25,
                              colorFilter: const ColorFilter.mode(
                                Colors.white,
                                BlendMode.srcIn,
                              ),
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '$pontos pts',
                            style: const TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                              color: subtitleColor,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            _buildButton(
                              label: 'Certificado',
                              onPressed: onCertificado,
                              color: primaryColor,
                            ),
                            const SizedBox(height: 8),
                            _buildButton(
                              label: 'Partilhar',
                              onPressed: onPartilhar,
                              color: primaryColor,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildButton({
    required String label,
    required VoidCallback? onPressed,
    required Color color,
  }) {
    return SizedBox(
      width: double.infinity,
      height: 32,
      child: OutlinedButton(
        onPressed: onPressed,
        style: OutlinedButton.styleFrom(
          side: BorderSide(color: color, width: 1.2),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          padding: EdgeInsets.zero,
        ),
        child: Text(
          label,
          style: TextStyle(
            color: color,
            fontSize: 12,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }
}
