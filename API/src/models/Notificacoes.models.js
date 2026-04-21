var Sequelize = require('sequelize');
var sequelize = require('../database');

var Notificacoes = sequelize.define('Notificacoes',
{
    id_notificacao: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    id_utilizador: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    mensagem: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    cata_envio: {
        type: Sequelize.DATE,
        allowNull: false
    },
    lida: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
},
{
    timestamps: true //guardar data e hora de cada alteração na tabela
});

module.exports = Notificacoes;