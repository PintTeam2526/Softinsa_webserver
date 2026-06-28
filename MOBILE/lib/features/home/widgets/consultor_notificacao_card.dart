import 'package:flutter/material.dart';

class ConsultorNotificacaoCard extends StatelessWidget {
  final String notificacao;
  final String dataDeEnvio;
  final String remetente;
  final String descricao;

  const ConsultorNotificacaoCard({
    super.key,
    required this.notificacao,
    required this.dataDeEnvio,
    required this.remetente,
    required this.descricao,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.2),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // CABEÇALHO: Ícone e Remetente
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: const Color(0xFFF3F4F6), // Cinza muito claro
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.notifications_none_rounded,
                  color: Color(0xFF6B7280), // Cinza ícone
                  size: 20,
                ),
              ),
              const SizedBox(width: 15),
              Expanded(
                child: Text(
                  remetente,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: Colors.black,
                  ),
                ),
              ),
            ],
          ),
          
          const SizedBox(height: 15),

          // TÍTULO DA NOTIFICAÇÃO (OPCIONAL/SEGUNDO PLANO)
          if (notificacao.isNotEmpty && notificacao != remetente)
            Padding(
              padding: const EdgeInsets.only(bottom: 8.0),
              child: Text(
                notificacao,
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF374151),
                ),
              ),
            ),

          // DESCRIÇÃO
          Text(
            descricao,
            style: const TextStyle(
              fontSize: 15,
              color: Color(0xFF4B5563),
              height: 1.5, // Espaçamento entre linhas
            ),
          ),

          const SizedBox(height: 20),
          
          // LINHA DIVISORA
          Divider(
            color: Colors.grey.withValues(alpha: 0.2),
            thickness: 1,
          ),
          
          const SizedBox(height: 10),

          // RODAPÉ: Data de envio
          Row(
            children: [
              const Icon(
                Icons.access_time_rounded,
                size: 16,
                color: Color(0xFF6B7280),
              ),
              const SizedBox(width: 8),
              Text(
                'Emitida em: $dataDeEnvio',
                style: const TextStyle(
                  fontSize: 13,
                  color: Color(0xFF6B7280),
                  fontWeight: FontWeight.w400,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
