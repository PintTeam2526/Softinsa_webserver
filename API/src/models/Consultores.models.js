var Sequelize = require('sequelize');
var sequelize = require('../database');

var Consultores = sequelize.define('Consultores',
{
    id_utilizador: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    id_consultor: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    total_pontos: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    id_area: {
        type: Sequelize.INTEGER,
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
    esatdo_A_I_: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
},
{
    tableName: 'Consultores',
    timestamps: true, //guardar data e hora de cada alteração na tabela

    indexes: [
        {
            name: 'POSSUI_1_FK',
            fields: ['id_area']
        },
        {
            name: 'INHERITANCE_1_FK',
            fields: ['id_utilizador']
        }
    ]
});

module.exports = Consultores;