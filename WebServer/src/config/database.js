const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.connect()
  .then(client => {
    console.log('Ligado ao PostgreSQL');
    client.release();
  })
  .catch(err => {
    console.error('Erro ao ligar ao PostgreSQL:', err.message);
  });

module.exports = pool;