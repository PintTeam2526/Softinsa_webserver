var Sequelize = require('sequelize');
var sequelize = require('./database');

var NotificacoesPedidos = sequelize.define('NotificacoesPedidos',
{
    ID_NOTIFICACAOPEDIDOS: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    ID_UTILIZADOR: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    ID_CONSULTOR: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    ID_PEDIDO_BADGE: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    JUSTIFICACAO: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    DATA_ENVIO_NOTIFICACAO: {
        type: Sequelize.DATE,
        allowNull: false
    }
},
{
    tableName: 'NOTIFICACOES_PEDIDOS',
    timestamps: true, //guardar data e hora de cada alteração na tabela

    indexes: [
        {
            name: 'REFERENTE_FK',
            fields: ['ID_PEDIDO_BADGE']
        },
        {
            name: 'PERTENCE_FK',
            fields: ['ID_UTILIZADOR', 'ID_CONSULTOR']
        }
    ]
});

module.exports = NotificacoesPedidos;