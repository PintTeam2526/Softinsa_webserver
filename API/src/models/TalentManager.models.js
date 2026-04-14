var Sequelize = require('sequelize');
var sequelize = require('./database');

var TalentManager = sequelize.define('TalentManager',
{
    ID_UTILIZADOR: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    ID_TALENT_MANAGER: {
        type: Sequelize.INTEGER,
        primaryKey: true,
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
    tableName: 'TALENT_MANAGER',
    timestamps: true, //guardar data e hora de cada alteração na tabela

    indexes: [
        {
            name: 'INHERITANCE_2_FK',
            fields: ['ID_UTILIZADOR']
        }
    ]
});

module.exports = TalentManager;