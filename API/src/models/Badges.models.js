var Sequelize = require('sequelize');
var sequelize = require('../../database');
var Area = require('./Areas.models');


var Badges = sequelize.define('Badges',
{
    id_badge: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_area: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Area,
            key: 'id_area'
        },
    },
    nome_badge: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    descricao_badge: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    pontos_badge: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    pago: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    nivel_badge: {
        type: Sequelize.STRING(25),
        allowNull: false
    },
    imagem_badge: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    sla: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    validade: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    estado_a_i: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    data_insercao: {
        type: Sequelize.DATE,
        allowNull: false
    },
},


{
    timestamps: true
});


Badges.belongsTo(Area, { foreignKey: 'id_area' });

module.exports = Badges;

