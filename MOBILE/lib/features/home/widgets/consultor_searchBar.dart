import 'package:flutter/material.dart';

class ConsultorSearchBar extends StatelessWidget {
  final TextEditingController controller;
  final String? placeholder;
  final ValueChanged<String>? onChanged; //deteta se o valor foi alterado no Textfield

  const ConsultorSearchBar({
    super.key,
    required this.controller,
    this.placeholder, // Exemplo da imagem
    this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 25, vertical:1),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(15), // Bordas arredondadas
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 8,
              offset: const Offset(0, 2), // Sombra leve para dar profundidade
            ),
          ],
        ),
        child: TextField(
          controller: controller,
          onChanged: onChanged,
          decoration: InputDecoration(
            hintText: placeholder,
            hintStyle: const TextStyle(
              color: Color(0xFF5D5E6D), // Cor do texto cinza da imagem
              fontSize: 16,
            ),
            // Ícone de pesquisa à DIREITA (suffixIcon)
            suffixIcon: const Padding(
              padding: EdgeInsets.only(right: 15.0),
              child: Icon(
                Icons.search,
                color: Color(0xFF4A4B57), // Cor escura do ícone na imagem
                size: 24,
              ),
            ),
            border: InputBorder.none, // Remove a linha padrão do TextField
            contentPadding: const EdgeInsets.symmetric(
                horizontal: 25,
                vertical: 15
            ),
          ),
        ),
      ),
    );
  }
}