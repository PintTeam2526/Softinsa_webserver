const Conquistas = require('../models/Conquistas.models');
const ConquistasConsultores = require('../models/ConquistasConsultores.models');
const BadgesConcluidos = require('../models/BadgesConcluidos.models');
const { Op } = require('sequelize');

async function verificarConquistasBadges(idConsultor) {
    const totalBadges = await BadgesConcluidos.count({
        where: { id_consultor: idConsultor }
    });

    const conquistasPossiveis = await Conquistas.findAll({
        where: {
            tipo_conquista: 'badges',
            valor_conquista: { [Op.lte]: totalBadges }
        }
    });

    for (const conquista of conquistasPossiveis) {
        const jatem = await ConquistasConsultores.findOne({
            where: { id_consultor: idConsultor, id_conquista: conquista.id_conquista }
        });

        if (!jatem) {
            await ConquistasConsultores.create({
                id_consultor: idConsultor,
                id_conquista: conquista.id_conquista
            });

            // Atribuir pontos da conquista ao consultor
            const Consultores = require('../models/Consultores.models');
            await Consultores.increment('total_pontos', {
                by: conquista.pontos_conquista,
                where: { id_consultor: idConsultor }
            });
        }
    }
}

async function verificarConquistasPontos(idConsultor, totalPontos) {
    const conquistasPossiveis = await Conquistas.findAll({
        where: {
            tipo_conquista: 'pontos',
            valor_conquista: { [Op.lte]: totalPontos }
        }
    });

    for (const conquista of conquistasPossiveis) {
        const jatem = await ConquistasConsultores.findOne({
            where: { id_consultor: idConsultor, id_conquista: conquista.id_conquista }
        });

        if (!jatem) {
            await ConquistasConsultores.create({
                id_consultor: idConsultor,
                id_conquista: conquista.id_conquista
            });

            // Atribuir pontos da conquista ao consultor
            const Consultores = require('../models/Consultores.models');
            await Consultores.increment('total_pontos', {
                by: conquista.pontos_conquista,
                where: { id_consultor: idConsultor }
            });
        }
    }
}

async function findByIdConsultor(idConsultor) {
    const todasConquistas = await Conquistas.findAll();

    const conquistasObtidas = await ConquistasConsultores.findAll({
        where: { id_consultor: idConsultor }
    });

    const totalBadges = await BadgesConcluidos.count({
        where: { id_consultor: idConsultor }
    });

    const Consultores = require('../models/Consultores.models');
    const consultor = await Consultores.findByPk(idConsultor, {
        attributes: ['total_pontos']
    });

    const idsObtidos = new Set(conquistasObtidas.map(c => c.id_conquista));

    return {
        total_badges: totalBadges,
        total_pontos: consultor ? consultor.total_pontos : 0,
        conquistas: todasConquistas.map(c => ({
            id_conquista: c.id_conquista,
            descricao_conquista: c.descricao_conquista,
            pontos_conquista: c.pontos_conquista,
            tipo_conquista: c.tipo_conquista,
            valor_conquista: c.valor_conquista,
            estado: idsObtidos.has(c.id_conquista) ? 'Obtido' : 'Por Obter'
        }))
    };
}

module.exports = {
    verificarConquistasBadges,
    verificarConquistasPontos,
    findByIdConsultor
};