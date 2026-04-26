var Sequelize = require('sequelize');
var sequelize = require('../../database');
var LearningPath = require('./LearningPaths.models');

var ServiceLines = sequelize.define('ServiceLines',
{
    id_service_line: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_learning_path: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: LearningPath,
            key: 'id_learning_path'
        },
    },
    nome_serviceline: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    descricao_serviceline: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    imagem_serviceline: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    estado_A_I_: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    data_insercao: {
        type: Sequelize.TEXT,
        allowNull: false
    }
},
{
    timestamps: false
});


ServiceLines.belongsTo(LearningPath);

module.exports = ServiceLines;