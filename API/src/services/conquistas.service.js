const Conquistas = require('../models/Conquistas.models');
const ConquistasConsultores = require('../models/ConquistasConsultores.models');
const BadgesConcluidos = require('../models/BadgesConcluidos.models');
const { Op } = require('sequelize');

async function verificarConquistasBadges(idConsultor) {
    const Consultores = require('../models/Consultores.models');
    
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

            // Usar .save() em vez de .increment() para disparar o afterUpdate
            const consultor = await Consultores.findByPk(idConsultor);
            consultor.total_pontos = (consultor.total_pontos || 0) + conquista.pontos_conquista;
            await consultor.save();
        }
    }
}

async function verificarConquistasPontos(idConsultor) {
    const Consultores = require('../models/Consultores.models');

    const consultor = await Consultores.findByPk(idConsultor, {
        attributes: ['id_consultor', 'total_pontos']
    });

    if (!consultor) return;

    const conquistasPossiveis = await Conquistas.findAll({
        where: {
            tipo_conquista: 'pontos',
            valor_conquista: { [Op.lte]: consultor.total_pontos }
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

            consultor.total_pontos = (consultor.total_pontos || 0) + conquista.pontos_conquista;
            await consultor.save();
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