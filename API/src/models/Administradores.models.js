var Sequelize = require('sequelize');
var sequelize = require('../../database');
var Utilizador = require('./Utilizadores.models');

var Administradores = sequelize.define('Administradores',
{
    id_utilizador: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Utilizador,
            key: 'id_utilizador'
        },
    },
     id_administrador: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
},
{
    timestamps: true
});


Administradores.belongsTo(Utilizador, { foreignKey: 'id_utilizador' });

module.exports = Administradores;


