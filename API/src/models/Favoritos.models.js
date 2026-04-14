var Sequelize = require('sequelize');
var sequelize = require('./database');

var Favoritos = sequelize.define('Favoritos',
{
    ID_UTILIZADOR: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    ID_CONSULTOR: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    ID_BADGE: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    }
},
{
    tableName: 'FAVORITOS',
    timestamps: true, //guardar data e hora de cada alteração na tabela

    indexes: [
        {
            name: 'FAVORITOS_FK',
            fields: ['ID_UTILIZADOR', 'ID_CONSULTOR']
        },
        {
            name: 'FAVORITOS2_FK',
            fields: ['ID_BADGE']
        }
    ]
});

module.exports = Favoritos;