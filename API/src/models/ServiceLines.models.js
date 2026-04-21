var Sequelize = require('sequelize');
var sequelize = require('../database');

var ServiceLines = sequelize.define('ServiceLines',
{
    id_serviceline: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    id_utilizador: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    id_service_line_lider: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    id_learningpath: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    nome_serviceline: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    descricao_serviceline: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    imagem_serviceline: {
        type: Sequelize.STRING(254),
        allowNull: false
    },
    estado_A_I_: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
},
{
    tableName: 'Service_Lines',
    timestamps: true, //guardar data e hora de cada alteração na tabela

    indexes: [
        {
            name: 'POSSUI_2_FK',
            fields: ['id_learningpath']
        },
        {
            name: 'POSSUI_10_FK',
            fields: ['id_utilizador', 'id_service_line_lider']
        }
    ]
});

module.exports = ServiceLines;