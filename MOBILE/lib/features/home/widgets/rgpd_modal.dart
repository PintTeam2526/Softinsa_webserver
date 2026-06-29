import 'package:flutter/material.dart';

class RgpdModal extends StatelessWidget {
  final String textoRgpd;

  // Construtor que recebe a string
  const RgpdModal({
    super.key,
    required this.textoRgpd,
  });

  @override
  Widget build(BuildContext context) {

    const Color primaryColor = Color(0xFF39639C);

    return AlertDialog(
      backgroundColor: Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(15),
      ),
      title: const Text(
        'Termos e Condições (RGPD)',
        style: TextStyle(
          color: primaryColor,
          fontWeight: FontWeight.bold,
          fontSize: 18,
        ),
      ),
      content: SizedBox(
        // Define uma largura máxima para o modal
        width: MediaQuery.of(context).size.width * 0.8,
        child: SingleChildScrollView(
          child: Text(
            textoRgpd,
            textAlign: TextAlign.justify,
            style: const TextStyle(
              fontSize: 14,
              color: Colors.black87,
              height: 1.4,
            ),
          ),
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text(
            'Fechar',
            style: TextStyle(
              color: primaryColor,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ],
    );
  }
}