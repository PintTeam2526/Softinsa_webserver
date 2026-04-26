var Sequelize = require('sequelize');
var sequelize = require('../../database');

var Estados = sequelize.define('Estados',
{
    id_estado: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nome_estado: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    descricao_estado: {
        type: Sequelize.TEXT,
        allowNull: false
    }
},


{
    timestamps: false
});

module.exports = Estados;