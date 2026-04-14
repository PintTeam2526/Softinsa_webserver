var Sequelize = require('sequelize');
var sequelize = require('./database');

var Estados = sequelize.define('Estados',
{
    ID_ESTADO: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    ID_HISTORICO: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    NOME_ESTADO: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    DESCRICAO_ESTADO: {
        type: Sequelize.TEXT,
        allowNull: false
    }
},
{
    tableName: 'ESTADOS',
    timestamps: true, //guardar data e hora de cada alteração na tabela

    indexes: [
        {
            name: 'POSSUI_13_FK',
            fields: ['ID_HISTORICO']
        }
    ]
});

module.exports = Estados;