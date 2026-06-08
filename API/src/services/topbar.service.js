const Utilizadores = require('../models/Utilizadores.models');
const Consultores = require('../models/Consultores.models');

const service = {};

// obter dados da topbar
service.getDadosTopbar = async (id_utilizador) => {

    const utilizador = await Utilizadores.findByPk(id_utilizador);

    if (!utilizador) {
        throw new Error('Utilizador não encontrado');
    }

    var cargo = '';
    switch (utilizador.tipo_utilizador) {
        case 'a':
            cargo = 'Administrador';
            break;
        case 's':
            cargo = 'Service Line Leader';
            break;
        case 't':
            cargo = 'Talent Manager';
            break;
        case 'c':
            cargo = 'Consultor'
    }

    const resultado = {
        nome_utilizador: utilizador.nome_utilizador,
        imagem_utilizador: utilizador.imagem_utilizador,
        cargo: cargo
    };

    // se for consultor devolver também os pontos
    if (utilizador.tipo_utilizador === 'c') {
        const consultor = await Consultores.findOne({
            where: {
                id_utilizador: id_utilizador
            }
        });
        resultado.total_pontos = consultor?.total_pontos || 0;
    }

    return resultado;
};

module.exports = service;