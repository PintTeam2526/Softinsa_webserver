var Sequelize = require('sequelize');
var sequelize = require('./database');

var ServiceLines = sequelize.define('ServiceLines',
{
    ID_SERVICELINE: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    ID_UTILIZADOR: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    ID_SERVICE_LINE_LIDER: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    ID_LEARNINGPATH: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    NOME_SERVICELINE: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    DESCRICAO_SERVICELINE: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    IMAGEM_SERVICE_LINE: {
        type: Sequelize.STRING(254),
        allowNull: false
    },
    ESTADO_A_I_: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
},
{
    tableName: 'SERVICE_LINES',
    timestamps: true, //guardar data e hora de cada alteração na tabela

    indexes: [
        {
            name: 'POSSUI_2_FK',
            fields: ['ID_LEARNINGPATH']
        },
        {
            name: 'POSSUI_10_FK',
            fields: ['ID_UTILIZADOR', 'ID_SERVICE_LINE_LIDER']
        }
    ]
});

module.exports = ServiceLines;