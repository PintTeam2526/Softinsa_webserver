var Sequelize = require('sequelize');
var sequelize = require('../database');

var Areas = sequelize.define('Areas',
{
    id_area: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    id_serviceline: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    nome_area: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    descricao_area: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    imagem_area: {
        type: Sequelize.STRING(254),
        allowNull: false
    },
    estado_A_I_: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
},
{
    tableName: 'AREAS',
    timestamps: true, //guardar data e hora de cada alteração na tabela

    indexes: [
        {
            name: 'POSSUI_3_FK',
            fields: ['id_serviceline']
        }
    ]
});

module.exports = Areas;