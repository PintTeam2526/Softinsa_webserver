var Sequelize = require('sequelize');
var sequelize = require('../../database');
var Utilizador = require('./Utilizadores.models');

var TalentManagers = sequelize.define('TalentManagers',
{
    id_utilizador: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Utilizador,
            key: 'id_utilizador'
        },
    },
     id_talent_manager: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
},


{
    timestamps: false
});


TalentManagers.belongsTo(Utilizador);

module.exports = TalentManagers;