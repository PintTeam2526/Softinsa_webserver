var Sequelize = require('sequelize');
var sequelize = require('../../database');
var Administrador = require('./Administradores.models');

var Politicas = sequelize.define('Politicas',
{
    id_politica: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_administrador: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Administrador,
            key: 'id_administrador'
        },
    },
    politica: {
        type: Sequelize.TEXT,
        allowNull: false
    }
},
{
    timestamps: true
});

Politicas.belongsTo(Administrador, { foreignKey: 'id_administrador' });

module.exports = Politicas;
