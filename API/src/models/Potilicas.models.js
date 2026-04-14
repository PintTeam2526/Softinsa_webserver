var Sequelize = require('sequelize');
var sequelize = require('./database');

var Politicas = sequelize.define('Politicas',
{
    ID_POLITICA: {
        type: Sequelize.TEXT,
        primaryKey: true,
        allowNull: false
    },
    ID_UTILIZADOR: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    ID_ADMINISTRADOR: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    NOME_POLITICA: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    DESCRICAO_POLITICA: {
        type: Sequelize.TEXT,
        allowNull: false
    }
},
{
    tableName: 'POLITICAS',
    timestamps: true, //guardar data e hora de cada alteração na tabela

    indexes: [
        {
            name: 'CRIAR_FK',
            fields: ['ID_UTILIZADOR', 'ID_ADMINISTRADOR']
        }
    ]
});

module.exports = Politicas;