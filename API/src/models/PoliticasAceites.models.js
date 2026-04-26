var Sequelize = require('sequelize');
var sequelize = require('../../database');
var Utilizador = require('./Utilizadores.models');
var Politica = require('./Potilicas.models');

var PoliticasAceites = sequelize.define('PoliticasAceites',
{
    id_utilizador: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: Utilizador,
            key: 'id_utilizador'
        },
    },
    id_politica: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: Politica,
            key: 'id_politica'
        },
    }
},
{
    timestamps: false
});

PoliticasAceites.belongsTo(Utilizador);
PoliticasAceites.belongsTo(Politica);

module.exports = PoliticasAceites;