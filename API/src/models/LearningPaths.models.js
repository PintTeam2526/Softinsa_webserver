var Sequelize = require('sequelize');
var sequelize = require('../database');

var LearningPaths = sequelize.define('LearningPaths',
{
    id_learningpath: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    nome_learningpath: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    descricao_learningpath: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    imagem_learningpath: {
        type: Sequelize.STRING(254),
        allowNull: false
    },
    estado_A_I_: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
},
{
    tableName: 'Learning_Paths',
    timestamps: true //guardar data e hora de cada alteração na tabela
});

module.exports = LearningPaths;