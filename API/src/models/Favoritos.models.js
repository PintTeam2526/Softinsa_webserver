var Sequelize = require('sequelize');
var sequelize = require('../../database');
var Consultor = require('./Consultores.models');
var Badges = require('./Badges.models');

var Favoritos = sequelize.define('Favoritos',
{
    id_consultor: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: Consultor,
            key: 'id_consultor'
        },
    },
    id_badge: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: Badges,
            key: 'id_badge'
        },
    }
},


{
    timestamps: true
});

Favoritos.belongsTo(Consultor, { foreignKey: 'id_consultor' });
Favoritos.belongsTo(Badges, { foreignKey: 'id_badge' });

module.exports = Favoritos;