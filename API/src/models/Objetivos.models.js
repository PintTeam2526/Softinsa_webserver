var Sequelize = require('sequelize');
var sequelize = require('../../database');
var Consultor = require('./Consultores.models');
var Badge = require('./Badges.models');

var Objetivos = sequelize.define('Objetivos',
{
    id_objetivo: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    id_badge: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Badge,
            key: 'id_badge'
        },
    },
    id_consultor: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Consultor,
            key: 'id_consultor'
        },
    },
    data_limite_conclusao: {
        type: Sequelize.DATE,
        allowNull: false
    },
    nome_objetivo: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    data_conclusao_objetivo: {
        type: Sequelize.DATE,
        allowNull: true
    },
    estado_objetivo: {
        type: Sequelize.TEXT,
        allowNull: false
    }
},
{
    timestamps: false
});

Objetivos.belongsTo(Consultor);
Objetivos.belongsTo(Badge);

module.exports = Objetivos;