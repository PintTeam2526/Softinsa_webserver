const ConquistasConsultores = require('../models/ConquistasConsultores.models');
const Conquistas = require('../models/Conquistas.models');
const BadgesConcluidos = require('../models/BadgesConcluidos.models');
const Consultores = require('../models/Consultores.models');

const service = {};

service.criarConquista = async (id_consultor, id_conquista) => {
    await ConquistasConsultores.create({
        id_consultor,
        id_conquista,
    });
};

service.findByIdConsultor = async (id_consultor) => {
    const [conquistas, total_badges, consultor] = await Promise.all([
        Conquistas.findAll(),
        BadgesConcluidos.count({ where: { id_consultor } }),
        Consultores.findByPk(id_consultor, { attributes: ['total_pontos'] }),
    ]);

    return {
        total_badges,
        total_pontos: consultor?.total_pontos ?? 0,
        conquistas,
    };
};

module.exports = service;