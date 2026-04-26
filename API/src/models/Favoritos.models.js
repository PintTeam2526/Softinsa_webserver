var Sequelize = require('sequelize');
var sequelize = require('../../database');
var Consultor = require('./Consultores.models');
var Badge = require('./Badges.models');

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
            model: Badge,
            key: 'id_badge'
        },
    }
},


{
    timestamps: false
});

Favoritos.belongsTo(Consultor);
Favoritos.belongsTo(Badge);

module.exports = Favoritos;