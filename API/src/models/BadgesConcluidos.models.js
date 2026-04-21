var Sequelize = require('sequelize');
var sequelize = require('../database');

var BadgesConcluidos = sequelize.define('BadgesConcluidos',
{
    data_conclusao: {
        type: Sequelize.DATE,
        allowNull: false
    },
    dataconclusao_badge: {
        type: Sequelize.DATE,
        allowNull: false
    },
    id_badge_concluido: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    id_badge: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    id_utilizador: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    id_consultor: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    url_validacao: {
        type: Sequelize.TEXT,
        allowNull: false
    }
},
{
    tableName: 'Badges_Concluidos',
    timestamps: true, //guardar data e hora de cada alteração na tabela

    indexes: [
        {
            name: 'CONCLUIR_FK',
            fields: ['id_utilizador', 'id_consultor']
        },
        {
            name: 'POSSUI_8_FK',
            fields: ['id_badge']
        }
    ]
});

module.exports = BadgesConcluidos;