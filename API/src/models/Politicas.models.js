var Sequelize = require('sequelize');
var sequelize = require('../../database');


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
            model: Administradores,
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


module.exports = Politicas;