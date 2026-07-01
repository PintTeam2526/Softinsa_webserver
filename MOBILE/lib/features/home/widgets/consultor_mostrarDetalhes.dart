import 'dart:io';
import 'package:flutter/material.dart';
import 'dart:typed_data';
import 'dart:convert';

class MostrarDetalhes extends StatelessWidget {
  final String titulo;
  final String imagem;
  final String? dataInsercao; //? significa que a variavel pode ser nula
  final String? nomePai;
  final String textoBotao;
  final String? textoResumo;
  final VoidCallback? onTapBotao;

  const MostrarDetalhes({
    super.key,
    required this.titulo,
    required this.imagem,
    this.dataInsercao,
    required this.textoBotao,
    this.textoResumo,
    this.onTapBotao,
    this.nomePai,
  });

  Widget _buildImage() {
    if (imagem.isEmpty) {
      return Container(color: Colors.grey[300], child: const Icon(Icons.image));
    }

    // Se for um caminho de ficheiro local (novo formato)
    if (imagem.startsWith('/')) {
      return Image.file(
        File(imagem),
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) =>
            Container(color: Colors.grey[300], child: const Icon(Icons.broken_image)),
      );
    }

    // Caso contrário, tenta como Base64 (formato legado)
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
    return Padding(
      padding: const EdgeInsets.fromLTRB(25, 20, 25, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // SEÇÃO SUPERIOR: Imagem + Título + Botão
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Imagem Quadrada Arredondada
              ClipRRect(
                borderRadius: BorderRadius.circular(20),
                child: SizedBox(
                  width: 100,
                  height: 100,
                  child: _buildImage(),
                ),
              ),
              const SizedBox(width: 20),
              
              // Coluna com Título, Data e Botão
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      titulo,
                      style: const TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF1A1C1E),
                      ),
                    ),
                    const SizedBox(height: 4),
                    if (dataInsercao != null && dataInsercao!.isNotEmpty)
                      Text(
                        "Inserido: $dataInsercao",
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey[700],
                        ),
                      ),

                    if (nomePai != null && nomePai!.isNotEmpty)
                      Text(
                        nomePai!,
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                        ),
                      ),

                    const SizedBox(height: 15),
                    
                    // Botão Outlined
                    OutlinedButton(
                      onPressed: onTapBotao,
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: Color(0xFF1E5199), width: 1.5),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30),
                        ),
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                      ),
                      child: Text(
                        textoBotao,
                        style: const TextStyle(
                          color: Color(0xFF1E5199),
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          // Só adiciona o espaço e o resumo se houver texto
          if (textoResumo != null && textoResumo!.isNotEmpty) ...[
            const SizedBox(height: 20), // Reduzi de 30 para 20
            Text(
              "Resumo:",
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: Colors.grey[700],
              ),
            ),
            const SizedBox(height: 8), // Reduzi de 12 para 8
            Text(
              textoResumo!,
              style: const TextStyle(
                fontSize: 15,
                height: 1.6,
                color: Color(0xFF333333),
              ),
              textAlign: TextAlign.justify,
            ),
            const SizedBox(height: 20), // Espaço final opcional apenas se houver resumo
          ],
        ],
      ),
    );
  }
}
