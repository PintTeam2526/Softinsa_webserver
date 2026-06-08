const sequelize = require('../../database');
const { QueryTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');

async function seedDatabase() {
    try {
        const result = await sequelize.query(
            'SELECT COUNT(*) AS count FROM "Utilizadores"',
            { type: QueryTypes.SELECT }
        );

        if (parseInt(result[0].count, 10) > 0) {
            console.log('📦 Base de dados já contém dados. Seed ignorado.');
            return;
        }

        const sqlPath = path.join(__dirname, '../../sql/seed.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        await sequelize.query(sql);

        console.log('✅ Seed data inserido com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao inserir seed data:', error.message);
        if (error.sql) console.error('   SQL:', error.sql.substring(0, 200));
    }
}

module.exports = { seedDatabase };
