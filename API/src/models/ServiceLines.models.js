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
    nome_service_line: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    descricao_service_line: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    imagem_service_line: {
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
    timestamps: true
});


ServiceLines.belongsTo(LearningPath, { foreignKey: 'id_learning_path' });

module.exports = ServiceLines;