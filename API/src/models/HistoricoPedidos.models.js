var Sequelize = require('sequelize');
var sequelize = require('../../database');
var PedidoBadge = require('./PedidosBadges.models');
var Utilizador = require('./Utilizadores.models');
var Estado = require('./Estados.models');

var HistoricoPedidos = sequelize.define('HistoricoPedidos',
{
    id_historico: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_estado: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Estado,
            key: 'id_estado'
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
    data: {
        type: Sequelize.DATE,
        allowNull: false
    },
    estado_objetivo: {
        type: Sequelize.TEXT,
        allowNull: false
    }
},
{
    timestamps: false
});

HistoricoPedidos.belongsTo(PedidoBadge, { foreignKey: 'id_pedido_badge' });
HistoricoPedidos.belongsTo(Estado, { foreignKey: 'id_estado' });

module.exports = HistoricoPedidos;