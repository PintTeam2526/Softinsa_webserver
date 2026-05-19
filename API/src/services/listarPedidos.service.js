const PedidosBadges = require('../models/PedidosBadges.models');
const Consultor = require('../models/Consultores.models');
const Utilizador = require('../models/Utilizadores.models');
const TalentManager = require('../models/TalentManagers.models');
const ServiceLineLider = require('../models/ServiceLineLiders.models');
const Badge = require('../models/Badges.models');
const Estado = require('../models/Estados.models');

const { devolverEstadoBadge } = require('./devolverEstadoBadge.service');

async function listarPedidosPorCargo(cargo, id_utilizador = null) {

    let whereClause = {};

    switch (cargo) {

        case 'consultor':
            whereClause.id_consultor = id_utilizador;
            break;

        case 'talent_manager':
            whereClause.id_talent_manager = id_utilizador;
            break;

        case 'service_line_lider':
            whereClause.id_service_line_lider = id_utilizador;
            break;

        case 'admin':
            // admin vê tudo
            break;

        default:
            throw new Error('Cargo inválido');
    }

    const pedidos = await PedidosBadges.findAll({
        where: whereClause,

        include: [
            {
                model: Consultor,
                attributes: ['id_consultor'],
                include: [{ model: Utilizador, attributes: ['nome_utilizador'] }]
            },
            {
                model: TalentManager,
                attributes: ['id_talent_manager'],
                include: [{ model: Utilizador, attributes: ['nome_utilizador'] }]
            },
            {
                model: ServiceLineLider,
                attributes: ['id_service_line_lider'],
                include: [{ model: Utilizador, attributes: ['nome_utilizador'] }]
            },
            {
                model: Badge,
                attributes: ['id_badge', 'nome_badge']
            },
            {
                model: Estado,
                attributes: ['id_estado', 'descricao_estado']
            }
        ]
    });

    // adicionar estado calculado
    const pedidosComEstado = await Promise.all(
        pedidos.map(async (pedido) => {

            const estadoBadge = await devolverEstadoBadge(
                pedido.id_badge,
                pedido.id_consultor
            );

            return {
                ...pedido.toJSON(),
                estado_badge: estadoBadge
            };
        })
    );

    return pedidosComEstado;
}

module.exports = { listarPedidosPorCargo };