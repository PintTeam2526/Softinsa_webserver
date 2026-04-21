var Sequelize = require('sequelize');
var sequelize = require('../database');

var Objetivos = sequelize.define('Objetivos',
{
    id_objetivo: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    id_badge: {
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
    data_limite_conclusao: {
        type: Sequelize.DATE,
        allowNull: false
    },
    nome_objetivo: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    data_conclusao_objetivo: {
        type: Sequelize.DATE,
        allowNull: false
    },
    estado_objetivo: {
        type: Sequelize.TEXT,
        allowNull: false
    }
},
{
    tableName: 'Objetivos',
    timestamps: true, //guardar data e hora de cada alteração na tabela

    indexes: [
        {
            name: 'CRIA_FK',
            fields: ['id_utilizador', 'id_consultor']
        },
        {
            name: 'POSSUI_5_FK',
            fields: ['id_badge']
        }
    ]
});

module.exports = Objetivos;