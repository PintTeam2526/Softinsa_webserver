var Sequelize = require('sequelize');
var sequelize = require('./database');

var Objetivos = sequelize.define('Objetivos',
{
    ID_OBJETIVO: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    ID_BADGE: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    ID_UTILIZADOR: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    ID_CONSULTOR: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    DATA_LIMITE_CONCLUSAO: {
        type: Sequelize.DATE,
        allowNull: false
    },
    NOME_OBJETIVO: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    DATA_CONCLUSAO_OBJETIVO: {
        type: Sequelize.DATE,
        allowNull: false
    },
    ESTADO_OBJETIVO: {
        type: Sequelize.TEXT,
        allowNull: false
    }
},
{
    tableName: 'OBJETIVOS',
    timestamps: true, //guardar data e hora de cada alteração na tabela

    indexes: [
        {
            name: 'CRIA_FK',
            fields: ['ID_UTILIZADOR', 'ID_CONSULTOR']
        },
        {
            name: 'POSSUI_5_FK',
            fields: ['ID_BADGE']
        }
    ]
});

module.exports = Objetivos;