var Sequelize = require('sequelize');
var sequelize = require('../database');

var TalentManager = sequelize.define('TalentManager',
{
    id_utilizador: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    id_talent_manager: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    nome_utilizador: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    email_utilizador: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    password_utilizador: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    username_utilizador: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    tipo_utilizador: {
        type: Sequelize.STRING(2),
        allowNull: false
    },
    estado_A_I_: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
},
{
    tableName: 'Talent_Manager',
    timestamps: true, //guardar data e hora de cada alteração na tabela

    indexes: [
        {
            name: 'INHERITANCE_2_FK',
            fields: ['id_utilizador']
        }
    ]
});

module.exports = TalentManager;