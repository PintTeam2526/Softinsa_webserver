var Sequelize = require('sequelize');
var sequelize = require('../database');

var Documentacoes = sequelize.define('Documentacoes',
{
    id_documentacao: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    id_pedido_badge: {
        type: Sequelize.INTEGER,
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
    documentacao: {
        type: Sequelize.STRING(254),
        allowNull: false
    },
    validacao: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    }
},
{
    tableName: 'Documentacoes',
    timestamps: true, //guardar data e hora de cada alteração na tabela

    indexes: [
        {
            name: 'POSSUI_FK',
            fields: ['id_pedido_badge']
        },
        {
            name: 'APRESENTA_FK',
            fields: ['id_utilizador', 'id_consultor']
        }
    ]
});

module.exports = Documentacoes;