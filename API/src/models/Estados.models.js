var Sequelize = require('sequelize');
var sequelize = require('../database');

var Estados = sequelize.define('Estados',
{
    id_estado: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    id_historico: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    nome_estado: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    descricao_estado: {
        type: Sequelize.TEXT,
        allowNull: false
    }
},
{
    tableName: 'Estados',
    timestamps: true, //guardar data e hora de cada alteração na tabela

    indexes: [
        {
            name: 'POSSUI_13_FK',
            fields: ['id_historico']
        }
    ]
});

module.exports = Estados;