import 'dart:io';
import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class ConsultorEstadoPedidoBadgeCard extends StatefulWidget {
  final String imagem; // Agora pode ser um path de ficheiro ou Base64
  final String nomeBadge;
  final String nivelBadge;
  final String textoBotao;
  final VoidCallback onTap;

  const ConsultorEstadoPedidoBadgeCard({
    super.key,
    required this.imagem,
    required this.nomeBadge,
    required this.nivelBadge,
    required this.textoBotao,
    required this.onTap,
  });

  @override
  State<ConsultorEstadoPedidoBadgeCard> createState() =>
      _ConsultorEstadoPedidoBadgeCardState();
}

class _ConsultorEstadoPedidoBadgeCardState
    extends State<ConsultorEstadoPedidoBadgeCard> {

  Widget _buildImage() {
    if (widget.imagem.isEmpty || widget.imagem == ' ' || widget.imagem == 'null') {
      return Container(
        color: Colors.grey[200],
        child: const Icon(Icons.image, color: Colors.grey),
      );
    }

    // Se for um caminho de ficheiro local (novo formato)
    if (widget.imagem.startsWith('/')) {
      return Image.file(
        File(widget.imagem),
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) => Container(
          color: Colors.grey[200],
          child: const Icon(Icons.broken_image, color: Colors.grey),
        ),
      );
    }

    // Caso contrário, tenta como Base64 (formato legado)
    try {
      String cleanBase64 = widget.imagem.contains(',')
          ? widget.imagem.split(',').last
          : widget.imagem;
      return Image.memory(
        base64Decode(cleanBase64.trim()),
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) => Container(
          color: Colors.grey[200],
          child: const Icon(Icons.broken_image, color: Colors.grey),
        ),
      );
    } catch (e) {
      return Container(
        color: Colors.grey[200],
        child: const Icon(Icons.broken_image, color: Colors.grey),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    // Lógica para definir o ícone e o seu tamanho com base no estado
    String iconPath;
    double iconSize = 60; // Tamanho padrão

    if (widget.textoBotao == 'Aprovado' || widget.textoBotao == 'Concluido') {
      iconPath = 'lib/assets/icons/Icon_BadgeObtido.svg';
    } else if (widget.textoBotao == 'Rejeitado') {
      iconPath = 'lib/assets/icons/Icon_BadgeRejeitado.svg';
      iconSize = 70; // Aumentado para compensar o design do SVG original
    } else {
      iconPath = 'lib/assets/icons/Icon_RelogioEmEspera.svg';
    }
    
    // Garantia de que o caminho do asset não é vazio (Fallback)
    if (iconPath.isEmpty) {
      iconPath = 'lib/assets/icons/Icon_BadgePorObter.svg';
    }

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Card(
        elevation: 3,
        shadowColor: Colors.black.withOpacity(0.5),
        color: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: Row(
            children: [
              // Imagem do Badge
              ClipRRect(
                borderRadius: BorderRadius.circular(20),
                child: SizedBox(
                  width: 100,
                  height: 100,
                  child: _buildImage(),
                ),
              ),
              const SizedBox(width: 12),

              // Informações e Botão
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      widget.nomeBadge,
                      style: theme.textTheme.titleMedium?.copyWith(
                        color: const Color(0xFF1A1C1E),
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    Text(
                      'Nivel ${widget.nivelBadge}',
                      style: theme.textTheme.bodyMedium?.copyWith(
                        color: Colors.grey[700],
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(height: 12),
                    OutlinedButton(
                      onPressed: () {
                        widget.onTap();
                      },
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: Color(0xFF39639C), width: 1.5),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                        ),
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        minimumSize: const Size(100, 36),
                      ),
                      child: Text(
                        widget.textoBotao,
                        style: const TextStyle(
                          color: Color(0xFF39639C),
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              // Ícone de Estado com tamanho ajustável
              Padding(
                padding: const EdgeInsets.only(left: 8.0),
                child: SizedBox(
                  width: 80,
                  height: 80,
                  child: Center(
                    child: SvgPicture.asset(
                      iconPath,
                      width: iconSize,
                      height: iconSize,
                      colorFilter: const ColorFilter.mode(
                        Color(0xFF39639C),
                        BlendMode.srcIn,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
