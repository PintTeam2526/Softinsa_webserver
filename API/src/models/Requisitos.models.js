var Sequelize = require('sequelize');
var sequelize = require('./database');

var Requisitos = sequelize.define('Requisitos',
{
    ID_REQUISITO: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    ID_BADGE: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    NOME_REQUISITO: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    DESCRICAO_REQUISITO: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    IMAGEM_REQUISITO: {
        type: Sequelize.STRING(254),
        allowNull: true
    }
},
{
    tableName: 'REQUISITOS',
    timestamps: true, //guardar data e hora de cada alteração na tabela

    indexes: [
        {
            name: 'TEM_FK',
            fields: ['ID_BADGE']
        }
    ]
});

module.exports = Requisitos;