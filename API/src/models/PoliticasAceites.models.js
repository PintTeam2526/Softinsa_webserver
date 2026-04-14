var Sequelize = require('sequelize');
var sequelize = require('./database');

var PoliticasAceites = sequelize.define('PoliticasAceites',
{
    ID_UTILIZADOR: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    ID_POLITICA: {
        type: Sequelize.TEXT,
        primaryKey: true,
        allowNull: false
    }
},
{
    tableName: 'POLITICAS_ACEITES',
    timestamps: true, //guardar data e hora de cada alteração na tabela

    indexes: [
        {
            name: 'POLITICAS_ACEITES_FK',
            fields: ['ID_UTILIZADOR']
        },
        {
            name: 'POLITICAS_ACEITES2_FK',
            fields: ['ID_POLITICA']
        }
    ]
});

module.exports = PoliticasAceites;