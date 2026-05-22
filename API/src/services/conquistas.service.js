const ConquistasConsultores = require('../models/ConquistasConsultores.models');
const Consultores = require('../models/Consultores.models');
const BadgesConcluidos = require('../models/BadgesConcluidos.models');

const service = {};

service.criarConquista = async (id_consultor, id_conquista) => {
    ConquistasConsultores.create({
            id_consultor : id_consultor,
            id_conquista: id_conquista,
            progresso: 0,
        });
}

service.findByIdConsultor = async(id_consultor) => {
    return ConquistasConsultores.findAll({
        where: {
            id_consultor: id_consultor
        }
    })
}

module.exports = service;