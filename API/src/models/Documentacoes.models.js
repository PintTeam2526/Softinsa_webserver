var Sequelize = require('sequelize');
var sequelize = require('../../database');
var Consultor = require('./Consultores.models');
var PedidoBadge = require('./PedidosBadges.models');

var Documentacoes = sequelize.define('Documentacoes',
{
    id_documentacao: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_pedido_badge: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: PedidoBadge,
            key: 'id_pedido_badge'
        },
    },
    id_consultor: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Consultor,
            key: 'id_consultor'
        },
    },
    documentacao: {
        type: Sequelize.STRING(254),
        allowNull: false
    },
    validado: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    }
},
{
    timestamps: false
});

Documentacoes.belongsTo(Consultor);
Documentacoes.belongsTo(PedidoBadge);

module.exports = Documentacoes;