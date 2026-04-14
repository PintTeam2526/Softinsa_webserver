var Sequelize = require('sequelize');
var sequelize = require('./database');

var BadgesConcluidos = sequelize.define('BadgesConcluidos',
{
    DATA_CONCLUSAO: {
        type: Sequelize.DATE,
        allowNull: false
    },
    DATACONCLUSAO_BADGE: {
        type: Sequelize.DATE,
        allowNull: false
    },
    ID_BADGE_CONCLUIDO: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    ID_BADGE: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    ID_UTILIZADOR: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    ID_CONSULTOR: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    URL_VALIDACAO: {
        type: Sequelize.TEXT,
        allowNull: false
    }
},
{
    tableName: 'BADGES_CONCLUIDOS',
    timestamps: true, //guardar data e hora de cada alteração na tabela

    indexes: [
        {
            name: 'CONCLUIR_FK',
            fields: ['ID_UTILIZADOR', 'ID_CONSULTOR']
        },
        {
            name: 'POSSUI_8_FK',
            fields: ['ID_BADGE']
        }
    ]
});

module.exports = BadgesConcluidos;