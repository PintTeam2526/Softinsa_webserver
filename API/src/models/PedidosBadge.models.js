var Sequelize = require('sequelize');
var sequelize = require('./database');

var PedidosBadge = sequelize.define('PedidosBadge',
{
    ID_PEDIDO_BADGE: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    CON_ID_UTILIZADOR: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    ID_CONSULTOR: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    TAL_ID_UTILIZADOR: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    ID_TALENT_MANAGER: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    ID_UTILIZADOR: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    ID_SERVICE_LINE_LIDER: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    ID_BADGE: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    CONSULTOR: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    BADGE: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    ESTADO_ATUAL: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
},
{
    tableName: 'PEDIDOS_BADGE',
    timestamps: true, //guardar data e hora de cada alteração na tabela

    indexes: [
        {
            name: 'EFETUA_FK',
            fields: ['CON_ID_UTILIZADOR', 'ID_CONSULTOR']
        },
        {
            name: 'REFERENTE_2_FK',
            fields: ['ID_BADGE']
        },
        {
            name: 'VALIDA_FK',
            fields: ['TAL_ID_UTILIZADOR', 'ID_TALENT_MANAGER']
        },
        {
            name: 'VALIDA_2_FK',
            fields: ['ID_UTILIZADOR', 'ID_SERVICE_LINE_LIDER']
        }
    ]
});

module.exports = PedidosBadge;