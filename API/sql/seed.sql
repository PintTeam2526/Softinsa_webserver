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
('Admin Softinsa',    'admin@softinsa.pt',    '$2b$10$q7grLZi3EFDNK7Bvf2PfneKAmguswEADXPe8IhJOpYNzUwIjtpWca',  'admin',    'a', 'img-admin', TRUE, NOW(), NOW()),
('Talent Manager A',  'tm@softinsa.pt',       '$2b$10$FDHqgkwHpCZ9qeZ2k5jI9.04EC.IJC/p7hJiNRwMG7swcs1R.U98S',  'tm',       't', 'img-tm',    TRUE, NOW(), NOW()),
('Service Line Leader','sl@softinsa.pt',      '$2b$10$FDHqgkwHpCZ9qeZ2k5jI9.04EC.IJC/p7hJiNRwMG7swcs1R.U98S',  'sl',       's', 'img-sl',    TRUE, NOW(), NOW()),
('João Consultor',    'consultor1@softinsa.pt','$2b$10$aPmmoiRP5J6giFUDeOEsgec2ZTotulMnpuBxkFUXBH0FyYrXWQaR.', 'joao.co',  'c', 'img-joao',  TRUE, NOW(), NOW()),
('Maria Consultora',  'consultor2@softinsa.pt','$2b$10$aPmmoiRP5J6giFUDeOEsgec2ZTotulMnpuBxkFUXBH0FyYrXWQaR.', 'maria.co', 'c', 'img-maria', TRUE, NOW(), NOW());

-- ============================================================
-- 2. LearningPaths
-- ============================================================
INSERT INTO "LearningPaths" (nome_learning_path, descricao_learning_path, imagem_learning_path, estado_a_i, data_insercao) VALUES
('Base de Dados',      'Trilha de aprendizagem em Base de Dados',    'img-lp-db',  TRUE, '2025-01-01'),
('Programação Web',    'Trilha de aprendizagem em Programação Web',  'img-lp-web', TRUE, '2025-01-01'),
('Cloud Computing',    'Trilha de aprendizagem em Cloud Computing',  'img-lp-cloud', TRUE, '2025-01-01');

-- ============================================================
-- 3. ServiceLines
-- ============================================================
INSERT INTO "ServiceLines" (id_learning_path, nome_service_line, descricao_service_line, imagem_service_line, estado_a_i, data_insercao) VALUES
(1, 'Suporte a Base de Dados',  'Suporte e administração de bases de dados',   'img-sl-db',     TRUE, '2025-01-01'),
(2, 'Desenvolvimento Web',      'Desenvolvimento de aplicações web',           'img-sl-web',    TRUE, '2025-01-01'),
(3, 'Arquitetura Cloud',        'Arquitetura e serviços cloud',                'img-sl-cloud',  TRUE, '2025-01-01');

-- ============================================================
-- 4. Areas
-- ============================================================
INSERT INTO "Areas" (id_service_line, nome_area, descricao_area, imagem_area, estado_a_i, data_insercao) VALUES
(1, 'SQL',        'Base de Dados Relacionais',     'img-area-sql',     TRUE, '2025-01-01'),
(1, 'NoSQL',      'Base de Dados Não Relacionais', 'img-area-nosql',   TRUE, '2025-01-01'),
(2, 'Frontend',   'Desenvolvimento Frontend',      'img-area-front',   TRUE, '2025-01-01'),
(2, 'Backend',    'Desenvolvimento Backend',       'img-area-back',    TRUE, '2025-01-01'),
(3, 'AWS',        'Serviços Amazon Web Services',  'img-area-aws',     TRUE, '2025-01-01');

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
INSERT INTO "TalentManagers" (id_utilizador) VALUES
(2);

-- ============================================================
-- 8. ServiceLineLiders
-- ============================================================
INSERT INTO "ServiceLineLiders" (id_utilizador, id_service_line) VALUES
(3, 1);

-- ============================================================
-- 9. Badges
-- ============================================================
INSERT INTO "Badges" (id_area, nome_badge, descricao_badge, pontos_badge, pago, nivel_badge, imagem_badge, sla, validade, estado_a_i, data_insercao) VALUES
(1, 'SQL Básico',       'Conceitos fundamentais de SQL',          100, FALSE, 'junior',  'img-badge-sql-bas',     30, 365, TRUE, '2025-01-01'),
(1, 'SQL Avançado',     'Consultas complexas e optimização',      200, TRUE,  'senior',  'img-badge-sql-avanc',   45, 365, TRUE, '2025-01-01'),
(3, 'React Fundamentos','Componentes e estado em React',          150, FALSE, 'junior',  'img-badge-react',       30, 365, TRUE, '2025-01-01'),
(4, 'Node.js API',      'Criação de APIs com Node.js',            180, FALSE, 'pleno',   'img-badge-node',        30, 365, TRUE, '2025-01-01'),
(5, 'AWS Practitioner', 'Fundamentos AWS Cloud Practitioner',     250, TRUE,  'junior',  'img-badge-aws',         60, 730, TRUE, '2025-01-01');

-- ============================================================
-- 10. Conquistas
-- ============================================================
INSERT INTO "Conquistas" (descricao_conquista, pontos_conquista, imagem_conquista, estado_a_i, data_insercao) VALUES
('Primeiro Badge Concluído',  50, 'img-conquista-primeiro', TRUE, '2025-01-01'),
('Cinco Badges Concluídos',  200, 'img-conquista-cinco',   TRUE, '2025-01-01'),
('Colecionador Nível 1',     100, 'img-conquista-colecao', TRUE, '2025-01-01');

-- ============================================================
-- 12. Requisitos (Estados é populado pelo afterSync hook no model)
-- ============================================================
INSERT INTO "Requisitos" (id_badge, nome_requisito, descricao_requisito, imagem_requisito, data_insercao, estado_a_i) VALUES
(1, 'SELECT',     'Saber fazer consultas SELECT',     NULL, '2025-01-01', TRUE),
(1, 'JOIN',       'Saber fazer JOIN entre tabelas',   NULL, '2025-01-01', TRUE),
(2, 'Subqueries', 'Dominar subqueries',                NULL, '2025-01-01', TRUE),
(2, 'Índices',    'Criar e optimizar índices',        NULL, '2025-01-01', TRUE),
(3, 'JSX',        'Escrever componentes com JSX',     NULL, '2025-01-01', TRUE),
(3, 'Hooks',      'Utilizar useState e useEffect',    NULL, '2025-01-01', TRUE),
(4, 'Express',    'Configurar servidor Express',      NULL, '2025-01-01', TRUE),
(4, 'Rotas',      'Definir rotas e middlewares',      NULL, '2025-01-01', TRUE),
(5, 'IAM',        'Gerir identidades e acessos AWS',  NULL, '2025-01-01', TRUE),
(5, 'S3',         'Armazenamento S3',                 NULL, '2025-01-01', TRUE);

-- ============================================================
-- 13. Objetivos
-- ============================================================
INSERT INTO "Objetivos" (id_badge, id_consultor, data_limite_conclusao, nome_objetivo, data_conclusao_objetivo, estado_objetivo) VALUES
(1, 1, '2025-06-30', 'Completar SQL Básico', NULL, 'em_andamento'),
(3, 2, '2025-07-15', 'Aprender React',       NULL, 'em_andamento');

-- ============================================================
-- 14. BadgesConcluidos
-- ============================================================
INSERT INTO "BadgesConcluidos" (id_badge, id_consultor, data_limite_conclusao, data_conclusao_badge, url_validacao) VALUES
(1, 1, '2025-03-01', '2025-02-15', 'https://certificacoes.softinsa.pt/sql-basico-joao'),
(3, 2, '2025-04-01', '2025-03-20', 'https://certificacoes.softinsa.pt/react-maria');

-- ============================================================
-- 15. ConquistasConsultores
-- ============================================================
INSERT INTO "ConquistasConsultores" (id_consultor, id_conquista, progresso) VALUES
(1, 1, 100),
(2, 1, 100);

-- ============================================================
-- 16. PedidosBadges
-- ============================================================
INSERT INTO "PedidosBadges" (id_consultor, id_talent_manager, id_service_line_lider, id_badge, estado_atual) VALUES
(1, 1, 1, 2, 1),
(2, 1, 1, 4, 4);

-- ============================================================
-- 17. Documentacoes
-- ============================================================
INSERT INTO "Documentacoes" (id_pedido_badge, id_consultor, documentacao, validado) VALUES
(1, 1, 'Certificado SQL Avançado - João', NULL),
(2, 2, 'Repositório GitHub com API Node.js', TRUE);

-- ============================================================
-- 18. HistoricoPedidos
-- ============================================================
INSERT INTO "HistoricoPedidos" (id_estado, id_pedido_badge, data, estado_objetivo) VALUES
(1, 1, '2025-02-01', 'Pedido criado'),
(4, 2, '2025-03-15', 'Pedido aprovado');

-- ============================================================
-- 19. NotificacoesAdmins
-- ============================================================
INSERT INTO "NotificacoesAdmins" (id_administrador, notificacao) VALUES
(1, 'Novo badge solicitado para aprovação');

-- ============================================================
-- 20. NotificacoesPedidos
-- ============================================================
INSERT INTO "NotificacoesPedidos" (id_consultor, id_pedido_badge, justificacao, data_envio_notificacao) VALUES
(1, 1, 'Pedido atribuído ao Talent Manager.', '2025-02-01');

-- ============================================================
-- 21. Enviadas
-- ============================================================
INSERT INTO "Enviadas" (id_notificacao_admin, id_utilizador) VALUES
(1, 1);

-- ============================================================
-- 22. Favoritos
-- ============================================================
INSERT INTO "Favoritos" (id_consultor, id_badge) VALUES
(1, 3),
(2, 5);

-- ============================================================
-- 23. Politicas
-- ============================================================
INSERT INTO "Politicas" (id_administrador, politica, "createdAt", "updatedAt") VALUES
(1, 'Política de privacidade e proteção de dados v1.0', NOW(), NOW());
