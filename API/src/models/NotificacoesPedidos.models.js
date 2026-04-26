var Sequelize = require('sequelize');
var sequelize = require('../../database');
var Consultor = require('./Consultores.models');
var PedidoBadge = require('./PedidosBadge.models');

var NotificacoesPedidos = sequelize.define('NotificacoesPedidos',
{
    id_notificacao_pedido: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_consultor: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Consultor,
            key: 'id_consultor'
        },
    },
    id_pedido_badge: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: PedidoBadge,
            key: 'id_pedido_badge'
        },
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
    timestamps: false
});

NotificacoesPedidos.belongsTo(Consultor);
NotificacoesPedidos.belongsTo(PedidoBadge);

module.exports = NotificacoesPedidos;