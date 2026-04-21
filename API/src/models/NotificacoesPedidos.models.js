var Sequelize = require('sequelize');
var sequelize = require('../database');

var NotificacoesPedidos = sequelize.define('NotificacoesPedidos',
{
    id_notificacaopedidos: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    id_utilizador: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    id_consultor: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    id_pedido_badge: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    justificacao: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    data_envio_notificacao: {
        type: Sequelize.DATE,
        allowNull: false
    }
},
{
    tableName: 'Notificacoes_Pedidos',
    timestamps: true, //guardar data e hora de cada alteração na tabela

    indexes: [
        {
            name: 'REFERENTE_FK',
            fields: ['id_pedido_badge']
        },
        {
            name: 'PERTENCE_FK',
            fields: ['id_utilizador', 'id_consultor']
        }
    ]
});

module.exports = NotificacoesPedidos;