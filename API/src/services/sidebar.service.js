
const Consultores = require('../models/Consultores.models');
const Badges = require('../models/Badges.models');
const Areas = require('../models/Areas.models');

const service = {};

//obter a área do consultor e todos os badges dessa área
service.getAreaEBadges = async (id_consultor) => {

    const consultor = await Consultores.findByPk(id_consultor);

    if (!consultor) {
        throw new Error('Consultor não encontrado');
    }

    const area = await Areas.findByPk(consultor.id_area);

    if (!area) {
        throw new Error('Área não encontrada');
    }

    const badges = await Badges.findAll({
        where: {
            id_area: area.id_area
        }
    });

    return {
        nome_area: area.nome_area,

        badges: badges.map(badge => ({
            id: badge.id_badge,
            nome_badge: badge.nome_badge
        }))
    };
};

module.exports = service;