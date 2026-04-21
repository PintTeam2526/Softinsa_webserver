var Sequelize = require('sequelize');
var sequelize = require('../database');

var ServiceLineLider = sequelize.define('ServiceLineLider',
{
    id_utilizador: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    id_service_line_lider: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    id_serviceline: {
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
    estado_A_I_: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
},
{
    tableName: 'Service_Line_Lider',
    timestamps: true, //guardar data e hora de cada alteração na tabela

    indexes: [
        {
            name: 'POSSUI_9_FK',
            fields: ['id_serviceline']
        },
        {
            name: 'INHERITANCE_3_FK',
            fields: ['id_utilizador']
        }
    ]
});

module.exports = ServiceLineLider;