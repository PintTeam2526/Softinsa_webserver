import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class ConsultorEstadoPedidoBadgeCard extends StatefulWidget {
  final String imagem;
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

  // Função de conversão de Base64 para Bytes
  Uint8List _getImageBytes(String base64String) {
    try {
      String cleanBase64 = base64String.contains(',')
          ? base64String.split(',').last
          : base64String;
      return base64Decode(cleanBase64);
    } catch (e) {
      return Uint8List(0);
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
                  child: widget.imagem.isNotEmpty && widget.imagem != ' ' && widget.imagem != 'null'
                      ? Image.memory(
                    _getImageBytes(widget.imagem),
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) =>
                        Container(
                          color: Colors.grey[200],
                          child: const Icon(Icons.broken_image, color: Colors.grey),
                        ),
                  )
                      : Container(
                    color: Colors.grey[200],
                    child: const Icon(Icons.image, color: Colors.grey),
                  ),
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
