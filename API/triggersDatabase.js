const sequelize = require('./database');

async function criarTriggers() {

    await sequelize.query(`

    -- FUNÇÃO PARA ATUALIZAR CONQUISTAS
    CREATE OR REPLACE FUNCTION fn_atualizar_conquistas()
    RETURNS TRIGGER
    AS $$
    DECLARE
        total_badges INT;
        consultor_total_pontos INT;
        consultor_id INT;
        
    BEGIN
        -- ID CONSULTOR
        consultor_id := NEW.id_consultor;

        -- TOTAL BADGES
        SELECT COUNT(*)
        INTO total_badges
        FROM "BadgesConcluidos"
        WHERE id_consultor = consultor_id;

        -- TOTAL PONTOS
        SELECT total_pontos
        INTO consultor_total_pontos
        FROM "Consultores"
        WHERE id_consultor = consultor_id;

        -- CONQUISTAS RELACIONADAS COM BADGES
  
        UPDATE "ConquistasConsultores"
        SET progresso = LEAST(100, FLOOR((total_badges::decimal / 1) * 100))
        WHERE id_consultor = consultor_id
        AND id_conquista = 1;

        UPDATE "ConquistasConsultores"
        SET progresso = LEAST(100, FLOOR((total_badges::decimal / 5) * 100))
        WHERE id_consultor = consultor_id
        AND id_conquista = 2;

        UPDATE "ConquistasConsultores"
        SET progresso = LEAST(100, FLOOR((total_badges::decimal / 10) * 100))
        WHERE id_consultor = consultor_id
        AND id_conquista = 3;

        UPDATE "ConquistasConsultores"
        SET progresso = LEAST(100, FLOOR((total_badges::decimal / 25) * 100))
        WHERE id_consultor = consultor_id
        AND id_conquista = 4;

        UPDATE "ConquistasConsultores"
        SET progresso = LEAST(100, FLOOR((total_badges::decimal / 50) * 100))
        WHERE id_consultor = consultor_id
        AND id_conquista = 5;

        -- CONQUISTAS RELACIONADAS COM PONTOS

        UPDATE "ConquistasConsultores"
        SET progresso = LEAST(100, FLOOR((consultor_total_pontos::decimal / 50) * 100))
        WHERE id_consultor = consultor_id
        AND id_conquista = 6;

        UPDATE "ConquistasConsultores"
        SET progresso = LEAST(100, FLOOR((consultor_total_pontos::decimal / 100) * 100))
        WHERE id_consultor = consultor_id
        AND id_conquista = 7;

        UPDATE "ConquistasConsultores"
        SET progresso = LEAST(100, FLOOR((consultor_total_pontos::decimal / 200) * 100))
        WHERE id_consultor = consultor_id
        AND id_conquista = 8;

        UPDATE "ConquistasConsultores"
        SET progresso = LEAST(100, FLOOR((consultor_total_pontos::decimal / 300) * 100))
        WHERE id_consultor = consultor_id
        AND id_conquista = 9;

        UPDATE "ConquistasConsultores"
        SET progresso = LEAST(100, FLOOR((consultor_total_pontos::decimal / 500) * 100))
        WHERE id_consultor = consultor_id
        AND id_conquista = 10;

        RETURN NEW;

    END;

    $$ LANGUAGE plpgsql;

    `);

    // TRIGGER PARA ATUALIZAR CONQUISTAS QUANDO SE CONQUISTA BADGES
    await sequelize.query(`

    DROP TRIGGER IF EXISTS trg_badges_concluidos ON "BadgesConcluidos";
    CREATE TRIGGER trg_badges_concluidos
    AFTER INSERT
    ON "BadgesConcluidos"
    FOR EACH ROW
    EXECUTE FUNCTION fn_atualizar_conquistas();

    `);

    // TRIGGER PARA ATUALIZAR CONQUISTAS QUANDO SE CONQUISTA PONTOS
    await sequelize.query(`

    DROP TRIGGER IF EXISTS trg_pontos_consultor ON "Consultores";
    CREATE TRIGGER trg_pontos_consultor
    AFTER UPDATE OF total_pontos
    ON "Consultores"
    FOR EACH ROW
    EXECUTE FUNCTION fn_atualizar_conquistas();

    `);

    console.log('Triggers de conquistas criados');
}

module.exports = {criarTriggers};