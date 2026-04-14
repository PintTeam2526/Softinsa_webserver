var Sequelize = require('sequelize');
var sequelize = require('./database');

var NotificacoesAdmin = sequelize.define('NotificacoesAdmin',
{
    ID_NOTIFICACAOADMIN: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    ID_UTILIZADOR: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    ID_ADMINISTRADOR: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    NOTIFICACAO: {
        type: Sequelize.TEXT,
        allowNull: true
    }
},
{
    tableName: 'NOTIFICACOES_ADMIN',
    timestamps: true, //guardar data e hora de cada alteração na tabela

    indexes: [
        {
            name: 'ENVIA_FK',
            fields: ['ID_UTILIZADOR', 'ID_ADMINISTRADOR']
        }
    ]
});

module.exports = NotificacoesAdmin;