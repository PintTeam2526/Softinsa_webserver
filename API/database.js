// LIGAÇÃO À BASE DE DADOS COM SEQUELIZE

const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true
    }
  }
});

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
