const { Op } = require('sequelize');
const ServiceLineLiders = require('../models/ServiceLineLiders.models');
const ServiceLines = require('../models/ServiceLines.models');
const Utilizadores = require('../models/Utilizadores.models');
const PedidosBadges = require('../models/PedidosBadges.models');
const Badges = require('../models/Badges.models');
const Consultores = require('../models/Consultores.models');
const HistoricoPedidos = require('../models/HistoricoPedidos.models');
const Areas = require('../models/Areas.models');
const BadgesConcluidos = require('../models/BadgesConcluidos.models');

const service = {};

// obter nome do service line lider
service.getNomeServiceLineLider = async (id_service_line_lider) => {
    const sll = await ServiceLineLiders.findByPk(id_service_line_lider);
    const utilizador = await Utilizadores.findByPk(sll.id_utilizador);
    return utilizador.nome_utilizador;
};

// obter nome da service line
service.getServiceLine = async (id_service_line_lider) => {
    const sll = await ServiceLineLiders.findByPk(id_service_line_lider);
    const serviceLine = await ServiceLines.findByPk(sll.id_service_line);
    return serviceLine.nome_service_line;
};

//obter os 3 pedidos com menor tempo restante de resposta
service.getProximosPedidosExpirar = async (id_service_line_lider) => {
    //obter pedidos
    const pedidos = await PedidosBadges.findAll({
        where: {
            id_service_line_lider,
            estado_atual: 2
        },
        include: [
            {
                model: Badges,
                attributes: [
                    'nome_badge',
                    'nivel_badge',
                    'sla',
                    'imagem_badge'
                ]
            },
            {
                model: Consultores,
                include: [{
                    model: Utilizadores,
                    attributes: ['nome_utilizador']
                }]
            }
        ]
    });

    //calcular urgência
    const pedidosFormatados = [];
    for (const pedido of pedidos) {
        // buscar histórico da submissão
        const historico = await HistoricoPedidos.findOne({
            where: {
                id_pedido_badge: pedido.id_pedido_badge,
                id_estado: 2
            },
            order: [['data', 'ASC']]
        });
        // se não existir histórico
        if (!historico) {continue;}

        // calcular dias restantes
        const dataSubmissao = new Date(historico.data);
        const hoje = new Date();
        const diasPassados = Math.floor((hoje - dataSubmissao) / (1000 * 60 * 60 * 24));
        const sla = pedido.Badge.sla;
        const diasRestantes = sla - diasPassados;

        pedidosFormatados.push({
            nome_badge: pedido.Badge.nome_badge,
            nivel_badge: pedido.Badge.nivel_badge,
            //temos que usar Consultore e Utilizadore porque são nomes criados automaticamente pelo sequelize
            nome_consultor: pedido.Consultore.Utilizadore.nome_utilizador,
            tempo_resposta_dias: diasRestantes,
            imagem_badge: pedido.Badge.imagem_badge
        });
    }

    // ordenar o array pedidosFormatados por ordem de urgência
    pedidosFormatados.sort((a, b) => a.tempo_resposta_dias - b.tempo_resposta_dias);

    // devolver apenas os 3 primeiros
    return pedidosFormatados.slice(0, 3);
};

// calcular percentagem de pedidos aprovados, rejeitados e pendentes
service.getPercentagemEstados = async (id_service_line_lider) => {
    const sll = await ServiceLineLiders.findByPk(id_service_line_lider);
    const total = await PedidosBadges.count({
        where: {
            id_service_line_lider
        }
    });
    if (total === 0) {
        return {
            aprovados: 0,
            rejeitados: 0,
            pendentes: 0
        };
    }
    const aprovados = await PedidosBadges.count({
         where: {
            id_service_line_lider,
            estado_atual: 4
        }
    });
    const rejeitados = await PedidosBadges.count({
        where: {
            id_service_line_lider,
            estado_atual: 5
        }
    });
    const pendentes = await PedidosBadges.count({
        where: {
            id_service_line_lider,
            estado_atual: {[Op.in]: [1, 2, 3, 6]}
            }
        });

    //devolver o valor convertido em percentagem
    return {
        aprovados: (aprovados / total) * 100,
        rejeitados: (rejeitados / total) * 100,
        pendentes: (pendentes / total) * 100
    };
};

// obter o top 3 de consultores com mais badges
service.getTopConsultores = async (id_service_line_lider) => {
    const sll = await ServiceLineLiders.findByPk(id_service_line_lider);
    const areas = await Areas.findAll({
        where: {
            id_service_line: sll.id_service_line
        } 
    });
    const idsAreas = areas.map(area => area.id_area);
    const consultores = await Consultores.findAll({
        where: {
            id_area: {
                [Op.in]: idsAreas
            }
        },
        include: [{
            model: Utilizadores,
            attributes: ['nome_utilizador']
        }]
    });
    const resultado = [];
    for (const consultor of consultores) {
        const totalBadges = await BadgesConcluidos.count({
            where: {
                id_consultor: consultor.id_consultor
            }
        });

        resultado.push({
            id_consultor: consultor.id_consultor,
            nome_consultor: consultor.Utilizadore.nome_utilizador,
            total_badges: totalBadges
        });
    }

    // ordenar por número decrescente de badges obtidos
    resultado.sort((a, b) => b.total_badges - a.total_badges);

    // devolver apenas os 3 melhores
    return resultado.slice(0, 3);
};

// obter o total de consultores da service line 
service.getTotalConsultores = async (id_service_line_lider) => {
    const sll = await ServiceLineLiders.findByPk(id_service_line_lider);
    const areas = await Areas.findAll({
        where: {
            id_service_line: sll.id_service_line
        }
    });
    const idsAreas = areas.map(area => area.id_area);

    return await Consultores.count({
        where: {
            id_area: {[Op.in]: idsAreas}
        }
    });
};

// obter o total de badges conquistados na service line
service.getTotalBadges = async (id_service_line_lider) => {
    const sll = await ServiceLineLiders.findByPk(id_service_line_lider);
    const areas = await Areas.findAll({
        where: {
            id_service_line: sll.id_service_line
        }
    });
    const idsAreas = areas.map(area => area.id_area);
    const badges = await Badges.findAll({
        where: {
            id_area: {[Op.in]: idsAreas}
        }
    });
    const idsBadges = badges.map(badge => badge.id_badge);

    return await BadgesConcluidos.count({
        where: {
            id_badge: {[Op.in]:idsBadges}
        }
    });
};

module.exports = service;