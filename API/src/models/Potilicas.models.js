var Sequelize = require('sequelize');
var sequelize = require('../database');

var Politicas = sequelize.define('Politicas',
{
    id_politica: {
        type: Sequelize.TEXT,
        primaryKey: true,
        allowNull: false
    },
    id_utilizador: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    id_administrador: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    nome_politica: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    descricao_politica: {
        type: Sequelize.TEXT,
        allowNull: false
    }
},
{
    tableName: 'Politicas',
    timestamps: true, //guardar data e hora de cada alteração na tabela

    indexes: [
        {
            name: 'CRIAR_FK',
            fields: ['id_utilizador', 'id_administrador']
        }
    ]
});

module.exports = Politicas;