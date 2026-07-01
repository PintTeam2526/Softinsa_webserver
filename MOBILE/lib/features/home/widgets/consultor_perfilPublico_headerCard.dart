import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'dart:convert';
import 'dart:typed_data';

class PerfilConsultorWidget extends StatelessWidget {
  final String nomeConsultor;
  final String areaPreferencia;
  final String imagemPerfil;
  final int totalBadges;
  final int totalPontos;

  const PerfilConsultorWidget({
    super.key,
    required this.nomeConsultor,
    required this.areaPreferencia,
    required this.imagemPerfil,
    required this.totalBadges,
    required this.totalPontos,
  });

  // Função para converter Base64 em bytes (bits)
  Uint8List _getImageBytes(String base64String) {
    try {
      // Remove o prefixo da API se existir (ex: data:image/png;base64,)
      String cleanBase64 = base64String.contains(',')
          ? base64String.split(',').last
          : base64String;

      // Limpeza de espaços e quebras de linha
      cleanBase64 = cleanBase64.replaceAll(RegExp(r'\s+'), '');

      // Correção de padding
      int paddingNeeded = (4 - (cleanBase64.length % 4)) % 4;
      cleanBase64 += '=' * paddingNeeded;

      return base64Decode(cleanBase64);
    } catch (e) {
      return Uint8List(0);
    }
  }

  Widget _buildProfileImage() {
    if (imagemPerfil.isEmpty || imagemPerfil == 'null') {
      return Image.asset('lib/assets/images/default-consultor-pfp.png', fit: BoxFit.cover);
    }

    // Suporte para ficheiro local
    if (imagemPerfil.startsWith('/')) {
      return Image.file(
        File(imagemPerfil),
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) =>
            Image.asset('lib/assets/images/default-consultor-pfp.png', fit: BoxFit.cover),
      );
    }

    // Suporte para Base64 (legado ou novos dados ainda não convertidos)
    bool isBase64 = imagemPerfil.length > 100 || !imagemPerfil.contains('/');
    if (isBase64) {
      try {
        return Image.memory(
          _getImageBytes(imagemPerfil),
          fit: BoxFit.cover,
          errorBuilder: (context, error, stackTrace) =>
              Image.asset('lib/assets/images/default-consultor-pfp.png', fit: BoxFit.cover),
        );
      } catch (e) {
        return Image.asset('lib/assets/images/default-consultor-pfp.png', fit: BoxFit.cover);
      }
    }

    // Suporte para Assets (caminhos curtos sem '/')
    return Image.asset(
      imagemPerfil,
      fit: BoxFit.cover,
      errorBuilder: (context, error, stackTrace) =>
          Image.asset('lib/assets/images/default-consultor-pfp.png', fit: BoxFit.cover),
    );
  }

  @override
  Widget build(BuildContext context) {
    const azulEscuro = Color(0xFF39639C);

    return Container(
      color: Colors.white,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // --- PARTE SUPERIOR (Foto + Stats) ---
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // 1. Círculo de Perfil
              Container(
                width: 160,
                height: 160,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: azulEscuro, width: 4),
                ),
                child: ClipOval(
                  child: _buildProfileImage(),
                ),
              ),

              const SizedBox(width: 40),

              // 2. Estatísticas
              Column(
                children: [
                  SvgPicture.asset(
                    'lib/assets/icons/Icon_BadgeObtido.svg',
                    width: 42,
                    height: 42,
                    colorFilter: const ColorFilter.mode(
                      azulEscuro,
                      BlendMode.srcIn,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text('$totalBadges Badges', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
                  const SizedBox(height: 10),
                  SvgPicture.asset(
                    'lib/assets/icons/Icon_Pontos.svg',
                    width: 50,
                    height: 50,
                    colorFilter: const ColorFilter.mode(
                      azulEscuro,
                      BlendMode.srcIn,
                    ),
                  ),
                  Text('$totalPontos Pontos', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
                ],
              ),
            ],
          ),

          const SizedBox(height: 25),

          // --- PARTE INFERIOR (Nome e Cargo) ---
          RichText(
            textAlign: TextAlign.center,
            text: TextSpan(
              style: const TextStyle(color: Colors.black, fontSize: 20),
              children: [
                TextSpan(
                  text: nomeConsultor,
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
                const TextSpan(
                  text: ' | ',
                  style: TextStyle(color: Colors.grey),
                ),
                TextSpan(
                  text: areaPreferencia,
                  style: TextStyle(color: Colors.black.withOpacity(0.7), fontSize: 16),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
