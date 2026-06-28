import 'package:flutter/material.dart';

class ConsultorConquistaRetangulo extends StatelessWidget {
  final int id_conquista;
  final String descricao_conquista;
  final int pontos_conquista;
  final String estado_conquista;
  final double progresso; // Valor de 0.0 a 1.0

  const ConsultorConquistaRetangulo({
    super.key,
    required this.id_conquista,
    required this.descricao_conquista,
    required this.pontos_conquista,
    required this.estado_conquista,
    required this.progresso,
  });

  @override
  Widget build(BuildContext context) {
    bool isConcluida = estado_conquista.toLowerCase() == 'obtido' || 
                      estado_conquista.toLowerCase() == 'concluído' ||
                      estado_conquista.toLowerCase() == 'concluido' ||
                      progresso >= 1.0;

    int percentagem = (progresso * 100).toInt();
    if (percentagem > 100) percentagem = 100;

    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            spreadRadius: 1,
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          // Lado Esquerdo: Ícone ou Imagem
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: isConcluida ? const Color(0xFFE8F5E9) : Colors.grey[200],
              borderRadius: BorderRadius.circular(20),
            ),
            child: Icon(
              isConcluida ? Icons.emoji_events : Icons.lock,
              size: 40,
              color: isConcluida ? Colors.green : Colors.grey[400],
            ),
          ),
          const SizedBox(width: 16),
          // Lado Direito: Info e Progresso
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  descricao_conquista,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    // Círculo de Progresso Dinâmico
                    SizedBox(
                      width: 45,
                      height: 45,
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          CircularProgressIndicator(
                            value: progresso,
                            strokeWidth: 5,
                            backgroundColor: Colors.grey[200],
                            valueColor: AlwaysStoppedAnimation<Color>(
                              isConcluida ? Colors.green : const Color(0xFF2E599A),
                            ),
                          ),
                          Text(
                            '$percentagem%',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: isConcluida ? Colors.green : Colors.grey[700],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 15),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          isConcluida ? 'Concluída!' : 'Em progresso',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: isConcluida ? Colors.green : Colors.grey[600],
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          '+$pontos_conquista Pontos',
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF39639C),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
