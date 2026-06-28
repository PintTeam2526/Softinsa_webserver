import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:pint_26_mobile/features/home/widgets/consultor_requisitos_publico_card.dart';
import 'package:pint_26_mobile/core/models/requisitos_model.dart';

class ModalRequisitos extends StatelessWidget {
  final String nomeBadge;
  final List<RequisitosModel> requisitos;

  const ModalRequisitos({
    super.key,
    required this.nomeBadge,
    required this.requisitos,
  });

  @override
  Widget build(BuildContext context) {
    return Dialog(
      insetPadding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 24.0),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28.0)), // Bordas mais arredondadas (Material 3 style)
      backgroundColor: Colors.white,
      child: Container(
        height: MediaQuery.of(context).size.height * 0.8,
        padding: const EdgeInsets.fromLTRB(20, 10, 10, 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Cabeçalho do Modal
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.only(top: 10),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Requisitos:',
                          style: TextStyle(
                            fontSize: 14,
                            color: Color(0xFF42474E),
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        Text(
                          nomeBadge,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF1A1C1E),
                            height: 1.1,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close, color: Color(0xFF39639C), size: 28),
                  onPressed: () => context.pop(),
                ),
              ],
            ),
            const Divider(height: 25, thickness: 1),

            // Lista de Requisitos com Scroll
            Expanded(
              child: requisitos.isEmpty
                  ? const Center(child: Text("Este badge não possui requisitos listados."))
                  : ListView.builder(
                padding: const EdgeInsets.only(right: 10),
                itemCount: requisitos.length,
                itemBuilder: (context, index) {
                  final req = requisitos[index];
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 15.0),
                    child: RequisitosPublicoCard(
                      tituloRequisito: req.nome,
                      descricao: req.descricao,
                      imagem: req.imagem,
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
