var Sequelize = require('sequelize');
var sequelize = require('./database');

var LearningPaths = sequelize.define('LearningPaths',
{
    ID_LEARNINGPATH: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    NOME_LEARNINGPATH: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    DESCRICAO_LEARNINGPATH: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    IMAGEM_LEARNING_PATH: {
        type: Sequelize.STRING(254),
        allowNull: false
    },
    ESTADO_A_I_: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
},
{
    tableName: 'LEARNING_PATHS',
    timestamps: true //guardar data e hora de cada alteração na tabela
});

module.exports = LearningPaths;