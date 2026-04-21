var Sequelize = require('sequelize');
var sequelize = require('../database');

var HistoricoPedidos = sequelize.define('HistoricoPedidos',
{
    id_historico: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    id_estado: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    id_utilizador: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    id_pedido_badge: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    pedido: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    avaliador: {
        type: Sequelize.INTEGER,
        allowNull: false
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
    tableName: 'Historico_Pedidos',
    timestamps: true, //guardar data e hora de cada alteração na tabela

    indexes: [
        {
            name: 'POSSUI_11_FK',
            fields: ['id_pedido_badge']
        },
        {
            name: 'POSSUI_12_FK',
            fields: ['id_estado']
        },
        {
            name: 'ATUALIZA_FK',
            fields: ['id_utilizador']
        }
    ]
});

module.exports = HistoricoPedidos;