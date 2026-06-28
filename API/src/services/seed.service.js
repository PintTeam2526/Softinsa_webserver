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

        // Identifica as tabelas que o seed vai popular
        const tabelasNoSeed = [...new Set(
            [...sql.matchAll(/INSERT\s+INTO\s+"?([A-Za-z0-9_]+)"?/gi)].map(m => m[1])
        )];

        // Repõe as sequences dessas tabelas a 1.
        // Necessário porque tentativas anteriores falhadas avançaram os
        // contadores sem nunca terem sido confirmadas (sequences não
        // revertem com ROLLBACK), desalinhando os IDs fixos do seed.sql.
        if (tabelasNoSeed.length > 0) {
            const listaTabelas = tabelasNoSeed.map(t => `'${t}'`).join(',');
            await sequelize.query(`
                DO $$
                DECLARE
                    r RECORD;
                BEGIN
                    FOR r IN (
                        SELECT seq.relname AS sequence_name
                        FROM pg_class seq
                        JOIN pg_depend dep ON dep.objid = seq.oid
                        JOIN pg_class tab ON dep.refobjid = tab.oid
                        WHERE seq.relkind = 'S'
                          AND tab.relname = ANY (ARRAY[${listaTabelas}])
                    ) LOOP
                        EXECUTE 'ALTER SEQUENCE "' || r.sequence_name || '" RESTART WITH 1';
                    END LOOP;
                END $$;
            `);
        }

        await sequelize.query(sql);

        console.log('✅ Seed data inserido com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao inserir seed data:', error.message);
        if (error.sql) console.error('   SQL:', error.sql.substring(0, 200));
    }
}

module.exports = seedDatabase;
