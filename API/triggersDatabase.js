const sequelize = require('./database');

async function criarTriggers() {

    await sequelize.query(`
        CREATE OR REPLACE FUNCTION fn_atualizar_conquistas()
        RETURNS TRIGGER AS $$
        BEGIN
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    `);

    await sequelize.query(`
        DROP TRIGGER IF EXISTS trg_badges_concluidos ON "BadgesConcluidos";
        CREATE TRIGGER trg_badges_concluidos
        AFTER INSERT ON "BadgesConcluidos"
        FOR EACH ROW
        EXECUTE FUNCTION fn_atualizar_conquistas();
    `);

    await sequelize.query(`
        DROP TRIGGER IF EXISTS trg_pontos_consultor ON "Consultores";
        CREATE TRIGGER trg_pontos_consultor
        AFTER UPDATE OF total_pontos ON "Consultores"
        FOR EACH ROW
        EXECUTE FUNCTION fn_atualizar_conquistas();
    `);

    console.log('💥 Triggers das Conquistas Criados');
}

module.exports = { criarTriggers };
