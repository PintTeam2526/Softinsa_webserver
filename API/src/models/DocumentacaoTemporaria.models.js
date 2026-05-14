var Sequelize = require('sequelize');
var sequelize = require('../../database');

var DocumentacaoTemporaria = sequelize.define('DocumentacaoTemporaria',
{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    sessao_id: {
        type: Sequelize.UUID,
        allowNull: false
    },
    documentacao: {
        type: Sequelize.TEXT, // Armazena a string Base64 diretamente
        allowNull: false
    },
    data_insercao: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
    }
},
{
    timestamps: false,
    tableName: 'DocumentacaoTemporaria'
});

module.exports = DocumentacaoTemporaria;