var Sequelize = require('sequelize');
var sequelize = require('../database');

var Enviadas = sequelize.define('Enviadas',
{
    id_notificacaoadmin: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    id_utilizador: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    }
},
{
    tableName: 'Enviadas',
    timestamps: true, //guardar data e hora de cada alteração na tabela

    indexes: [
        {
            name: 'ENVIADAS_FK',
            fields: ['id_notificacaoadmin']
        },
        {
            name: 'ENVIADAS2_FK',
            fields: ['id_utilizador']
        }
    ]
});

module.exports = Enviadas;