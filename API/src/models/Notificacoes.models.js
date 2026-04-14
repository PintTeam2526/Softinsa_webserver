var Sequelize = require('sequelize');
var sequelize = require('./database');

var Notificacoes = sequelize.define('Notificacoes',
{
    ID_NOTIFICACAO: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    ID_UTILIZADOR: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    MENSAGEM: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    DATA_ENVIO: {
        type: Sequelize.DATE,
        allowNull: false
    },
    LIDA: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
},
{
    timestamps: true //guardar data e hora de cada alteração na tabela
});

module.exports = Notificacoes;