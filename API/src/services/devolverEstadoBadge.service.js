const Badges = require('../models/Badges.models');
const BadgesConcluidos = require('../models/BadgesConcluidos.models');
const PedidosBadges = require('../models/PedidosBadges.models');

async function devolverEstadoBadge(id_badge, id_consultor) {
    
    // Buscar badge
    const badge = await Badges.findByPk(id_badge);
    if (!badge) {
        throw new Error('Badge não encontrado');
    }

    // Verificar badge concluído
    const badgeConcluido = await BadgesConcluidos.findOne({
            where: {
                id_badge,
                id_consultor
            }
        });

    // CONCLUIDO / EXPIRADO
    if (badgeConcluido) {

        // Se não tiver validade
        if (badge.validade == null) {
            return 'Concluido';
        }

        const hoje = new Date();
        const dataConclusao = new Date(badgeConcluido.data_conclusao_badge);
        const diferencaDias = Math.floor((hoje - dataConclusao) / (1000 * 60 * 60 * 24));

        // Ainda válido
        if (diferencaDias <= badge.validade) {
            return 'Concluido';
        }

        // Expirado
        return 'Expirado';
    }

    // Verificar pedidos existentes
    const pedido = await PedidosBadges.findOne({
            where: {
                id_consultor,
                id_badge
            }
        });

    // Em análise
    if ( pedido && [1, 2].includes(pedido.estado_atual)) {
        return 'Em análise';
    }

    // Por obter
    if (pedido &&[3, 5, 6].includes(pedido.estado_atual)) {
        return 'Por Obter';
    }

    // Concluido
    if (pedido && pedido.estado_atual === 4) {
        return 'Concluido';
    }

    return 'Erro no script!';
}

module.exports = {devolverEstadoBadge};