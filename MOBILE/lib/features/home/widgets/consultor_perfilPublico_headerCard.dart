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

  // Função para converter Base64 em bytes (bits) com tratamento robusto
  Uint8List _getImageBytes(String base64String) {
    try {
      String cleanBase64 = base64String.contains(',')
          ? base64String.split(',').last
          : base64String;


      cleanBase64 = cleanBase64.trim().replaceAll(RegExp(r'\s+'), '');

      // 3. Correção de padding (Base64 deve ser múltiplo de 4)
      int paddingNeeded = (4 - (cleanBase64.length % 4)) % 4;
      if (paddingNeeded > 0) {
        cleanBase64 += '=' * paddingNeeded;
      }

      return base64Decode(cleanBase64);
    } catch (e) {
      debugPrint(">>> [DEBUG] Erro ao descodificar imagem Base64: $e");
      return Uint8List(0);
    }
  }

  Widget _buildProfileImage() {
    if (imagemPerfil.isEmpty || imagemPerfil == 'null') {
      return Image.asset('lib/assets/images/default-consultor-pfp.png', fit: BoxFit.cover);
    }

    bool isBase64 = imagemPerfil.startsWith('data:image') || imagemPerfil.length > 100;

    if (isBase64) {
      final bytes = _getImageBytes(imagemPerfil);
      if (bytes.isNotEmpty) {
        return Image.memory(
          bytes,
          fit: BoxFit.cover,
          errorBuilder: (context, error, stackTrace) {
            debugPrint(">>> [DEBUG] Erro Image.memory: $error");
            return Image.asset('lib/assets/images/default-consultor-pfp.png', fit: BoxFit.cover);
          },
        );
      }
    }

    if (imagemPerfil.startsWith('/') || imagemPerfil.startsWith('C:') || imagemPerfil.startsWith('content:')) {
      final file = File(imagemPerfil);
      if (file.existsSync()) {
        return Image.file(
          file,
          fit: BoxFit.cover,
          errorBuilder: (context, error, stackTrace) =>
              Image.asset('lib/assets/images/default-consultor-pfp.png', fit: BoxFit.cover),
        );
      }
    }

    // Suporte para Assets
    return Image.asset(
      imagemPerfil,
      fit: BoxFit.cover,
      errorBuilder: (context, error, stackTrace) {
        // Se falhar como asset, tenta uma última vez como base64 caso a string seja curta
        if (!isBase64 && imagemPerfil.length > 20) {
           final bytes = _getImageBytes(imagemPerfil);
           if (bytes.isNotEmpty) {
             return Image.memory(bytes, fit: BoxFit.cover);
           }
        }
        return Image.asset('lib/assets/images/default-consultor-pfp.png', fit: BoxFit.cover);
      },
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
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
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
              Column(
                children: [
                  SvgPicture.asset(
                    'lib/assets/icons/Icon_BadgeObtido.svg',
                    width: 42,
                    height: 42,
                    colorFilter: const ColorFilter.mode(azulEscuro, BlendMode.srcIn),
                  ),
                  const SizedBox(height: 10),
                  Text('$totalBadges Badges', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
                  const SizedBox(height: 10),
                  SvgPicture.asset(
                    'lib/assets/icons/Icon_Pontos.svg',
                    width: 50,
                    height: 50,
                    colorFilter: const ColorFilter.mode(azulEscuro, BlendMode.srcIn),
                  ),
                  Text('$totalPontos Pontos', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
                ],
              ),
            ],
          ),
          const SizedBox(height: 25),
          RichText(
            textAlign: TextAlign.center,
            text: TextSpan(
              style: const TextStyle(color: Colors.black, fontSize: 20),
              children: [
                TextSpan(text: nomeConsultor, style: const TextStyle(fontWeight: FontWeight.bold)),
                const TextSpan(text: ' | ', style: TextStyle(color: Colors.grey)),
                TextSpan(text: areaPreferencia, style: TextStyle(color: Colors.black.withOpacity(0.7), fontSize: 16)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
