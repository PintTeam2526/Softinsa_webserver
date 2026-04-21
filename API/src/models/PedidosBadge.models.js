var Sequelize = require('sequelize');
var sequelize = require('../database');

var PedidosBadge = sequelize.define('PedidosBadge',
{
    id_pedido_badge: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    con_id_utilizador: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    id_consultor: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    tal_id_utilizaddor: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    id_talent_manager: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    id_utilizador: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    id_service_line_lider: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    id_badge: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    consultor: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    badge: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    estado_atual: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
},
{
    tableName: 'Pedidos_Badge',
    timestamps: true, //guardar data e hora de cada alteração na tabela

    indexes: [
        {
            name: 'EFETUA_FK',
            fields: ['con_id_utilizador', 'id_consultor']
        },
        {
            name: 'REFERENTE_2_FK',
            fields: ['id_badge']
        },
        {
            name: 'VALIDA_FK',
            fields: ['tal_id_utilizador', 'id_talent_manager']
        },
        {
            name: 'VALIDA_2_FK',
            fields: ['id_utilizador', 'id_service_line_lider']
        }
    ]
});

module.exports = PedidosBadge;