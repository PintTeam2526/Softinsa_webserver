//FICHEIRO DE TESTE DE CRIAÇÂO DE TABELA - REMOVER DEPOIS

const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const User = sequelize.define('User', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  idade: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'users'
});

module.exports = User;