-- ============================================================
-- SCHEMA: Softinsa API — Criação da Base de Dados
-- Geração automática com base nos modelos Sequelize
-- ============================================================

-- DROP TABLES (ordem inversa — filhos primeiro)
DROP TABLE IF EXISTS Favoritos CASCADE;
DROP TABLE IF EXISTS Enviadas CASCADE;
DROP TABLE IF EXISTS NotificacoesPedidos CASCADE;
DROP TABLE IF EXISTS NotificacoesAdmins CASCADE;
DROP TABLE IF EXISTS HistoricoPedidos CASCADE;
DROP TABLE IF EXISTS Documentacoes CASCADE;
DROP TABLE IF EXISTS PedidosBadges CASCADE;
DROP TABLE IF EXISTS ConquistasConsultores CASCADE;
DROP TABLE IF EXISTS BadgesConcluidos CASCADE;
DROP TABLE IF EXISTS Objetivos CASCADE;
DROP TABLE IF EXISTS Requisitos CASCADE;
DROP TABLE IF EXISTS Badges CASCADE;
DROP TABLE IF EXISTS Conquistas CASCADE;
DROP TABLE IF EXISTS ServiceLineLiders CASCADE;
DROP TABLE IF EXISTS TalentManagers CASCADE;
DROP TABLE IF EXISTS Administradores CASCADE;
DROP TABLE IF EXISTS Consultores CASCADE;
DROP TABLE IF EXISTS Areas CASCADE;
DROP TABLE IF EXISTS ServiceLines CASCADE;
DROP TABLE IF EXISTS LearningPaths CASCADE;
DROP TABLE IF EXISTS Estados CASCADE;
DROP TABLE IF EXISTS Politicas CASCADE;
DROP TABLE IF EXISTS Utilizadores CASCADE;

-- ============================================================
-- 1. Utilizadores
-- ============================================================
CREATE TABLE Utilizadores (
    id_utilizador   SERIAL       PRIMARY KEY,
    nome_utilizador TEXT         NOT NULL,
    email_utilizador TEXT        NOT NULL,
    password_utilizador TEXT     NOT NULL,
    username_utilizador TEXT     NOT NULL,
    tipo_utilizador VARCHAR(2)   NOT NULL,
    imagem_utilizador TEXT       NOT NULL,
    estado_a_i      BOOLEAN      NOT NULL,
    "createdAt"     TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt"     TIMESTAMP WITH TIME ZONE NOT NULL
);

-- ============================================================
-- 2. LearningPaths
-- ============================================================
CREATE TABLE LearningPaths (
    id_learning_path       SERIAL  PRIMARY KEY,
    nome_learning_path     TEXT    NOT NULL,
    descricao_learning_path TEXT   NOT NULL,
    imagem_learning_path   TEXT    NOT NULL,
    estado_a_i             BOOLEAN NOT NULL DEFAULT TRUE,
    data_insercao          TIMESTAMP WITH TIME ZONE NOT NULL,
    "createdAt"            TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt"            TIMESTAMP WITH TIME ZONE NOT NULL
);

-- ============================================================
-- 3. ServiceLines
-- ============================================================
CREATE TABLE ServiceLines (
    id_service_line        SERIAL  PRIMARY KEY,
    id_learning_path       INTEGER NOT NULL REFERENCES LearningPaths(id_learning_path),
    nome_service_line      TEXT    NOT NULL,
    descricao_service_line TEXT    NOT NULL,
    imagem_service_line    TEXT    NOT NULL,
    estado_a_i             BOOLEAN NOT NULL,
    data_insercao          TIMESTAMP WITH TIME ZONE NOT NULL,
    "createdAt"            TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt"            TIMESTAMP WITH TIME ZONE NOT NULL
);

-- ============================================================
-- 4. Areas
-- ============================================================
CREATE TABLE Areas (
    id_area          SERIAL  PRIMARY KEY,
    id_service_line  INTEGER NOT NULL REFERENCES ServiceLines(id_service_line),
    nome_area        TEXT    NOT NULL,
    descricao_area   TEXT    NOT NULL,
    imagem_area      TEXT    NOT NULL,
    estado_a_i       BOOLEAN NOT NULL,
    data_insercao    TIMESTAMP WITH TIME ZONE NOT NULL,
    "createdAt"      TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt"      TIMESTAMP WITH TIME ZONE NOT NULL
);

-- ============================================================
-- 5. Consultores
-- ============================================================
CREATE TABLE Consultores (
    id_consultor    SERIAL  PRIMARY KEY,
    id_utilizador   INTEGER NOT NULL REFERENCES Utilizadores(id_utilizador),
    total_pontos    INTEGER,
    id_area         INTEGER NOT NULL REFERENCES Areas(id_area),
    "createdAt"     TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt"     TIMESTAMP WITH TIME ZONE NOT NULL
);

-- ============================================================
-- 6. Administradores
-- ============================================================
CREATE TABLE Administradores (
    id_administrador SERIAL  PRIMARY KEY,
    id_utilizador    INTEGER NOT NULL REFERENCES Utilizadores(id_utilizador),
    "createdAt"      TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt"      TIMESTAMP WITH TIME ZONE NOT NULL
);

-- ============================================================
-- 7. TalentManagers
-- ============================================================
CREATE TABLE TalentManagers (
    id_talent_manager SERIAL  PRIMARY KEY,
    id_utilizador     INTEGER NOT NULL REFERENCES Utilizadores(id_utilizador),
    "createdAt"       TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt"       TIMESTAMP WITH TIME ZONE NOT NULL
);

-- ============================================================
-- 8. ServiceLineLiders
-- ============================================================
CREATE TABLE ServiceLineLiders (
    id_service_line_lider SERIAL  PRIMARY KEY,
    id_utilizador         INTEGER NOT NULL REFERENCES Utilizadores(id_utilizador),
    id_service_line       INTEGER NOT NULL REFERENCES ServiceLines(id_service_line),
    "createdAt"           TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt"           TIMESTAMP WITH TIME ZONE NOT NULL
);

-- ============================================================
-- 9. Badges
-- ============================================================
CREATE TABLE Badges (
    id_badge         SERIAL       PRIMARY KEY,
    id_area          INTEGER      NOT NULL REFERENCES Areas(id_area),
    nome_badge       TEXT         NOT NULL,
    descricao_badge  TEXT         NOT NULL,
    pontos_badge     INTEGER      NOT NULL,
    pago             BOOLEAN      NOT NULL,
    nivel_badge      VARCHAR(25)  NOT NULL,
    imagem_badge     TEXT         NOT NULL,
    sla              INTEGER      NOT NULL,
    validade         INTEGER      NOT NULL,
    estado_a_i       BOOLEAN      NOT NULL,
    data_insercao    TIMESTAMP WITH TIME ZONE NOT NULL,
    "createdAt"      TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt"      TIMESTAMP WITH TIME ZONE NOT NULL
);

-- ============================================================
-- 10. Conquistas
-- ============================================================
CREATE TABLE Conquistas (
    id_conquista       SERIAL  PRIMARY KEY,
    descricao_conquista TEXT   NOT NULL,
    pontos_conquista   INTEGER NOT NULL,
    imagem_conquista   TEXT    NOT NULL,
    estado_a_i         BOOLEAN NOT NULL,
    data_insercao      TIMESTAMP WITH TIME ZONE NOT NULL,
    "createdAt"        TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt"        TIMESTAMP WITH TIME ZONE NOT NULL
);

-- ============================================================
-- 11. Estados
-- ============================================================
CREATE TABLE Estados (
    id_estado      SERIAL  PRIMARY KEY,
    nome_estado    TEXT    NOT NULL,
    descricao_estado TEXT  NOT NULL,
    "createdAt"    TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt"    TIMESTAMP WITH TIME ZONE NOT NULL
);

-- ============================================================
-- 12. Requisitos
-- ============================================================
CREATE TABLE Requisitos (
    id_requisito      SERIAL  PRIMARY KEY,
    id_badge          INTEGER NOT NULL REFERENCES Badges(id_badge),
    nome_requisito    TEXT    NOT NULL,
    descricao_requisito TEXT,
    imagem_requisito  TEXT,
    data_insercao     TIMESTAMP WITH TIME ZONE NOT NULL,
    estado_a_i        BOOLEAN NOT NULL,
    "createdAt"       TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt"       TIMESTAMP WITH TIME ZONE NOT NULL
);

-- ============================================================
-- 13. Objetivos
-- ============================================================
CREATE TABLE Objetivos (
    id_objetivo              SERIAL  PRIMARY KEY,
    id_badge                 INTEGER NOT NULL REFERENCES Badges(id_badge),
    id_consultor             INTEGER NOT NULL REFERENCES Consultores(id_consultor),
    data_limite_conclusao    TIMESTAMP WITH TIME ZONE NOT NULL,
    nome_objetivo            TEXT    NOT NULL,
    data_conclusao_objetivo  TIMESTAMP WITH TIME ZONE,
    estado_objetivo          TEXT    NOT NULL,
    "createdAt"              TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt"              TIMESTAMP WITH TIME ZONE NOT NULL
);

-- ============================================================
-- 14. BadgesConcluidos
-- ============================================================
CREATE TABLE BadgesConcluidos (
    id_badge_concluido     SERIAL  PRIMARY KEY,
    id_badge               INTEGER NOT NULL REFERENCES Badges(id_badge),
    id_consultor           INTEGER NOT NULL REFERENCES Consultores(id_consultor),
    data_conclusao_badge   TIMESTAMP WITH TIME ZONE NOT NULL,
    url_validacao          TEXT    NOT NULL,
    "createdAt"            TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt"            TIMESTAMP WITH TIME ZONE NOT NULL
);

-- ============================================================
-- 15. ConquistasConsultores
-- ============================================================
CREATE TABLE ConquistasConsultores (
    id_conquista_consultor SERIAL  PRIMARY KEY,
    id_consultor           INTEGER NOT NULL REFERENCES Consultores(id_consultor),
    id_conquista           INTEGER NOT NULL REFERENCES Conquistas(id_conquista),
    progresso              INTEGER NOT NULL,
    "createdAt"            TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt"            TIMESTAMP WITH TIME ZONE NOT NULL
);

-- ============================================================
-- 16. PedidosBadges
-- ============================================================
CREATE TABLE PedidosBadges (
    id_pedido_badge      SERIAL  PRIMARY KEY,
    id_consultor         INTEGER NOT NULL REFERENCES Consultores(id_consultor),
    id_talent_manager    INTEGER NOT NULL REFERENCES TalentManagers(id_talent_manager),
    id_service_line_lider INTEGER NOT NULL REFERENCES ServiceLineLiders(id_service_line_lider),
    id_badge             INTEGER NOT NULL REFERENCES Badges(id_badge),
    estado_atual         INTEGER NOT NULL REFERENCES Estados(id_estado),
    "createdAt"          TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt"          TIMESTAMP WITH TIME ZONE NOT NULL
);

-- ============================================================
-- 17. Documentacoes
-- ============================================================
CREATE TABLE Documentacoes (
    id_documentacao  SERIAL  PRIMARY KEY,
    id_historico     INTEGER NOT NULL REFERENCES HistoricoPedidos(id_historico),
    id_consultor     INTEGER NOT NULL REFERENCES Consultores(id_consultor),
    id_requisito     INTEGER REFERENCES Requisitos(id_requisito),
    documentacao     TEXT    NOT NULL,
    "createdAt"      TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt"      TIMESTAMP WITH TIME ZONE NOT NULL
);

-- ============================================================
-- 18. HistoricoPedidos
-- ============================================================
CREATE TABLE HistoricoPedidos (
    id_historico     SERIAL  PRIMARY KEY,
    id_estado        INTEGER NOT NULL REFERENCES Estados(id_estado),
    id_pedido_badge  INTEGER NOT NULL REFERENCES PedidosBadges(id_pedido_badge),
    data             TIMESTAMP WITH TIME ZONE NOT NULL,
    "createdAt"      TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt"      TIMESTAMP WITH TIME ZONE NOT NULL
);

-- ============================================================
-- 19. NotificacoesAdmins
-- ============================================================
CREATE TABLE NotificacoesAdmins (
    id_notificacao_admin SERIAL  PRIMARY KEY,
    id_administrador     INTEGER NOT NULL REFERENCES Administradores(id_administrador),
    notificacao          TEXT,
    "createdAt"          TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt"          TIMESTAMP WITH TIME ZONE NOT NULL
);

-- ============================================================
-- 20. NotificacoesPedidos
-- ============================================================
CREATE TABLE NotificacoesPedidos (
    id_notificacao_pedido  SERIAL  PRIMARY KEY,
    id_consultor           INTEGER NOT NULL REFERENCES Consultores(id_consultor),
    id_pedido_badge        INTEGER NOT NULL REFERENCES PedidosBadges(id_pedido_badge),
    justificacao           TEXT,
    data_envio_notificacao TIMESTAMP WITH TIME ZONE NOT NULL,
    "createdAt"            TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt"            TIMESTAMP WITH TIME ZONE NOT NULL
);

-- ============================================================
-- 21. Enviadas
-- ============================================================
CREATE TABLE Enviadas (
    id_notificacao_admin INTEGER NOT NULL REFERENCES NotificacoesAdmins(id_notificacao_admin),
    id_utilizador        INTEGER NOT NULL REFERENCES Utilizadores(id_utilizador),
    "createdAt"          TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt"          TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY (id_notificacao_admin, id_utilizador)
);

-- ============================================================
-- 22. Favoritos
-- ============================================================
CREATE TABLE Favoritos (
    id_consultor INTEGER NOT NULL REFERENCES Consultores(id_consultor),
    id_badge     INTEGER NOT NULL REFERENCES Badges(id_badge),
    "createdAt"  TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt"  TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY (id_consultor, id_badge)
);

-- ============================================================
-- 23. Politicas
-- ============================================================
CREATE TABLE Politicas (
    id_politica     SERIAL  PRIMARY KEY,
    id_administrador INTEGER NOT NULL REFERENCES Administradores(id_administrador),
    politica        TEXT    NOT NULL,
    "createdAt"     TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt"     TIMESTAMP WITH TIME ZONE NOT NULL
);
