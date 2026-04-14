var Sequelize = require('sequelize');
var sequelize = require('./database');

var Documentacoes = sequelize.define('Documentacoes',
{
    ID_DOCUMENTACAO: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    ID_PEDIDO_BADGE: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    ID_UTILIZADOR: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    ID_CONSULTOR: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    DOCUMENTACAO: {
        type: Sequelize.STRING(254),
        allowNull: false
    },
    VALIDADO: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    }
},
{
    tableName: 'DOCUMENTACOES',
    timestamps: true, //guardar data e hora de cada alteração na tabela

    indexes: [
        {
            name: 'POSSUI_FK',
            fields: ['ID_PEDIDO_BADGE']
        },
        {
            name: 'APRESENTA_FK',
            fields: ['ID_UTILIZADOR', 'ID_CONSULTOR']
        }
    ]
});

module.exports = Documentacoes;