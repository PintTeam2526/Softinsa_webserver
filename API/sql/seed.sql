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
('Jornada Técnica',      'Percurso de aprendizagem focado em competências técnicas, abrangendo Cloud, OutSystems, DevOps e gestão de serviços de IT.',    'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=',  TRUE, '2025-01-01', NOW(), NOW()),
('Power Skills',    'Percurso de desenvolvimento de competências comportamentais e de liderança, focado em comunicação profissional e liderança de equipas.',  'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', TRUE, '2025-01-01', NOW(), NOW());

-- ============================================================
-- 3. ServiceLines
-- ============================================================
INSERT INTO "ServiceLines" (id_learning_path, nome_service_line, descricao_service_line, imagem_service_line, estado_a_i, data_insercao, "createdAt", "updatedAt") VALUES
(1, 'Hybrid Cloud',  'Soluções híbridas de cloud que abrangem desenvolvimento LowCode em OutSystems, infraestrutura cloud e plataformas de containers e Kubernetes.',   'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=',     TRUE, '2025-01-01', NOW(), NOW()),
(1, 'Application Operations',   'Operação contínua de aplicações com práticas DevOps, monitorização, observabilidade e gestão de serviços de IT (ITSM).',           'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=',    TRUE, '2025-01-01', NOW(), NOW()),
(2, 'Leadership & Communication',  'Service line dedicada ao desenvolvimento de competências de liderança e de comunicação profissional dos consultores.',     'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=',  TRUE, '2025-01-01', NOW(), NOW());

-- ============================================================
-- 4. Areas
-- ============================================================
INSERT INTO "Areas" (id_service_line, nome_area, descricao_area, imagem_area, estado_a_i, data_insercao, "createdAt", "updatedAt") VALUES
(1, 'LowCode (OutSystems)',       'Desenvolvimento aplicacional em OutSystems, desde aplicações reativas até arquitetura e liderança técnica de soluções LowCode.', 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', TRUE, '2025-01-01', NOW(), NOW()),
(1, 'Cloud Infrastructure',       'Conceção e gestão de infraestrutura cloud — máquinas virtuais, redes, containers e automação de provisionamento.',                  'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', TRUE, '2025-01-01', NOW(), NOW()),
(1, 'Kubernetes & Containers',    'Orquestração de containers com Kubernetes, incluindo CI/CD, segurança de clusters e engenharia de plataforma.',                   'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', TRUE, '2025-01-01', NOW(), NOW()),
(2, 'DevOps',                     'Práticas de DevOps e DevSecOps — CI/CD, Infrastructure as Code, automação e arquitetura de automação.',                            'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', TRUE, '2025-01-01', NOW(), NOW()),
(2, 'Monitoring & Observability', 'Monitorização e observabilidade de aplicações — gestão de logs, métricas, otimização de performance e arquitetura de observabilidade.', 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', TRUE, '2025-01-01', NOW(), NOW()),
(2, 'IT Service Management',      'Gestão de serviços de IT segundo ITSM — gestão de incidentes, problemas, mudanças e operações de serviço.',                        'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', TRUE, '2025-01-01', NOW(), NOW()),
(3, 'Communication Skills',       'Competências de comunicação profissional — apresentação, comunicação com stakeholders e resolução de conflitos.',                   'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', TRUE, '2025-01-01', NOW(), NOW()),
(3, 'Leadership',                 'Competências de liderança — coordenação de equipas, tomada de decisão e liderança estratégica e organizacional.',                   'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', TRUE, '2025-01-01', NOW(), NOW());

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
-- Área 1: LowCode (OutSystems)
(1, 'OutSystems Foundations',        'Fundamentos da plataforma OutSystems — conceitos base, entidades e desenvolvimento de aplicações simples.',           10,  FALSE, 'Júnior',                'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 30, 365, TRUE, '2025-01-01', NOW(), NOW()),
(1, 'Reactive Development',          'Desenvolvimento de aplicações reativas em OutSystems com UI responsiva e componentes dinâmicos.',                   25,  TRUE,  'Intermédio',            'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 45, 365, TRUE, '2025-01-01', NOW(), NOW()),
(1, 'Architecture Specialist',       'Arquitetura de soluções OutSystems — modularidade, boas práticas e escalabilidade.',                                 50,  FALSE, 'Sénior',                'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 30, 365, TRUE, '2025-01-01', NOW(), NOW()),
(1, 'Integration Expert',            'Integração de aplicações OutSystems com APIs externas e configuração de segurança.',                                 75,  FALSE, 'Especialista',          'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 30, 365, TRUE, '2025-01-01', NOW(), NOW()),
(1, 'OutSystems Tech Lead',          'Liderança técnica em projetos OutSystems — code review, governance e definição de standards.',                       100, TRUE,  'Líder de Conhecimento', 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 60, 730, TRUE, '2025-01-01', NOW(), NOW()),
-- Área 2: Cloud Infrastructure
(2, 'Cloud Fundamentals',            'Conceitos fundamentais de cloud computing — serviços e primeiros deploys.',                                           10,  FALSE, 'Júnior',                'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 30, 365, TRUE, '2025-01-01', NOW(), NOW()),
(2, 'Virtual Machines & Networking', 'Configuração de máquinas virtuais, redes cloud e segurança base.',                                                    25,  TRUE,  'Intermédio',            'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 45, 365, TRUE, '2025-01-01', NOW(), NOW()),
(2, 'Container Platforms',           'Plataformas de containers — Docker, registries e estratégias de deployment.',                                         50,  FALSE, 'Sénior',                'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 30, 365, TRUE, '2025-01-01', NOW(), NOW()),
(2, 'Infrastructure Automation',     'Automação de infraestrutura com IaC, pipelines e versionamento.',                                                     75,  FALSE, 'Especialista',          'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 30, 365, TRUE, '2025-01-01', NOW(), NOW()),
(2, 'Cloud Solutions Architect',     'Arquitetura de soluções cloud com foco em alta disponibilidade e otimização de custos.',                              100, TRUE,  'Líder de Conhecimento', 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 60, 730, TRUE, '2025-01-01', NOW(), NOW()),
-- Área 3: Kubernetes & Containers
(3, 'Containers Basics',             'Fundamentos de containers — criação de Dockerfiles, build e execução de imagens.',                                    10,  FALSE, 'Júnior',                'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 30, 365, TRUE, '2025-01-01', NOW(), NOW()),
(3, 'Kubernetes Administration',     'Administração de clusters Kubernetes — gestão de pods, services e troubleshooting.',                                  25,  TRUE,  'Intermédio',            'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 45, 365, TRUE, '2025-01-01', NOW(), NOW()),
(3, 'CI/CD for Containers',          'Pipelines CI/CD para containers — deploy automatizado e gestão de registries.',                                       50,  FALSE, 'Sénior',                'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 30, 365, TRUE, '2025-01-01', NOW(), NOW()),
(3, 'Cluster Security',              'Segurança em clusters Kubernetes — RBAC, gestão de secrets e políticas.',                                             75,  FALSE, 'Especialista',          'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 30, 365, TRUE, '2025-01-01', NOW(), NOW()),
(3, 'Kubernetes Platform Engineer',  'Engenharia de plataforma Kubernetes — observabilidade e escalabilidade.',                                             100, TRUE,  'Líder de Conhecimento', 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 60, 730, TRUE, '2025-01-01', NOW(), NOW()),
-- Área 4: DevOps
(4, 'DevOps Foundations',            'Fundamentos de DevOps — Git, pipelines CI/CD básicas e scripts de automação.',                                        10,  FALSE, 'Júnior',                'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 30, 365, TRUE, '2025-01-01', NOW(), NOW()),
(4, 'CI/CD Specialist',              'Pipelines CI/CD avançadas com deploy automático e testes de qualidade.',                                              25,  TRUE,  'Intermédio',            'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 45, 365, TRUE, '2025-01-01', NOW(), NOW()),
(4, 'Infrastructure as Code',        'Infrastructure as Code com Terraform/Ansible e templates reutilizáveis.',                                             50,  FALSE, 'Sénior',                'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 30, 365, TRUE, '2025-01-01', NOW(), NOW()),
(4, 'DevSecOps Engineer',            'Práticas DevSecOps — security scans, gestão segura de secrets e compliance.',                                         75,  FALSE, 'Especialista',          'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 30, 365, TRUE, '2025-01-01', NOW(), NOW()),
(4, 'Automation Architect',          'Arquitetura de estratégias de automação e definição de governance.',                                                  100, TRUE,  'Líder de Conhecimento', 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 60, 730, TRUE, '2025-01-01', NOW(), NOW()),
-- Área 5: Monitoring & Observability
(5, 'Monitoring Foundations',        'Fundamentos de monitorização — métricas básicas e primeiras ferramentas (Prometheus, Grafana).',                      10,  FALSE, 'Júnior',                'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 30, 365, TRUE, '2025-01-01', NOW(), NOW()),
(5, 'Log Management',                'Gestão e centralização de logs — parsing, estruturação e alertas baseados em logs.',                                  25,  TRUE,  'Intermédio',            'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 45, 365, TRUE, '2025-01-01', NOW(), NOW()),
(5, 'Application Observability',     'Observability aplicacional — tracing distribuído, SLI/SLO e dashboards.',                                             50,  FALSE, 'Sénior',                'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 30, 365, TRUE, '2025-01-01', NOW(), NOW()),
(5, 'Performance Optimization',      'Análise e otimização de performance — identificação de bottlenecks e benchmarks.',                                    75,  FALSE, 'Especialista',          'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 30, 365, TRUE, '2025-01-01', NOW(), NOW()),
(5, 'Observability Architect',       'Arquitetura de observability — definição de frameworks, standards e governance.',                                     100, TRUE,  'Líder de Conhecimento', 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 60, 730, TRUE, '2025-01-01', NOW(), NOW()),
-- Área 6: IT Service Management
(6, 'ITSM Foundations',              'Fundamentos de IT Service Management — princípios ITIL e processos base.',                                            10,  FALSE, 'Júnior',                'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 30, 365, TRUE, '2025-01-01', NOW(), NOW()),
(6, 'Incident & Problem Management', 'Gestão de incidentes e problemas — análise de causa-raiz e problem records.',                                          25,  TRUE,  'Intermédio',            'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 45, 365, TRUE, '2025-01-01', NOW(), NOW()),
(6, 'Change Management',             'Gestão de mudanças — processos de change, CAB e fluxos de aprovação.',                                                50,  FALSE, 'Sénior',                'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 30, 365, TRUE, '2025-01-01', NOW(), NOW()),
(6, 'Service Delivery Specialist',   'Entrega de serviços — gestão de SLAs, catálogo de serviços e métricas de KPIs.',                                       75,  FALSE, 'Especialista',          'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 30, 365, TRUE, '2025-01-01', NOW(), NOW()),
(6, 'IT Operations Manager',         'Liderança operacional de IT — estratégia, governance e gestão de equipas de operações.',                              100, TRUE,  'Líder de Conhecimento', 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 60, 730, TRUE, '2025-01-01', NOW(), NOW()),
-- Área 7: Communication Skills
(7, 'Professional Communication',    'Comunicação profissional escrita e oral — emails, reuniões e comunicação interna.',                                   10,  FALSE, 'Júnior',                'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 30, 365, TRUE, '2025-01-01', NOW(), NOW()),
(7, 'Presentation Skills',           'Competências de apresentação — slides, storytelling e técnicas de oratória.',                                          25,  TRUE,  'Intermédio',            'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 45, 365, TRUE, '2025-01-01', NOW(), NOW()),
(7, 'Stakeholder Communication',     'Comunicação com stakeholders — mapeamento, planos de comunicação e status reports.',                                  50,  FALSE, 'Sénior',                'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 30, 365, TRUE, '2025-01-01', NOW(), NOW()),
(7, 'Conflict Resolution',           'Resolução de conflitos — técnicas de mediação e gestão de situações difíceis.',                                       75,  FALSE, 'Especialista',          'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 30, 365, TRUE, '2025-01-01', NOW(), NOW()),
(7, 'Executive Communication',       'Comunicação executiva — briefings de C-level, storytelling estratégico e influência.',                                100, TRUE,  'Líder de Conhecimento', 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 60, 730, TRUE, '2025-01-01', NOW(), NOW()),
-- Área 8: Leadership
(8, 'Leadership Foundations',        'Fundamentos de liderança — auto-conhecimento, princípios e mentoria.',                                                10,  FALSE, 'Júnior',                'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 30, 365, TRUE, '2025-01-01', NOW(), NOW()),
(8, 'Team Coordination',             'Coordenação de equipas — gestão de equipa, 1:1s e planos de desenvolvimento.',                                        25,  TRUE,  'Intermédio',            'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 45, 365, TRUE, '2025-01-01', NOW(), NOW()),
(8, 'Decision Making',               'Tomada de decisão — frameworks, análise de trade-offs e decisões complexas.',                                         50,  FALSE, 'Sénior',                'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 30, 365, TRUE, '2025-01-01', NOW(), NOW()),
(8, 'Strategic Leadership',          'Liderança estratégica — visão, planeamento estratégico e definição de OKRs.',                                         75,  FALSE, 'Especialista',          'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 30, 365, TRUE, '2025-01-01', NOW(), NOW()),
(8, 'Organizational Leadership',     'Liderança organizacional — transformação, cultura e mentoria de outros líderes.',                                     100, TRUE,  'Líder de Conhecimento', 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', 60, 730, TRUE, '2025-01-01', NOW(), NOW());

-- ============================================================
-- 10. Conquistas
-- ============================================================
INSERT INTO "Conquistas" (descricao_conquista, pontos_conquista, imagem_conquista, estado_a_i, data_insercao, "createdAt", "updatedAt") VALUES
('1 Badge',  50, 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', TRUE, '2025-01-01', NOW(), NOW()),
('5 Badges',  200, 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=',   TRUE, '2025-01-01', NOW(), NOW()),
('100 Pontos',     100, 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', TRUE, '2025-01-01', NOW(), NOW());

-- ============================================================
-- 11. Requisitos
-- ============================================================
INSERT INTO "Requisitos" (id_badge, nome_requisito, descricao_requisito, imagem_requisito, data_insercao, estado_a_i, "createdAt", "updatedAt") VALUES
-- Badge 1: OutSystems Foundations
(1,  'Formação Inicial',     'Certificado de conclusão de formação OutSystems.',  'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(1,  'Aplicação Simples',    'Capturas ou export da aplicação desenvolvida.',     'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(1,  'Conhecimentos Base',   'Documento técnico com entidades e lógica criada.',  'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
-- Badge 2: Reactive Development
(2,  'Reactive Web',         'Certificado ou evidência de formação Reactive.',    'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(2,  'UI Responsiva',        'Screenshots da interface responsiva.',              'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(2,  'Componentes Dinâmicos','Documento funcional dos componentes utilizados.',   'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
-- Badge 3: Architecture Specialist
(3,  'Arquitetura Modular',  'Diagrama técnico da solução.',                      'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(3,  'Boas Práticas',        'Checklist de validação arquitetural.',              'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(3,  'Escalabilidade',       'Documento justificando decisões técnicas.',         'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
-- Badge 4: Integration Expert
(4,  'Integração API',       'Evidência de consumo/exposição API.',               'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(4,  'Integração Externa',   'Documento funcional da integração.',                'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(4,  'Segurança',            'Configuração de autenticação/autorização.',         'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
-- Badge 5: OutSystems Tech Lead
(5,  'Liderança Técnica',    'Declaração de participação técnica.',               'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(5,  'Code Review',          'Evidência de revisão de código.',                   'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(5,  'Governance',           'Documento de standards técnicos.',                  'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
-- Badge 6: Cloud Fundamentals
(6,  'Cloud Basics',         'Certificado cloud fundamentals.',                   'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(6,  'Serviços Cloud',       'Documento dos serviços utilizados.',                'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(6,  'Deploy Inicial',       'Evidência de recursos criados.',                    'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
-- Badge 7: Virtual Machines & Networking
(7,  'Configuração VM',      'Screenshots de configuração VM.',                   'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(7,  'Redes Cloud',          'Diagrama de rede virtual.',                         'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(7,  'Segurança Base',       'Evidência de firewall/security groups.',            'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
-- Badge 8: Container Platforms
(8,  'Docker',               'Dockerfile ou screenshots.',                        'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(8,  'Registry',             'Evidência de imagens publicadas.',                  'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(8,  'Deploy',               'Documento de deployment.',                          'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
-- Badge 9: Infrastructure Automation (Cloud Infrastructure)
(9,  'IaC',                  'Scripts Terraform/Ansible.',                        'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(9,  'Automação',            'Pipeline automatizada.',                            'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(9,  'Versionamento',        'Evidência Git.',                                    'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
-- Badge 10: Cloud Solutions Architect
(10, 'Arquitetura Cloud',    'Diagrama da solução.',                              'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(10, 'Alta Disponibilidade', 'Documento resiliente.',                             'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(10, 'Custos',               'Relatório de otimização.',                          'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
-- Badge 11: Containers Basics
(11, 'Docker Basics',        'Dockerfile criado.',                                'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(11, 'Imagens',              'Evidência build/push.',                             'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(11, 'Execução',             'Logs ou screenshots.',                              'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
-- Badge 12: Kubernetes Administration
(12, 'Cluster Management',   'Evidência kubectl.',                                'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(12, 'Pods & Services',      'YAMLs deployment.',                                 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(12, 'Troubleshooting',      'Relatório incidentes.',                             'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
-- Badge 13: CI/CD for Containers
(13, 'Pipeline',             'Configuração CI/CD.',                               'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(13, 'Deploy Automatizado',  'Evidência rollout.',                                'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(13, 'Registry K8s',         'Configuração registry.',                            'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
-- Badge 14: Cluster Security
(14, 'RBAC',                 'Configuração permissões.',                          'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(14, 'Secrets K8s',          'Gestão de secrets.',                                'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(14, 'Policies',             'Documento de políticas.',                           'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
-- Badge 15: Kubernetes Platform Engineer
(15, 'Plataforma',           'Diagrama plataforma.',                              'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(15, 'Observabilidade',      'Configuração monitoring.',                          'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(15, 'Escalabilidade K8s',   'Evidência autoscaling.',                            'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
-- Badge 16: DevOps Foundations
(16, 'Git',                  'Repositório Git.',                                  'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(16, 'CI/CD',                'Pipeline básica.',                                  'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(16, 'Automação DevOps',     'Script automação.',                                 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
-- Badge 17: CI/CD Specialist
(17, 'Pipeline Avançada',    'Configuração completa.',                            'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(17, 'Deploy Automático',    'Evidência deployment.',                             'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(17, 'Qualidade',            'Relatório testes.',                                 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
-- Badge 18: Infrastructure as Code (DevOps)
(18, 'Terraform/Ansible',    'Scripts IaC.',                                      'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(18, 'Provisionamento',      'Evidência automática.',                             'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(18, 'Templates',            'Templates reutilizáveis.',                          'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
-- Badge 19: DevSecOps Engineer
(19, 'Security Scan',        'Relatório vulnerabilidades.',                       'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(19, 'Secrets DevSecOps',    'Configuração segura.',                              'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(19, 'Compliance',           'Evidência compliance.',                             'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
-- Badge 20: Automation Architect
(20, 'Estratégia',           'Documento estratégico.',                            'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(20, 'Framework',            'Arquitetura automação.',                            'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(20, 'Governance Automação', 'Standards definidos.',                              'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
-- Badge 21: Monitoring Foundations
(21, 'Conceitos Base',          'Documento com conceitos fundamentais de monitorização.',     'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(21, 'Ferramentas Iniciais',    'Screenshots de uso de Prometheus ou Grafana.',                'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(21, 'Métricas Básicas',        'Documento com métricas configuradas.',                       'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
-- Badge 22: Log Management
(22, 'Centralização',           'Configuração de stack centralizada (ELK ou Loki).',           'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(22, 'Parsing de Logs',         'Evidência de parsing e estruturação de logs.',                'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(22, 'Alertas de Logs',         'Configuração de alertas baseados em logs.',                   'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
-- Badge 23: Application Observability
(23, 'Tracing Distribuído',     'Evidência de traces distribuídos implementados.',             'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(23, 'SLI / SLO',               'Documento com SLIs e SLOs definidos.',                        'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(23, 'Dashboards',              'Screenshots de dashboards de observability.',                 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
-- Badge 24: Performance Optimization
(24, 'Análise Bottlenecks',     'Relatório de análise de performance.',                        'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(24, 'Otimizações Aplicadas',   'Documento com otimizações implementadas.',                    'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(24, 'Benchmarks',              'Resultados comparativos antes/depois.',                       'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
-- Badge 25: Observability Architect
(25, 'Estratégia Observability','Documento estratégico da arquitetura de observability.',      'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(25, 'Frameworks Definidos',    'Frameworks e standards documentados.',                        'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(25, 'Governance Observability','Standards de governance de observability documentados.',      'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
-- Badge 26: ITSM Foundations
(26, 'Certificação ITIL',       'Certificado ou evidência de formação ITIL.',                  'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(26, 'Processos Base ITSM',     'Documento com processos ITSM iniciais.',                      'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(26, 'Ferramenta ITSM',         'Screenshots de uso de ferramenta (ex: ServiceNow).',          'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
-- Badge 27: Incident & Problem Management
(27, 'Gestão de Incidentes',    'Relatório de incidentes geridos.',                            'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(27, 'Análise Causa-Raiz',      'Documento de RCA (Root Cause Analysis).',                     'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(27, 'Problem Records',         'Evidência de problem records criados.',                       'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
-- Badge 28: Change Management
(28, 'Processo de Change',      'Documento do processo de gestão de mudança.',                 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(28, 'CAB',                     'Evidência de participação em Change Advisory Board.',         'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(28, 'Aprovações Change',       'Registos de aprovações de change geridas.',                   'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
-- Badge 29: Service Delivery Specialist
(29, 'SLAs Definidos',          'Documento com SLAs definidos e cumpridos.',                   'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(29, 'Service Catalogue',       'Catálogo de serviços documentado.',                           'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(29, 'KPIs de Serviço',         'Relatório de métricas e KPIs de serviço.',                    'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
-- Badge 30: IT Operations Manager
(30, 'Estratégia Operacional',  'Documento estratégico de operações de IT.',                   'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(30, 'Liderança Operacional',   'Declaração de liderança operacional de equipa de IT.',        'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(30, 'Governance IT',           'Standards e políticas de IT definidas.',                      'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
-- Badge 31: Professional Communication
(31, 'Comunicação Escrita',     'Exemplos de comunicação escrita profissional.',               'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(31, 'Email Profissional',      'Templates de email profissional.',                            'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(31, 'Facilitação Reuniões',    'Atas ou notas de reuniões facilitadas.',                      'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
-- Badge 32: Presentation Skills
(32, 'Slides Apresentação',     'Slides de apresentação profissional.',                        'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(32, 'Gravação Apresentação',   'Vídeo de apresentação realizada.',                            'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(32, 'Feedback Recebido',       'Documento com feedback recebido sobre apresentação.',         'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
-- Badge 33: Stakeholder Communication
(33, 'Mapa de Stakeholders',    'Documento de mapeamento de stakeholders.',                    'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(33, 'Plano Comunicação',       'Plano estruturado de comunicação.',                           'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(33, 'Status Reports',          'Exemplos de relatórios de status enviados.',                  'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
-- Badge 34: Conflict Resolution
(34, 'Caso de Resolução',       'Documento de caso de resolução de conflito.',                 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(34, 'Técnicas Mediação',       'Documento com técnicas de mediação aplicadas.',               'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(34, 'Mediação Realizada',      'Evidência de mediação concluída com sucesso.',                'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
-- Badge 35: Executive Communication
(35, 'Briefings Executivos',    'Exemplos de briefings preparados para C-level.',              'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(35, 'Storytelling Executivo',  'Documento de narrativa executiva estratégica.',               'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(35, 'Caso de Influência',      'Caso de estudo de influência estratégica.',                   'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
-- Badge 36: Leadership Foundations
(36, 'Auto-conhecimento',       'Documento de auto-avaliação pessoal.',                        'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(36, 'Princípios Liderança',    'Documento com princípios pessoais de liderança.',             'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(36, 'Mentee',                  'Evidência de participação como mentee.',                      'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
-- Badge 37: Team Coordination
(37, 'Gestão de Equipa',        'Documento de gestão de equipa.',                              'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(37, '1:1s Estruturados',       'Exemplos de estrutura de reuniões 1:1.',                      'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(37, 'Plano Desenvolvimento',   'Plano de desenvolvimento individual da equipa.',              'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
-- Badge 38: Decision Making
(38, 'Frameworks Decisão',      'Documento com frameworks de decisão utilizados.',             'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(38, 'Decisão Complexa',        'Caso de estudo de decisão complexa tomada.',                  'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(38, 'Análise Trade-offs',      'Documento de análise de trade-offs.',                         'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
-- Badge 39: Strategic Leadership
(39, 'Visão Estratégica',       'Documento de visão estratégica definida.',                    'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(39, 'Plano Estratégico',       'Plano estratégico formalmente definido.',                     'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(39, 'OKRs',                    'OKRs definidos e acompanhados.',                              'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
-- Badge 40: Organizational Leadership
(40, 'Transformação Liderada',  'Caso de transformação organizacional liderada.',              'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(40, 'Cultura Organizacional',  'Documento sobre iniciativas culturais lideradas.',            'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW()),
(40, 'Mentoria Líderes',        'Evidência de mentoria a outros líderes.',                     'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGNsaGhgwA2Y8MiNYGkA22EBlPG3fjQAAAAASUVORK5CYII=', '2025-01-01', TRUE, NOW(), NOW());

-- ============================================================
-- 12. Objetivos
-- ============================================================
INSERT INTO "Objetivos" (id_badge, id_consultor, data_limite_conclusao, nome_objetivo, data_conclusao_objetivo, estado_objetivo, "createdAt", "updatedAt") VALUES
(12, 1, '2025-06-30', 'Obter Kubernetes Administration',     NULL, 'em_andamento', NOW(), NOW()),
(7,  2, '2025-07-15', 'Obter Virtual Machines & Networking', NULL, 'em_andamento', NOW(), NOW());

-- ============================================================
-- 13. BadgesConcluidos
-- ============================================================
INSERT INTO "BadgesConcluidos" (id_badge, id_consultor, data_conclusao_badge, url_validacao, "createdAt", "updatedAt") VALUES
(11, 1, '2025-02-15', 'https://certificacoes.softinsa.pt/containers-basics-joao',  NOW(), NOW()),
(6,  2, '2025-03-20', 'https://certificacoes.softinsa.pt/cloud-fundamentals-maria', NOW(), NOW());

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
(1, 1, 1, 12, 1, NOW(), NOW()),  -- Pedido 1: João candidata-se a Kubernetes Administration (em avaliação TM)
(2, 1, 1, 7,  4, NOW(), NOW());  -- Pedido 2: Maria candidata-se a Virtual Machines & Networking (aprovado SL)

-- ============================================================
-- 16. HistoricoPedidos
-- Nota: inserido ANTES de Documentacoes por dependência de FK.
--
-- Pedido 1 (João / Kubernetes Administration):
--   Entrada 1 — submissão inicial
--
-- Pedido 2 (Maria / Virtual Machines & Networking):
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
-- 17. Documentacoes (sem id_requisito — coluna não existe no modelo)
INSERT INTO "Documentacoes" (id_historico, id_consultor, documentacao, "createdAt", "updatedAt") VALUES
(1, 1, 'Evidência kubectl e YAMLs de gestão de pods - João',          NOW(), NOW()),
(2, 2, 'Diagrama de rede virtual e configuração de VMs - Maria',      NOW(), NOW());

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
(1, 15, NOW(), NOW()),  -- João favorita Kubernetes Platform Engineer (top da sua área)
(2, 10, NOW(), NOW());  -- Maria favorita Cloud Solutions Architect

-- ============================================================
-- 22. Politicas
-- ============================================================
INSERT INTO "Politicas" (id_administrador, politica, "createdAt", "updatedAt") VALUES
(1, 'Política de privacidade e proteção de dados v1.0', NOW(), NOW());
