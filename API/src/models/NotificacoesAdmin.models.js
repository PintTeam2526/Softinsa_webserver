var Sequelize = require('sequelize');
var sequelize = require('../database');

var NotificacoesAdmin = sequelize.define('NotificacoesAdmin',
{
    id_notificacaoadmin: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    id_utilizador: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    id_administrador: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    notificacao: {
        type: Sequelize.TEXT,
        allowNull: true
    }
},
{
    tableName: 'Notificacoes_Admin',
    timestamps: true, //guardar data e hora de cada alteração na tabela

    indexes: [
        {
            name: 'ENVIA_FK',
            fields: ['id_utilizador', 'id_administrador']
        }
    ]
});

module.exports = NotificacoesAdmin;