import 'package:flutter/material.dart';

class ConsultorObjetivosCard extends StatefulWidget {
  final String nomeBadge;
  final String dataLimiteObjetivo;
  final VoidCallback onTap;
  final DateTime dataExpiracao;
  final DateTime? dataConclusao;

  const ConsultorObjetivosCard({
    super.key,
    required this.nomeBadge,
    required this.dataLimiteObjetivo,
    required this.onTap,
    required this.dataExpiracao,
    this.dataConclusao,
  });

  @override
  State<ConsultorObjetivosCard> createState() => _ConsultorObjetivosCardState();
}

class _ConsultorObjetivosCardState extends State<ConsultorObjetivosCard> {
  late DateTime dataAtual;
  late Color corBotao;
  late Color corTexto;
  late String textoBotao;

  @override
  void initState() {
    super.initState();
    _calcularEstado();
  }

  void _calcularEstado() {
    dataAtual = DateTime(DateTime.now().year, DateTime.now().month, DateTime.now().day);

    if (widget.dataConclusao != null) { //SE A DATA DE CONCLUSAO FOR DIFERENTE DE NULL JA ESTA CONCLUIDO
      corBotao = const Color(0xFFE8F5E9); // Verde claro
      corTexto = const Color(0xFF2E7D32); // Verde escuro
      textoBotao = 'Concluído';
    } else if (widget.dataExpiracao.isAfter(dataAtual) || widget.dataExpiracao.isAtSameMomentAs(dataAtual)) {
      corBotao = const Color(0xFFFFF8E1); // Amarelo claro
      corTexto = const Color(0xFFF57F17); // Amarelo escuro
      textoBotao = 'Por Concluir';
    } else {
      corBotao = const Color(0xFFFFEBEE); // Vermelho claro
      corTexto = const Color(0xFFC62828); // Vermelho escuro
      textoBotao = 'Expirado';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            'Concluir o Badge:\n"${widget.nomeBadge}"',
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: Color(0xFF1A1C1E),
              height: 1.2,
            ),
          ),
          const SizedBox(height: 10),
          Text(
            'Data Expiração: ${widget.dataLimiteObjetivo}',
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[700],
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 12),
          Align(
            alignment: Alignment.bottomRight,
            child: InkWell(
              onTap: widget.onTap,
              borderRadius: BorderRadius.circular(30),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                decoration: BoxDecoration(
                  color: corBotao,
                  borderRadius: BorderRadius.circular(30),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      textoBotao,
                      style: TextStyle(
                        color: corTexto,
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      '->',
                      style: TextStyle(
                        color: corTexto,
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}