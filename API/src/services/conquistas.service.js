const ConquistasConsultores = require('../models/ConquistasConsultores.models');
const Conquistas = require('../models/Conquistas.models');
const Consultores = require('../models/Consultores.models');
const BadgesConcluidos = require('../models/BadgesConcluidos.models');

const service = {};

service.criarConquista = async (id_consultor, id_conquista) => {
    await ConquistasConsultores.create({
        id_consultor,
        id_conquista,
        progresso: 0,
    });
};

service.findByIdConsultor = async (id_consultor) => {
    const todasConquistas = await Conquistas.findAll();

    const progressoConsultor = await ConquistasConsultores.findAll({
        where: { id_consultor }
    });

    const progressoMap = {};
    progressoConsultor.forEach((cc) => {
        progressoMap[cc.id_conquista] = cc.progresso;
    });

    return todasConquistas.map((conquista) => ({
        id_conquista_consultor: null,
        id_consultor,
        id_conquista: conquista.id_conquista,
        progresso: progressoMap[conquista.id_conquista] ?? 0,
        Conquista: conquista,
    }));
};

module.exports = service;