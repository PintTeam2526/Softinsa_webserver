import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';

class ConsultorHeaderCard extends StatelessWidget {
  const ConsultorHeaderCard({
    super.key,
    required this.nomeConsultor,
    required this.areaPreferencia,
    required this.imagemPerfil,
    this.definicoes = false,
  });

  final String nomeConsultor;
  final String areaPreferencia;
  final String imagemPerfil;
  final bool definicoes;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF6383B3), // Azulo Softinsa
        borderRadius: BorderRadius.circular(24),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Olá, ${nomeConsultor.split(' ').first}!',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 30,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  areaPreferencia,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          _imagemPerfil(imagemPerfil: imagemPerfil),
        ],
      ),
    );
  }
}

class _imagemPerfil extends StatefulWidget {
  const _imagemPerfil({required this.imagemPerfil});

  final String imagemPerfil;

  @override
  State<_imagemPerfil> createState() => _imagemPerfilState();
}

class _imagemPerfilState extends State<_imagemPerfil> {
  bool _imagemFalhou = false;

  @override
  Widget build(BuildContext context) {
    ImageProvider provider;

    if (_imagemFalhou || widget.imagemPerfil.isEmpty || widget.imagemPerfil == 'teste' || widget.imagemPerfil == 'null') {
      provider = const AssetImage('lib/assets/images/default-consultor-pfp.png');
    } else if (widget.imagemPerfil.startsWith('http')) {
      provider = NetworkImage(widget.imagemPerfil);
    } else {
      // JPEGs em Base64 começam com '/9j/', por isso não podemos assumir que '/' é sempre um ficheiro.
      try {
        if (widget.imagemPerfil.startsWith('/') && widget.imagemPerfil.length < 500) {
          // Se começar por '/' e for uma string curta, é provavelmente um caminho de ficheiro
          provider = FileImage(File(widget.imagemPerfil));
        } else {
          // Caso contrário, tentamos descodificar como Base64
          String cleanBase64 = widget.imagemPerfil.contains(',')
              ? widget.imagemPerfil.split(',').last
              : widget.imagemPerfil;
          cleanBase64 = cleanBase64.trim().replaceAll('\n', '').replaceAll('\r', '').replaceAll(' ', '');
          
          while (cleanBase64.length % 4 != 0) {
            cleanBase64 += '=';
          }
          provider = MemoryImage(base64Decode(cleanBase64));
        }
      } catch (e) {
        // Se falhar a descodificação, fazemos um último fallback para ficheiro ou imagem default
        if (widget.imagemPerfil.startsWith('/')) {
          provider = FileImage(File(widget.imagemPerfil));
        } else {
          provider = const AssetImage('lib/assets/images/default-consultor-pfp.png');
        }
      }
    }

    return Container(
      width: 90,
      height: 90,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(color: Colors.white.withOpacity(0.3), width: 2),
      ),
      child: ClipOval(
        child: Image(
          image: provider,
          fit: BoxFit.cover,
          errorBuilder: (context, error, stackTrace) {
            return Image.asset('lib/assets/images/default-consultor-pfp.png', fit: BoxFit.cover);
          },
        ),
      ),
    );
  }
}
