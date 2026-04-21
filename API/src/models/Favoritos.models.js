var Sequelize = require('sequelize');
var sequelize = require('../database');

var Favoritos = sequelize.define('Favoritos',
{
    id_utilizador: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    id_consultor: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    id_badge: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    }
},
{
    tableName: 'Favoritos',
    timestamps: true, //guardar data e hora de cada alteração na tabela

    indexes: [
        {
            name: 'FAVORITOS_FK',
            fields: ['id_utilizador', 'id_consultor']
        },
        {
            name: 'FAVORITOS2_FK',
            fields: ['id_badge']
        }
    ]
});

module.exports = Favoritos;