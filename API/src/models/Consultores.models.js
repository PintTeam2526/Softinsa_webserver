var Sequelize = require('sequelize');
var sequelize = require('../../database');
var Utilizador = require('./Utilizadores.models');
var Area = require('./Areas.models');


var Consultores = sequelize.define('Consultores',
{
    id_utilizador: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Utilizador,
            key: 'id_utilizador'
        },
    },
     id_consultor: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    total_pontos: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    id_area: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Area,
            key: 'id_area'
        },
    },
},


{
    timestamps: true
});


Consultores.belongsTo(Utilizador, { foreignKey: 'id_utilizador' });
Consultores.belongsTo(Area, { foreignKey: 'id_area' });

module.exports = Consultores;