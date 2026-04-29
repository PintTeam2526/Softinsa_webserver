var Sequelize = require('sequelize');
var sequelize = require('../../database');

var Utilizadores = sequelize.define('Utilizadores',
{
    id_utilizador: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    nome_utilizador: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    email_utilizador: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    password_utilizador: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    username_utilizador: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    tipo_utilizador: {
        type: Sequelize.STRING(2),
        allowNull: false
    },
    imagem_utilizador: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    estado_a_i: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
},
{
    timestamps: false
});

module.exports = Utilizadores;