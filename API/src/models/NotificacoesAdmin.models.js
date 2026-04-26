var Sequelize = require('sequelize');
var sequelize = require('../../database');
var Administrador = require('./Administradores.models');

var NotificacoesAdmin = sequelize.define('NotificacoesAdmin',
{
    id_notificacao_admin: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_administrador: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Administrador,
            key: 'id_administrador'
        },
    },
    notificacao: {
        type: Sequelize.TEXT,
        allowNull: true
    }
},
{
    timestamps: false
});

NotificacoesAdmin.belongsTo(Administrador);

module.exports = NotificacoesAdmin;