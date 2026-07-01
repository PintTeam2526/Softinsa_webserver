import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/repositories/consultores_repository.dart';

class ModalRecuperacaoPassword extends ConsumerStatefulWidget {
  final String email;
  const ModalRecuperacaoPassword({super.key, required this.email});

  @override
  ConsumerState<ModalRecuperacaoPassword> createState() => _ModalRecuperacaoPasswordState();
}

class _ModalRecuperacaoPasswordState extends ConsumerState<ModalRecuperacaoPassword> {
  bool _isVerifying = true; // true = step 1 (verify code), false = step 2 (reset password)
  final List<TextEditingController> _codeControllers = List.generate(6, (_) => TextEditingController());
  final List<FocusNode> _focusNodes = List.generate(6, (_) => FocusNode());
  
  final TextEditingController _passController = TextEditingController();
  final TextEditingController _confirmPassController = TextEditingController();
  
  String? _errorMessage;
  bool _isLoading = false;

  @override
  void dispose() {
    for (var c in _codeControllers) {
      c.dispose();
    }
    for (var f in _focusNodes) {
      f.dispose();
    }
    _passController.dispose();
    _confirmPassController.dispose();
    super.dispose();
  }

  Future<void> _verificarCodigo() async {
    String codigo = _codeControllers.map((c) => c.text).join();
    if (codigo.length < 6) {
      setState(() => _errorMessage = "Introduza o código completo.");
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final sucesso = await ref.read(consultoresRepositoryProvider).verificarCodigoRecuperacao(widget.email, codigo);
      if (sucesso) {
        setState(() {
          _isVerifying = false;
          _isLoading = false;
        });
      } else {
        setState(() {
          _errorMessage = "Código inválido ou expirado. Tente novamente.";
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = "Erro ao verificar código.";
        _isLoading = false;
      });
    }
  }

  Future<void> _redefinirPassword() async {
    String pass = _passController.text;
    String confirmPass = _confirmPassController.text;
    String codigo = _codeControllers.map((c) => c.text).join();

    if (pass.length < 6) {
      setState(() => _errorMessage = "A password deve ter pelo menos 6 caracteres.");
      return;
    }
    if (pass != confirmPass) {
      setState(() => _errorMessage = "As passwords não coincidem.");
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final sucesso = await ref.read(consultoresRepositoryProvider).redefinirPassword(widget.email, codigo, pass);
      if (sucesso) {
        if (mounted) {
          Navigator.of(context).pop(true); // Retorna true para indicar sucesso
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text("Password alterada com sucesso!"), backgroundColor: Colors.green),
          );
        }
      } else {
        setState(() {
          _errorMessage = "Erro ao redefinir password. Tente novamente.";
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = "Erro de ligação.";
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              _isVerifying ? _buildStepVerificar() : _buildStepNovaPassword(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStepVerificar() {
    return Column(
      children: [
        const Icon(Icons.lock_outline, size: 60, color: Color(0xFF39639C)),
        const SizedBox(height: 16),
        const Text("Verificar código", style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        Text(
          "Enviámos um código de 6 dígitos para\n${widget.email}",
          textAlign: TextAlign.center,
          style: const TextStyle(color: Colors.grey),
        ),
        const SizedBox(height: 24),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: List.generate(6, (index) {
            return SizedBox(
              width: 45,
              child: TextField(
                controller: _codeControllers[index],
                focusNode: _focusNodes[index],
                textAlign: TextAlign.center,
                keyboardType: TextInputType.number,
                maxLength: 1,
                style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                decoration: InputDecoration(
                  counterText: "",
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: const BorderSide(color: Color(0xFFD1D9E6)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: const BorderSide(color: Color(0xFF39639C)),
                  ),
                ),
                onChanged: (value) {
                  if (value.isNotEmpty && index < 5) {
                    _focusNodes[index + 1].requestFocus();
                  } else if (value.isEmpty && index > 0) {
                    _focusNodes[index - 1].requestFocus();
                  }
                },
              ),
            );
          }),
        ),
        if (_errorMessage != null) ...[
          const SizedBox(height: 16),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.red[50],
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: Colors.red[200]!),
            ),
            child: Text(
              _errorMessage!,
              style: const TextStyle(color: Colors.red),
              textAlign: TextAlign.center,
            ),
          ),
        ],
        const SizedBox(height: 24),
        SizedBox(
          width: double.infinity,
          height: 50,
          child: ElevatedButton(
            onPressed: _isLoading ? null : _verificarCodigo,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF39639C),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            child: _isLoading 
              ? const CircularProgressIndicator(color: Colors.white)
              : const Text("Confirmar código", style: TextStyle(color: Colors.white, fontSize: 16)),
          ),
        ),
        const SizedBox(height: 16),
        TextButton(
          onPressed: () {
            Navigator.pop(context);
          },
          child: const Text("← Alterar email", style: TextStyle(color: Colors.grey)),
        ),
        const SizedBox(height: 8),
        SizedBox(
          width: double.infinity,
          child: OutlinedButton(
            onPressed: () => Navigator.pop(context),
            style: OutlinedButton.styleFrom(
              side: const BorderSide(color: Color(0xFFD1D9E6)),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            child: const Text("Cancelar", style: TextStyle(color: Colors.grey)),
          ),
        ),
      ],
    );
  }

  Widget _buildStepNovaPassword() {
    return Column(
      children: [
        const Icon(Icons.add_circle_outline, size: 60, color: Color(0xFF39639C)),
        const SizedBox(height: 16),
        const Text("Nova password", style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        const Text(
          "Escolhe uma nova password para a tua conta.",
          style: TextStyle(color: Colors.grey),
        ),
        const SizedBox(height: 24),
        Align(
          alignment: Alignment.centerLeft,
          child: const Text("Nova password", style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold)),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: _passController,
          obscureText: true,
          decoration: InputDecoration(
            hintText: "Mínimo 6 caracteres",
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
          ),
        ),
        const SizedBox(height: 16),
        Align(
          alignment: Alignment.centerLeft,
          child: const Text("Confirmar password", style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold)),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: _confirmPassController,
          obscureText: true,
          decoration: InputDecoration(
            hintText: "Repete a nova password",
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
          ),
        ),
        if (_errorMessage != null) ...[
          const SizedBox(height: 16),
          Text(_errorMessage!, style: const TextStyle(color: Colors.red)),
        ],
        const SizedBox(height: 24),
        SizedBox(
          width: double.infinity,
          height: 50,
          child: ElevatedButton(
            onPressed: _isLoading ? null : _redefinirPassword,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF39639C),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            child: _isLoading 
              ? const CircularProgressIndicator(color: Colors.white)
              : const Text("Guardar password", style: TextStyle(color: Colors.white, fontSize: 16)),
          ),
        ),
        const SizedBox(height: 16),
        SizedBox(
          width: double.infinity,
          child: OutlinedButton(
            onPressed: () => Navigator.pop(context),
            style: OutlinedButton.styleFrom(
              side: const BorderSide(color: Color(0xFFD1D9E6)),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            child: const Text("Cancelar", style: TextStyle(color: Colors.grey)),
          ),
        ),
      ],
    );
  }
}
