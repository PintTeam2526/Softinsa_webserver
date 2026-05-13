var Sequelize = require('sequelize');
var sequelize = require('../../database');
var Consultor = require('./Consultores.models');
var Badge = require('./Badges.models');

var BadgesConcluidos = sequelize.define('BadgesConcluidos',
{
    id_badge_concluido: {
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
    data_conclusao_badge: {
        type: Sequelize.DATE,
        allowNull: false
    },
    url_validacao: {
        type: Sequelize.TEXT,
        allowNull: false
    }
},


{
    timestamps: false
});

BadgesConcluidos.belongsTo(Consultor, { foreignKey: 'id_consultor' });
BadgesConcluidos.belongsTo(Badge, { foreignKey: 'id_badge' });
Badge.hasMany(BadgesConcluidos, { foreignKey: 'id_badge' });

module.exports = BadgesConcluidos;