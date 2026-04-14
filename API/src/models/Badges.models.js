var Sequelize = require('sequelize');
var sequelize = require('./database');

var Badges = sequelize.define('Badges',
{
    ID_BADGE: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    ID_AREA: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    ID_BADGE_CONCLUIDO: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    ID_OBJETIVO: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    NOME_BADGE: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    DESCRICAO_BADGE: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    PONTOS_BADGE: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    PAGO: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    NIVEL_BADGE: {
        type: Sequelize.STRING(10),
        allowNull: false
    },
    IMAGEM_BADGE: {
        type: Sequelize.STRING(254),
        allowNull: false
    },
    SLA: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    VALIDADE: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    AREA: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    SERVICE_LINE: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    LEARNING_PATH: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    ESTADO_A_I_: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
},
{
    tableName: 'BADGES',
    timestamps: true, //guardar data e hora de cada alteração na tabela

    indexes: [
        {
            name: 'POSSUI_4_FK',
            fields: ['ID_AREA']
        },
        {
            name: 'POSSUI_6_FK',
            fields: ['ID_OBJETIVO']
        },
        {
            name: 'POSSUI_7_FK',
            fields: ['ID_BADGE_CONCLUIDO']
        }
    ]
});

module.exports = Badges;