var Sequelize = require('sequelize');
var sequelize = require('../../database');
var Utilizador = require('./Utilizadores.models');
var NotificacaoAdmin = require('./NotificacoesAdmin.models');

var Enviadas = sequelize.define('Enviadas',
{
    id_notificacaoadmin: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: NotificacaoAdmin,
            key: 'id_notificacao_admin'
        },
    },
    id_utilizador: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: Utilizador,
            key: 'id_utilizador'
        },
    }
},
{
    timestamps: false
});

Enviadas.belongsTo(Utilizador);
Enviadas.belongsTo(NotificacaoAdmin);

module.exports = Enviadas;