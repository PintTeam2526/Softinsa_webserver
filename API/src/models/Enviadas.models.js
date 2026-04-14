var Sequelize = require('sequelize');
var sequelize = require('./database');

var Enviadas = sequelize.define('Enviadas',
{
    ID_NOTIFICACAOADMIN: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    ID_UTILIZADOR: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    }
},
{
    tableName: 'ENVIADAS',
    timestamps: true, //guardar data e hora de cada alteração na tabela

    indexes: [
        {
            name: 'ENVIADAS_FK',
            fields: ['ID_NOTIFICACAOADMIN']
        },
        {
            name: 'ENVIADAS2_FK',
            fields: ['ID_UTILIZADOR']
        }
    ]
});

module.exports = Enviadas;