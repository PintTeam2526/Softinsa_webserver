// LIGAÇÃO À BASE DE DADOS COM SEQUELIZE

const { Sequelize } = require('sequelize');
require('dotenv').config();

// Criar instância do Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false, // podes pôr true se quiseres ver queries no console
  }
);

// Testar ligação
async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('Ligado ao PostgreSQL com Sequelize');
  } catch (error) {
    console.error('Erro ao ligar ao PostgreSQL:', error.message);
  }
}

connectDB();

module.exports = sequelize;
