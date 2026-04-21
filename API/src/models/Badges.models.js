var Sequelize = require('sequelize');
var sequelize = require('../database');

var Badges = sequelize.define('Badges',
{
    id_badge: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    id_area: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    id_badge_concluido: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    id_objetivo: {
        type: Sequelize.INTEGER,
        allowNull: true
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
        type: Sequelize.STRING(10),
        allowNull: false
    },
    imagem_badge: {
        type: Sequelize.STRING(254),
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
    area: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    service_line: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    learning_path: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    estado_A_I_: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
},
{
    tableName: 'Badges',
    timestamps: true, //guardar data e hora de cada alteração na tabela

    indexes: [
        {
            name: 'POSSUI_4_FK',
            fields: ['id_area']
        },
        {
            name: 'POSSUI_6_FK',
            fields: ['id_objetivo']
        },
        {
            name: 'POSSUI_7_FK',
            fields: ['id_badge_concluido']
        }
    ]
});

module.exports = Badges;