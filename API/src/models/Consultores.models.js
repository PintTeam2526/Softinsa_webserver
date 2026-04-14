var Sequelize = require('sequelize');
var sequelize = require('./database');

var Consultores = sequelize.define('Consultores',
{
    ID_UTILIZADOR: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    ID_CONSULTOR: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    TOTAL_PONTOS: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    ID_AREA: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    NOME_UTILIZADOR: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    EMAIL_UTILIZADOR: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    PASSWORD_UTILIZADOR: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    USERNAME_UTILIZADOR: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    TIPO_UTILIZADOR: {
        type: Sequelize.STRING(2),
        allowNull: false
    },
    ESTADO_A_I_: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
},
{
    tableName: 'CONSULTORES',
    timestamps: true, //guardar data e hora de cada alteração na tabela

    indexes: [
        {
            name: 'POSSUI_1_FK',
            fields: ['ID_AREA']
        },
        {
            name: 'INHERITANCE_1_FK',
            fields: ['ID_UTILIZADOR']
        }
    ]
});

module.exports = Consultores;