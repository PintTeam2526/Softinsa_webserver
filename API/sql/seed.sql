-- ============================================================
-- SEED: Softinsa API — Dados Placeholder
-- Passwords hashed com bcrypt (cost=10)
-- ============================================================

-- ============================================================
-- 1. Utilizadores
-- Password hashes (bcrypt, cost=10):
--   "123456"     -> $2b$10$aPmmoiRP5J6giFUDeOEsgec2ZTotulMnpuBxkFUXBH0FyYrXWQaR.
--   "admin123"   -> $2b$10$q7grLZi3EFDNK7Bvf2PfneKAmguswEADXPe8IhJOpYNzUwIjtpWca
--   "password123" -> $2b$10$FDHqgkwHpCZ9qeZ2k5jI9.04EC.IJC/p7hJiNRwMG7swcs1R.U98S
-- ============================================================
INSERT INTO "Utilizadores" (nome_utilizador, email_utilizador, password_utilizador, username_utilizador, tipo_utilizador, imagem_utilizador, estado_a_i, "createdAt", "updatedAt") VALUES
('Admin Softinsa',    'admin@softinsa.pt',    '$2b$10$q7grLZi3EFDNK7Bvf2PfneKAmguswEADXPe8IhJOpYNzUwIjtpWca',  'admin',    'a', 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', TRUE, NOW(), NOW()),
('Talent Manager A',  'tm@softinsa.pt',       '$2b$10$FDHqgkwHpCZ9qeZ2k5jI9.04EC.IJC/p7hJiNRwMG7swcs1R.U98S',  'tm',       't', 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=',    TRUE, NOW(), NOW()),
('Service Line Leader','sl@softinsa.pt',      '$2b$10$FDHqgkwHpCZ9qeZ2k5jI9.04EC.IJC/p7hJiNRwMG7swcs1R.U98S',  'sl',       's', 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=',    TRUE, NOW(), NOW()),
('João Consultor',    'consultor1@softinsa.pt','$2b$10$aPmmoiRP5J6giFUDeOEsgec2ZTotulMnpuBxkFUXBH0FyYrXWQaR.', 'joao.co',  'c', 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=',  TRUE, NOW(), NOW()),
('Maria Consultora',  'consultor2@softinsa.pt','$2b$10$aPmmoiRP5J6giFUDeOEsgec2ZTotulMnpuBxkFUXBH0FyYrXWQaR.', 'maria.co', 'c', 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', TRUE, NOW(), NOW());

-- ============================================================
-- 2. LearningPaths
-- ============================================================
INSERT INTO "LearningPaths" (nome_learning_path, descricao_learning_path, imagem_learning_path, estado_a_i, data_insercao, "createdAt", "updatedAt") VALUES
('Base de Dados',      'Trilha de aprendizagem em Base de Dados',    'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=',  TRUE, '2025-01-01', NOW(), NOW()),
('Programação Web',    'Trilha de aprendizagem em Programação Web',  'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', TRUE, '2025-01-01', NOW(), NOW()),
('Cloud Computing',    'Trilha de aprendizagem em Cloud Computing',  'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', TRUE, '2025-01-01', NOW(), NOW());

-- ============================================================
-- 3. ServiceLines
-- ============================================================
INSERT INTO "ServiceLines" (id_learning_path, nome_service_line, descricao_service_line, imagem_service_line, estado_a_i, data_insercao, "createdAt", "updatedAt") VALUES
(1, 'Suporte a Base de Dados',  'Suporte e administração de bases de dados',   'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=',     TRUE, '2025-01-01', NOW(), NOW()),
(2, 'Desenvolvimento Web',      'Desenvolvimento de aplicações web',           'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=',    TRUE, '2025-01-01', NOW(), NOW()),
(3, 'Arquitetura Cloud',        'Arquitetura e serviços cloud',                'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=',  TRUE, '2025-01-01', NOW(), NOW());

-- ============================================================
-- 4. Areas
-- ============================================================
INSERT INTO "Areas" (id_service_line, nome_area, descricao_area, imagem_area, estado_a_i, data_insercao, "createdAt", "updatedAt") VALUES
(1, 'SQL',        'Base de Dados Relacionais',     'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=',     TRUE, '2025-01-01', NOW(), NOW()),
(1, 'NoSQL',      'Base de Dados Não Relacionais', 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=',   TRUE, '2025-01-01', NOW(), NOW()),
(2, 'Frontend',   'Desenvolvimento Frontend',      'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=',   TRUE, '2025-01-01', NOW(), NOW()),
(2, 'Backend',    'Desenvolvimento Backend',       'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=',    TRUE, '2025-01-01', NOW(), NOW()),
(3, 'AWS',        'Serviços Amazon Web Services',  'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=',     TRUE, '2025-01-01', NOW(), NOW());

-- ============================================================
-- 5. Consultores
-- ============================================================
INSERT INTO "Consultores" (id_utilizador, total_pontos, id_area, "createdAt", "updatedAt") VALUES
(4, 150, 3, NOW(), NOW()),
(5, 200, 4, NOW(), NOW());

-- ============================================================
-- 6. Administradores
-- ============================================================
INSERT INTO "Administradores" (id_utilizador, "createdAt", "updatedAt") VALUES
(1, NOW(), NOW());

-- ============================================================
-- 7. TalentManagers
-- ============================================================
INSERT INTO "TalentManagers" (id_utilizador, "createdAt", "updatedAt") VALUES
(2, NOW(), NOW());

-- ============================================================
-- 8. ServiceLineLiders
-- ============================================================
INSERT INTO "ServiceLineLiders" (id_utilizador, id_service_line, "createdAt", "updatedAt") VALUES
(3, 1, NOW(), NOW());

-- ============================================================
-- 9. Badges
-- ============================================================
INSERT INTO "Badges" (id_area, nome_badge, descricao_badge, pontos_badge, pago, nivel_badge, imagem_badge, sla, validade, estado_a_i, data_insercao, "createdAt", "updatedAt") VALUES
(1, 'SQL Básico',       'Conceitos fundamentais de SQL',          100, FALSE, 'junior',  'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=',     30, 365, TRUE, '2025-01-01', NOW(), NOW()),
(1, 'SQL Avançado',     'Consultas complexas e optimização',      200, TRUE,  'senior',  'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=',   45, 365, TRUE, '2025-01-01', NOW(), NOW()),
(3, 'React Fundamentos','Componentes e estado em React',          150, FALSE, 'junior',  'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=',       30, 365, TRUE, '2025-01-01', NOW(), NOW()),
(4, 'Node.js API',      'Criação de APIs com Node.js',            180, FALSE, 'pleno',   'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=',        30, 365, TRUE, '2025-01-01', NOW(), NOW()),
(5, 'AWS Practitioner', 'Fundamentos AWS Cloud Practitioner',     250, TRUE,  'junior',  'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=',         60, 730, TRUE, '2025-01-01', NOW(), NOW());

-- ============================================================
-- 10. Conquistas
-- ============================================================
INSERT INTO "Conquistas" (descricao_conquista, pontos_conquista, imagem_conquista, estado_a_i, data_insercao, "createdAt", "updatedAt") VALUES
('Primeiro Badge Concluído',  50, 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', TRUE, '2025-01-01', NOW(), NOW()),
('Cinco Badges Concluídos',  200, 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=',   TRUE, '2025-01-01', NOW(), NOW()),
('Colecionador Nível 1',     100, 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', TRUE, '2025-01-01', NOW(), NOW());

-- ============================================================
-- 11. Requisitos
-- ============================================================
INSERT INTO "Requisitos" (id_badge, nome_requisito, descricao_requisito, imagem_requisito, data_insercao, estado_a_i, "createdAt", "updatedAt") VALUES
(1, 'SELECT',     'Saber fazer consultas SELECT',     'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(1, 'JOIN',       'Saber fazer JOIN entre tabelas',   'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(2, 'Subqueries', 'Dominar subqueries',               'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(2, 'Índices',    'Criar e optimizar índices',        'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(3, 'JSX',        'Escrever componentes com JSX',     'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(3, 'Hooks',      'Utilizar useState e useEffect',    'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(4, 'Express',    'Configurar servidor Express',      'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(4, 'Rotas',      'Definir rotas e middlewares',      'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(5, 'IAM',        'Gerir identidades e acessos AWS',  'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(5, 'S3',         'Armazenamento S3',                 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW());

-- ============================================================
-- 12. Objetivos
-- ============================================================
INSERT INTO "Objetivos" (id_badge, id_consultor, data_limite_conclusao, nome_objetivo, data_conclusao_objetivo, estado_objetivo, "createdAt", "updatedAt") VALUES
(1, 1, '2025-06-30', 'Completar SQL Básico', NULL, 'em_andamento', NOW(), NOW()),
(3, 2, '2025-07-15', 'Aprender React',       NULL, 'em_andamento', NOW(), NOW());

-- ============================================================
-- 13. BadgesConcluidos
-- ============================================================
INSERT INTO "BadgesConcluidos" (id_badge, id_consultor, data_conclusao_badge, url_validacao, "createdAt", "updatedAt") VALUES
(1, 1, '2025-02-15', 'https://certificacoes.softinsa.pt/sql-basico-joao', NOW(), NOW()),
(3, 2, '2025-03-20', 'https://certificacoes.softinsa.pt/react-maria', NOW(), NOW());

-- ============================================================
-- 14. ConquistasConsultores
-- ============================================================
INSERT INTO "ConquistasConsultores" (id_consultor, id_conquista, progresso, "createdAt", "updatedAt") VALUES
(1, 1, 100, NOW(), NOW()),
(2, 1, 100, NOW(), NOW());

-- ============================================================
-- 15. PedidosBadges
-- ============================================================
INSERT INTO "PedidosBadges" (id_consultor, id_talent_manager, id_service_line_lider, id_badge, estado_atual, "createdAt", "updatedAt") VALUES
(1, 1, 1, 2, 1, NOW(), NOW()),  -- Pedido 1: João candidata-se a SQL Avançado (em avaliação TM)
(2, 1, 1, 4, 4, NOW(), NOW());  -- Pedido 2: Maria candidata-se a Node.js API (aprovado SL)

-- ============================================================
-- 16. HistoricoPedidos
-- Nota: inserido ANTES de Documentacoes por dependência de FK.
--
-- Pedido 1 (João / SQL Avançado):
--   Entrada 1 — submissão inicial
--
-- Pedido 2 (Maria / Node.js API):
--   Entrada 2 — submissão inicial
--   Entrada 3 — avaliação aprovada pelo Talent Manager
--   Entrada 4 — avaliação aprovada pelo Service Line Leader
-- ============================================================
INSERT INTO "HistoricoPedidos" (id_estado, id_pedido_badge, data, "createdAt", "updatedAt") VALUES
-- Pedido 1: submissão inicial de João
(1, 1, '2025-02-01', NOW(), NOW()),

-- Pedido 2: ciclo completo de Maria
(1, 2, '2025-03-01', NOW(), NOW()),
(2, 2, '2025-03-10', NOW(), NOW()),
(4, 2, '2025-03-15', NOW(), NOW());

-- ============================================================
-- 17. Documentacoes
-- Nota: referencia agora id_historico (FK para HistoricoPedidos)
--       em vez de id_pedido_badge.
--
-- Os IDs de HistoricoPedidos assumem inserção sequencial:
--   id 1 → submissão do Pedido 1 (João)
--   id 2 → submissão do Pedido 2 (Maria)
--   id 3 → avaliação TM do Pedido 2
--   id 4 → avaliação SL do Pedido 2
--
-- Apenas entradas de tipo submissao/reenvio transportam documentos;
-- entradas de avaliação não têm documentos associados.
-- ============================================================
INSERT INTO "Documentacoes" (id_historico, id_consultor, id_requisito, documentacao, "createdAt", "updatedAt") VALUES
-- Submissão inicial do Pedido 1 — João envia certificado para requisito "Subqueries" (id 3)
(1, 1, 3, 'Certificado SQL Avançado - João',  NOW(), NOW()),

-- Submissão inicial do Pedido 2 — Maria envia repositório para requisito "Express" (id 7)
(2, 2, 7, 'Repositório GitHub com API Node.js', NOW(), NOW());

-- ============================================================
-- 18. NotificacoesAdmins
-- ============================================================
INSERT INTO "NotificacoesAdmins" (id_administrador, notificacao, "createdAt", "updatedAt") VALUES
(1, 'Novo badge solicitado para aprovação', NOW(), NOW());

-- ============================================================
-- 19. NotificacoesPedidos
-- ============================================================
INSERT INTO "NotificacoesPedidos" (id_consultor, id_pedido_badge, justificacao, data_envio_notificacao, "createdAt", "updatedAt") VALUES
(1, 1, 'Pedido atribuído ao Talent Manager.', '2025-02-01', NOW(), NOW());

-- ============================================================
-- 20. Enviadas
-- ============================================================
INSERT INTO "Enviadas" (id_notificacao_admin, id_utilizador, "createdAt", "updatedAt") VALUES
(1, 1, NOW(), NOW());

-- ============================================================
-- 21. Favoritos
-- ============================================================
INSERT INTO "Favoritos" (id_consultor, id_badge, "createdAt", "updatedAt") VALUES
(1, 3, NOW(), NOW()),
(2, 5, NOW(), NOW());

-- ============================================================
-- 22. Politicas
-- ============================================================
INSERT INTO "Politicas" (id_administrador, politica, "createdAt", "updatedAt") VALUES
(1, 'Política de privacidade e proteção de dados v1.0', NOW(), NOW());
