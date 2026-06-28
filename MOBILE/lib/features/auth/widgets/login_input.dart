import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class LoginInput extends StatefulWidget {
  final String texto;
  final String placeholder;
  final String icone;
  final TextEditingController controller;
  final bool isPassword;

  const LoginInput({
    super.key,
    required this.texto,
    required this.placeholder,
    required this.icone,
    required this.controller,
    this.isPassword = false,
  });

  @override
  State<LoginInput> createState() => _LoginInputState();
}

class _LoginInputState extends State<LoginInput> {
  late bool _esconderTexto;

  @override
  void initState() {
    super.initState();
    _esconderTexto = widget.isPassword;
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          widget.texto,
          style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: widget.controller,
          obscureText: _esconderTexto,
          decoration: InputDecoration(
            hintText: widget.placeholder,
            fillColor: Colors.grey[100],
            filled: true,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(15),
              borderSide: BorderSide.none,
            ),
            prefixIcon: Padding(
              padding: const EdgeInsets.all(12.0),
              child: SvgPicture.asset(
                widget.icone,
                width: 24,
                height: 24,
                colorFilter: const ColorFilter.mode(
                  Color(0xFF39639C),
                  BlendMode.srcIn,
                ),
              ),
            ),
            suffixIcon: widget.isPassword
                ? IconButton(
                    icon: Icon(
                      _esconderTexto ? Icons.visibility_off : Icons.visibility,
                      color: Colors.grey,
                    ),
                    onPressed: () => setState(() => _esconderTexto = !_esconderTexto),
                  )
                : null,
          ),
        ),
        const SizedBox(height: 20),
      ],
    );
  }
}
