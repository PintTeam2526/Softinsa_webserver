var Sequelize = require('sequelize');
var sequelize = require('./database');

var HistoricoPedidos = sequelize.define('HistoricoPedidos',
{
    ID_HISTORICO: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    ID_ESTADO: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    ID_UTILIZADOR: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    ID_PEDIDO_BADGE: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    PEDIDO: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    AVALIADOR: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    DATA: {
        type: Sequelize.DATE,
        allowNull: false
    },
    ESTADO_OBJETIVO: {
        type: Sequelize.TEXT,
        allowNull: false
    }
},
{
    tableName: 'HISTORICO_PEDIDOS',
    timestamps: true, //guardar data e hora de cada alteração na tabela

    indexes: [
        {
            name: 'POSSUI_11_FK',
            fields: ['ID_PEDIDO_BADGE']
        },
        {
            name: 'POSSUI_12_FK',
            fields: ['ID_ESTADO']
        },
        {
            name: 'ATUALIZA_FK',
            fields: ['ID_UTILIZADOR']
        }
    ]
});

module.exports = HistoricoPedidos;