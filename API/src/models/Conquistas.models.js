var Sequelize = require('sequelize');
var sequelize = require('../../database');

var Conquistas = sequelize.define('Conquistas',
{
    id_conquista: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    descricao_conquista: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    pontos_conquista: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    imagem_conquista: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    estado_a_i: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    data_insercao: {
        type: Sequelize.DATE,
        allowNull: false
    },
},


{
    timestamps: false
});


module.exports = Conquistas;

