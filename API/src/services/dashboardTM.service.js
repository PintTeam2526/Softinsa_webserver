const { Op } = require('sequelize');
const TalentManagers = require('../models/TalentManagers.models');
const Utilizadores = require('../models/Utilizadores.models');
const PedidosBadges = require('../models/PedidosBadges.models');
const Badges = require('../models/Badges.models');
const Consultores = require('../models/Consultores.models');
const HistoricoPedidos = require('../models/HistoricoPedidos.models');
const BadgesConcluidos = require('../models/BadgesConcluidos.models');

const service = {};

//obter nome do talent manager
service.getNomeTalentManager = async (id_talent_manager) => {

    const tm = await TalentManagers.findByPk(id_talent_manager);
    const utilizador = await Utilizadores.findByPk(tm.id_utilizador);
    return utilizador.nome_utilizador;
};

//obter os 3 pedidos com menor tempo restante de resposta
service.getProximosPedidosExpirar = async (id_talent_manager) => {
    //obter pedidos
    const pedidos = await PedidosBadges.findAll({
        where: {
            id_talent_manager,
            estado_atual: 1
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
    // calcular urgência
    const pedidosFormatados = [];
    for (const pedido of pedidos) {
        // buscar histórico da submissão
        const historico = await HistoricoPedidos.findOne({
            where: {
                id_pedido_badge: pedido.id_pedido_badge,
                id_estado: 1
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

//obter os 5 badges conquistados mais próximos da data de expiração
service.getProximosBadgesExpirar = async () => {

    const badges = await BadgesConcluidos.findAll({
        include: [
            {
                model: Badges,
                attributes: [
                    'nome_badge',
                    'nivel_badge',
                    'validade',
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

    const hoje = new Date();
    const badgesFormatados = [];

    for (const badge of badges) {

        // ignorar badges sem validade
        if (badge.Badge.validade == null || badge.Badge.validade == 0) {continue;}
        // obter data de expiração
        const dataConclusao = new Date(badge.data_conclusao_badge);
        const dataExpiracao = new Date(dataConclusao);
        dataExpiracao.setDate(dataExpiracao.getDate() + badge.Badge.validade);
        // calcular dias restantes até expirar
        const diasRestantes = Math.floor((dataExpiracao - hoje) /(1000 * 60 * 60 * 24));
        // ignorar badges já expirados
        if (diasRestantes < 0) {continue;}

        badgesFormatados.push({
            nome_badge: badge.Badge.nome_badge,
            nivel_badge: badge.Badge.nivel_badge,
            //temos que usar Consultore e Utilizadore porque são nomes criados automaticamente pelo sequelize
            id_consultor: badge.Consultore.id_consultor,
            nome_consultor: badge.Consultore.Utilizadore.nome_utilizador,
            dias_para_expirar: diasRestantes,
            imagem_badge: badge.Badge.imagem_badge
        });
    }

    // ordenar o array badgesFormatados por ordem de expiração
    badgesFormatados.sort((a, b) => new Date(a.dias_para_expirar) - new Date(b.dias_para_expirar));

    // devolver apenas os 5 primeiros
    return badgesFormatados.slice(0, 5);
};


module.exports = service;
