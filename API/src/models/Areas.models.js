var Sequelize = require('sequelize');
var sequelize = require('../../database');
var ServiceLine = require('./ServiceLines.models');

var Areas = sequelize.define('Areas',
{
    id_area: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_service_line: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: ServiceLine,
            key: 'id_service_line'
        },
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
        type: Sequelize.TEXT,
        allowNull: false
    },
    estado_a_i: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    data_insercao: {
        type: Sequelize.DATE,
        allowNull: false
    }
},
{
    timestamps: false
});


Areas.belongsTo(ServiceLine);

module.exports = Areas;