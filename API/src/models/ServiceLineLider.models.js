var Sequelize = require('sequelize');
var sequelize = require('./database');

var ServiceLineLider = sequelize.define('ServiceLineLider',
{
    ID_UTILIZADOR: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    ID_SERVICE_LINE_LIDER: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    ID_SERVICELINE: {
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
    tableName: 'SERVICE_LINE_LIDER',
    timestamps: true, //guardar data e hora de cada alteração na tabela

    indexes: [
        {
            name: 'POSSUI_9_FK',
            fields: ['ID_SERVICELINE']
        },
        {
            name: 'INHERITANCE_3_FK',
            fields: ['ID_UTILIZADOR']
        }
    ]
});

module.exports = ServiceLineLider;