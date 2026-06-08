const { where } = require("sequelize");
const Consultores = require("../models/Consultores.models");
const Objetivos = require("../models/Objetivos.models");
const Utilizadores = require("../models/Utilizadores.models");
const Areas = require("../models/Areas.models");
const ServiceLines = require("../models/ServiceLines.models");
const LearningPaths = require("../models/LearningPaths.models");
const Badges = require("../models/Badges.models");
const BadgesConcluidos = require("../models/BadgesConcluidos.models");
const PedidosBadges = require('../models/PedidosBadges.models');
const Estados = require('../models/Estados.models');

const service = {};

//obter nome e pontos do consultor através do seu id
service.getDadosConsultor = async(id_consultor) => {
    const consultor = await Consultores.findByPk(id_consultor, {
        attributes: ['id_utilizador', 'total_pontos']
    });

    const nome = await Utilizadores.findByPk(consultor.id_utilizador, {
        attributes : ['nome_utilizador']
    });

    return {
        nome_consultor: nome.nome_utilizador,
        pontos_consultor: consultor.total_pontos
    }
}

//obter o número de dias até expirar o objetivo mais próximo
service.getObjetivoMaisProximo = async(id_consultor) => {
    const objetivo = await Objetivos.findOne({
        where : {
            id_consultor : id_consultor
        }, 
        order: [['data_limite_conclusao', 'ASC']]
    });

    const hoje = new Date();
    const dataLimiteObjetivo = new Date(objetivo.data_limite_conclusao);

    return Math.ceil((dataLimiteObjetivo - hoje) / (1000 * 60 * 60 * 24));
}

//obter a percentagem de badges conquistados em relação ao total de badges da área
service.getProgressoArea = async(id_consultor) => {

    const consultor = await Consultores.findByPk(id_consultor);
    const area = await Areas.findByPk(consultor.id_area);
    const totalBadges = await Badges.count({
        where: {
            id_area: area.id_area
        }
    });

    const badgesConsultor = await BadgesConcluidos.count({
        where: {
            id_consultor: id_consultor
        },
        include: [{
            model: Badges,
            where: {
                id_area: area.id_area
            }
        }]
    });

    if (totalBadges === 0) {return 0 } //evitar divisão por zero
    return (badgesConsultor / totalBadges) * 100
}

//obter a percentagem de badges conquistados em relação ao total de badges da service line
service.getProgressoServiceLine = async(id_consultor) => {

    const consultor = await Consultores.findByPk(id_consultor);
    const area = await Areas.findByPk(consultor.id_area);
    const serviceLine = area.id_service_line;
    const totalBadges = await Badges.count({
         include: [{
            model: Areas,
            where: {
                id_service_line: serviceLine
            }
         }]
    });

    const badgesConsultor = await BadgesConcluidos.count({
        where: {
            id_consultor
        },
        include: [{
            model: Badges,
            include: [{
                model: Areas,
                where: {
                    id_service_line: serviceLine
                }
            }]
        }]
    });


    if (totalBadges === 0) {return 0 } //evitar divisão por zero
    return (badgesConsultor / totalBadges) * 100
}

//obter a percentagem de badges conquistados em relação ao total de badges do learning path
service.getProgressoLearningPath = async(id_consultor) => {

    const consultor = await Consultores.findByPk(id_consultor);
    const area = await Areas.findByPk(consultor.id_area);
    const serviceLine = await ServiceLines.findByPk(area.id_service_line);
    const learningPath = serviceLine.id_learning_path;
    const totalBadges = await Badges.count({
        include: [{
            model: Areas,
            include: [{
                model: ServiceLines,
                where: {
                    id_learning_path: learningPath
                }
            }]
        }]
    });

    const badgesConsultor = await BadgesConcluidos.count({
        where: {
            id_consultor
        },
        include: [{
            model: Badges,
            include: [{
                model: Areas,
                include: [{
                    model: ServiceLines,
                    where: {
                        id_learning_path: learningPath
                    }
                }]
            }]
        }]
    });

    if (totalBadges === 0) {return 0 } //evitar divisão por zero
    return (badgesConsultor / totalBadges) * 100
}

//obter os badges do consultor e o seu estado
service.getPedidosConsultor = async(id_consultor) => {

    const pedidos = await PedidosBadges.findAll({
            where: {
                id_consultor
            },
            include: [
                {
                    model: Badges,
                    attributes: [
                        'nome_badge',
                        'imagem_badge'
                    ]
                },
                {
                    model: Estados,
                    attributes: ['nome_estado'],
                    foreignKey: 'estado_atual'
                }
            ]
        });

    return pedidos.map(pedido => ({

        id_pedido_badge: pedido.id_pedido_badge,
        nome_badge: pedido.Badge.nome_badge,
        imagem_badge: pedido.Badge.imagem_badge,
        estado_atual: pedido.Estado.nome_estado
    }));
};

module.exports = service;