var Sequelize = require('sequelize');
var sequelize = require('./database');

var Areas = sequelize.define('Areas',
{
    ID_AREA: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    ID_SERVICELINE: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    NOME_AREA: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    DESCRICAO_AREA: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    IMAGEM_AREA: {
        type: Sequelize.STRING(254),
        allowNull: false
    },
    ESTADO_A_I_: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
},
{
    tableName: 'AREAS',
    timestamps: true, //guardar data e hora de cada alteração na tabela

    indexes: [
        {
            name: 'POSSUI_3_FK',
            fields: ['ID_SERVICELINE']
        }
    ]
});

module.exports = Areas;