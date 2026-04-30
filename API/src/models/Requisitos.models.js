var Sequelize = require('sequelize');
var sequelize = require('../../database');
var Badge = require('./Badges.models');

var Requisitos = sequelize.define('Requisitos',
{
    id_requisito: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_badge: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Badge,
            key: 'id_badge'
        },
    },
    nome_requisito: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    descricao_requisito: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    imagem_requisito: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    data_insercao: {
        type: Sequelize.DATE,
        allowNull: false
    },
    estado_a_i: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
},


{
    timestamps: false
});

Requisitos.belongsTo(Badge);

module.exports = Requisitos;