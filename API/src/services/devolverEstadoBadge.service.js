const Badges = require('../models/Badges.models');
const BadgesConcluidos = require('../models/BadgesConcluidos.models');
const PedidosBadges = require('../models/PedidosBadges.models');

async function devolverEstadoBadge(id_badge, id_consultor) {
    
    // Buscar badge para verificar validade
    const badge = await Badges.findByPk(id_badge);
    if (!badge) {
        throw new Error('Badge não encontrado');
    }

    // 1 & 2. Verificar se o badge está concluído ou expirado
    const badgeConcluido = await BadgesConcluidos.findOne({
            where: {
                id_badge,
                id_consultor
            }
        });

    if (badgeConcluido) {
        // Se não tiver validade definida, está concluído
        if (badge.validade == null) {
            return 'Concluido';
        }

        const hoje = new Date();
        const dataConclusao = new Date(badgeConcluido.data_conclusao_badge);
        const diferencaDias = Math.floor((hoje - dataConclusao) / (1000 * 60 * 60 * 24));

        // Verifica se ainda está dentro da validade
        if (diferencaDias <= badge.validade) {
            return 'Concluido';
        }

        // Caso contrário, está expirado
        return 'Expirado';
    }

    // 3 & 4. Verificar se existem pedidos (Em análise ou Rejeitado)
    const pedido = await PedidosBadges.findOne({
            where: {
                id_consultor,
                id_badge
            }
        });

    if (pedido) {
        // Estado 1 ou 2: Em análise
        if ([1, 2].includes(pedido.estado_atual)) {
            return 'Em análise';
        }

        // Estado 3, 5 ou 6: Rejeitado (ou Cancelado/Reprovado conforme o SQL)
        if ([3, 5, 6].includes(pedido.estado_atual)) {
            return 'Rejeitado';
        }

        // Estado 4: Concluido (redundância de segurança)
        if (pedido.estado_atual === 4) {
            return 'Concluido';
        }
    }

    // 5. Caso não exista registo ou não se enquadre nas anteriores (Equivalente ao DECLARE @estadoBadge = 'Por Obter')
    return 'Por Obter';
}

module.exports = {devolverEstadoBadge};