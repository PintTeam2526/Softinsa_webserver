var Sequelize = require('sequelize');
var sequelize = require('../../database');
var Consultor = require('./Consultores.models');

var Notificacoes = sequelize.define('Notificacoes',
{
    id_notificacao: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_consultor: {
        type: Sequelize.INTEGER,
        allowNull: true,  // null = global
        references: {
            model: Consultor,
            key: 'id_consultor'
        }
    },
    notificacao: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    data_de_envio: {
        type: Sequelize.DATE,
        allowNull: false
    },
    remetente: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    descricao: {
    type: Sequelize.TEXT,
    allowNull: true
},
},
{
    timestamps: true
});

Notificacoes.belongsTo(Consultor, { foreignKey: 'id_consultor' });

module.exports = Notificacoes;