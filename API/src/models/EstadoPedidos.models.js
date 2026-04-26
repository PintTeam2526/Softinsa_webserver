var Sequelize = require('sequelize');
var sequelize = require('../../database');
var PedidoBadge = require('./PedidosBadge.models');
var Estado = require('./Estados.models');

var EstadoPedidos = sequelize.define('EstadoPedidos',
{
    id_pedido_badge: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: PedidoBadge,
            key: 'id_pedido_badge'
        },
    },
    id_estado: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: Estado,
            key: 'id_estado'
        },
    }
},


{
    timestamps: false
});

EstadoPedidos.belongsTo(PedidoBadge);
EstadoPedidos.belongsTo(Estado);

module.exports = EstadoPedidos;