var Sequelize = require('sequelize');
var sequelize = require('../../database');

var LearningPaths = sequelize.define('LearningPaths',
{
    id_learning_path: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nome_learning_path: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    descricao_learning_path: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    imagem_learning_path: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    estado_a_i: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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

module.exports = LearningPaths;