var Sequelize = require('sequelize');
var sequelize = require('../database');

var PoliticasAceites = sequelize.define('PoliticasAceites',
{
    id_utilizador: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    id_politica: {
        type: Sequelize.TEXT,
        primaryKey: true,
        allowNull: false
    }
},
{
    tableName: 'Politicas_Aceites',
    timestamps: true, //guardar data e hora de cada alteração na tabela

    indexes: [
        {
            name: 'POLITICAS_ACEITES_FK',
            fields: ['id_utilizador']
        },
        {
            name: 'POLITICAS_ACEITES2_FK',
            fields: ['id_politica']
        }
    ]
});

module.exports = PoliticasAceites;