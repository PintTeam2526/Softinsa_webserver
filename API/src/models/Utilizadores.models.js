var Sequelize = require('sequelize');
var sequelize = require('./database');

var Utilizadores = sequelize.define('Utilizadores',
{
    ID_UTILIZADOR: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    NOME_UTILIZADOR: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    EMAIL_UTILIZADOR: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    PASSWORD_UTILIZADOR: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    USERNAME_UTILIZADOR: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    TIPO_UTILIZADOR: {
        type: Sequelize.STRING(2),
        allowNull: false
    },
    ESTADO_A_I_: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
},
{
    tableName: 'utilizadores',
    timestamps: true //guardar data e hora de cada alteração na tabela
});

module.exports = Utilizadores;