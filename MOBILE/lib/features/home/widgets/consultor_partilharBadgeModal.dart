import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:file_picker/file_picker.dart';
import 'package:gal/gal.dart';
import 'package:path_provider/path_provider.dart';
import 'package:pint_26_mobile/core/app_state.dart';
import 'package:pint_26_mobile/core/repositories/badgesConcluidos_repository.dart';

class ConsultorPartilharBadgeModal extends ConsumerStatefulWidget {
  final int idBadge;

  const ConsultorPartilharBadgeModal({super.key, required this.idBadge});

  static void show(BuildContext context, int idBadge) {
    showDialog(
      context: context,
      builder: (context) => ConsultorPartilharBadgeModal(idBadge: idBadge),
    );
  }

  @override
  ConsumerState<ConsultorPartilharBadgeModal> createState() => _PartilharBadgeModalState();
}

class _PartilharBadgeModalState extends ConsumerState<ConsultorPartilharBadgeModal> {
  int _selectedTabIndex = 0; // 0: Assinatura Email, 1: LinkedIn
  String? _successMessage;
  Timer? _messageTimer;

  void _showNotification(String message) {
    _messageTimer?.cancel();
    setState(() {
      _successMessage = message;
    });
    _messageTimer = Timer(const Duration(seconds: 3), () {
      if (mounted) {
        setState(() {
          _successMessage = null;
        });
      }
    });
  }

  @override
  void dispose() {
    _messageTimer?.cancel();
    super.dispose();
  }

  Uint8List _getImageBytes(String base64String) {
    try {
      if (base64String.isEmpty || base64String == "null") return Uint8List(0);
      String cleanBase64 = base64String.contains(',')
          ? base64String.split(',').last
          : base64String;
      return base64Decode(cleanBase64);
    } catch (e) {
      return Uint8List(0);
    }
  }

  Future<void> _downloadImage(Uint8List bytes, String fileName) async {
    try {
      // Verificar/Pedir permissão de escrita
      bool hasAccess = await Gal.hasAccess();
      if (!hasAccess) {
        await Gal.requestAccess();
      }

      // Criar um ficheiro temporário para o Gal conseguir ler
      final tempDir = await getTemporaryDirectory();
      final tempPath = '${tempDir.path}/$fileName';
      final file = File(tempPath);
      await file.writeAsBytes(bytes);

      // Guardar na Galeria do Android
      await Gal.putImage(tempPath);

      // Limpar o ficheiro temporário
      await file.delete();

      _showNotification("Imagem guardada na Galeria!");
    } catch (e) {
      debugPrint("Erro ao guardar imagem no Android: $e");
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Erro ao guardar imagem: $e")),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final idConsultor = AppState().idConsultor;
    final badgesAsync = ref.watch(badgesConcluidosProvider(idConsultor));

    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      backgroundColor: Colors.white,
      insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
      child: badgesAsync.when(
        loading: () => const SizedBox(
          height: 200,
          child: Center(child: CircularProgressIndicator(color: Color(0xFF39639C))),
        ),
        error: (err, stack) => Padding(
          padding: const EdgeInsets.all(20),
          child: Text("Erro ao carregar badge: $err"),
        ),
        data: (lista) {
          final badge = lista.firstWhere(
                (b) => b.idBadge == widget.idBadge,
            orElse: () => throw Exception("Badge não encontrado"),
          );

          return Padding(
            padding: const EdgeInsets.all(20.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Spacer(),
                    const Text(
                      'Partilhar Badge',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF002D5E),
                      ),
                    ),
                    const Spacer(),
                    IconButton(
                      icon: const Icon(Icons.close, color: Colors.grey),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ],
                ),
                const SizedBox(height: 10),

                // Tabs
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    _buildTabItem("Assinatura Email", 0),
                    Container(
                      height: 20,
                      width: 1,
                      color: Colors.grey.shade300,
                      margin: const EdgeInsets.symmetric(horizontal: 10),
                    ),
                    _buildTabItem("LinkedIn", 1),
                  ],
                ),
                const SizedBox(height: 20),

                // Badge Info Card
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.grey.shade200),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 60,
                        height: 60,
                        decoration: const BoxDecoration(shape: BoxShape.circle),
                        child: ClipOval(
                          child: badge.imagemBadge.isNotEmpty
                              ? Image.memory(_getImageBytes(badge.imagemBadge), fit: BoxFit.cover)
                              : const Icon(Icons.image, size: 30),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              badge.nomeBadge,
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF1A1C1E),
                              ),
                            ),
                            Text(
                              '${badge.nivelBadge} . ${badge.nomeAreaPai}',
                              style: TextStyle(
                                fontSize: 13,
                                color: Colors.grey.shade600,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // Imagem do Badge Section
                const Text(
                  'IMAGEM DO BADGE',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: Colors.grey,
                    letterSpacing: 1.1,
                  ),
                ),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.grey.shade300),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.link, color: Colors.grey, size: 20),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'badge-${badge.nomeBadge.toLowerCase().replaceAll(' ', '-')}.png',
                          style: const TextStyle(color: Colors.grey, fontSize: 14),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      OutlinedButton.icon(
                        onPressed: () async {
                          final bytes = _getImageBytes(badge.imagemBadge);
                          if (bytes.isNotEmpty) {
                            final fileName = 'badge-${badge.nomeBadge.toLowerCase().replaceAll(' ', '-')}.png';
                            await _downloadImage(bytes, fileName);
                          } else {
                            _showNotification("Erro: Imagem não disponível");
                          }
                        },
                        icon: const Icon(Icons.download_rounded, size: 18),
                        label: const Text("Descarregar"),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: const Color(0xFF002D5E),
                          side: const BorderSide(color: Color(0xFF1D4E89)),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // Link Público Section
                const Text(
                  'LINK PÚBLICO',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: Colors.grey,
                    letterSpacing: 1.1,
                  ),
                ),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.grey.shade300),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.link, color: Colors.grey, size: 20),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'https://softinsa-webserver.onrender.com/badges/${badge.idBadge}',
                          style: const TextStyle(color: Colors.grey, fontSize: 14),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      const SizedBox(width: 8),
                      OutlinedButton.icon(
                        onPressed: () {
                          Clipboard.setData(ClipboardData(
                            text: 'https://softinsa-webserver.onrender.com/badges/${badge.idBadge}',
                          ));
                          _showNotification("Link copiado com sucesso!");
                        },
                        icon: const Icon(Icons.copy, size: 18),
                        label: const Text("Copiar"),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: const Color(0xFF002D5E),
                          side: const BorderSide(color: Color(0xFF002D5E)),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                // Notificação de Sucesso (Fundo do Modal)
                if (_successMessage != null)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    decoration: BoxDecoration(
                      color: const Color(0xFFE8F5E9), // Verde claro
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: Colors.green.shade200),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.check_circle, color: Colors.green, size: 20),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            _successMessage!,
                            style: const TextStyle(
                              color: Color(0xFF2E7D32),
                              fontWeight: FontWeight.w500,
                              fontSize: 14,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                const SizedBox(height: 10),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildTabItem(String title, int index) {
    bool isSelected = _selectedTabIndex == index;
    return GestureDetector(
      onTap: () => setState(() => _selectedTabIndex = index),
      child: Text(
        title,
        style: TextStyle(
          fontSize: 18,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          color: isSelected ? const Color(0xFF002D5E) : Colors.grey.shade400,
        ),
      ),
    );
  }
}
