var Sequelize = require('sequelize');
var sequelize = require('../database');

var Requisitos = sequelize.define('Requisitos',
{
    id_requisito: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    id_badge: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    nome_requisito: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    descricao_requisito: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    imagem_requisito: {
        type: Sequelize.STRING(254),
        allowNull: true
    }
},
{
    tableName: 'Requisitos',
    timestamps: true, //guardar data e hora de cada alteração na tabela

    indexes: [
        {
            name: 'TEM_FK',
            fields: ['id_badge']
        }
    ]
});

module.exports = Requisitos;