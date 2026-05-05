var Sequelize = require('sequelize');
var sequelize = require('../../database');
var Administrador = require('./Administradores.models');

var NotificacoesAdmins = sequelize.define('NotificacoesAdmins',
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

NotificacoesAdmins.belongsTo(Administrador, { foreignKey: 'id_administrador' });

module.exports = NotificacoesAdmins;