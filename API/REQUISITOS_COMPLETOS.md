# Plataforma de Badges Softinsa — Requisitos Completos

**Projeto:** PINT_2025 — Plataforma de Badges Softinsa
**Documento Base:** `PINT_2025_Plataforma de Badges da Softinsa - V3.2 - Mobile.pdf`
**Código Fonte:** API (Express/Sequelize/PostgreSQL), Web Frontend (React), WebServer

---

## Instruções para a IA

Este documento contém TODOS os requisitos do projeto. Quando usares este documento como contexto:

1. **Não inventes requisitos.** Responde apenas com base no que está documentado aqui.
2. **Não assumas funcionalidades** que não estejam explicitamente listadas como implementadas ou por implementar.
3. **Hierarquia correta:** Learning Path → Service Line → Área → Nível → Badge → Requisitos (nesta ordem exata).
4. **Perfis de utilizador:** Administrador (AD), Talent Manager (TM), Service Line Leader (SL), Consultor (CO).
5. **Estados do workflow:** Submetido (1) → TM valida → Correto (2) / Incorreto (3) → SL valida → Aprovado (4) / Rejeitado (5) / Devolvido (6).
6. **Soft delete:** Todas as entidades usam `estado_a_i` (booleano) para ativar/inativar, nunca são apagadas fisicamente.
7. **Base de dados:** PostgreSQL com Sequelize ORM. Tabelas têm `data_insercao` e `timestamps` (createdAt/updatedAt) quando aplicável.
8. **Autenticação:** JWT tokens com expiração de 1 dia. Middleware `auth.middleware.js` define `req.user.role` como "guest" se não autenticado.
9. **Respostas da API:** Sempre em português (`mensagem`, `erro`).

---

## 1. Visão Geral do Projeto

### 1.1 Descrição

Plataforma de badges digitais similar ao Credly.com para a Softinsa (empresa líder em consultoria tecnológica). Permite:

- Gestão de credenciais de competências verificadas
- Sistema de gamification para estimular evolução profissional
- Integração com assinaturas de email corporativas (bónus)
- Badges públicos verificáveis por link único

### 1.2 Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Backend API | Node.js + Express 5 |
| ORM | Sequelize 6 |
| Base de Dados | PostgreSQL |
| Frontend Web | React + React Router |
| Mobile | Flutter (aplicação separada) |
| Autenticação | JSON Web Token (JWT) + bcrypt |
| Servidor Estático | Express `public/` |

### 1.3 Estrutura de Learning Paths

```
Learning Path (ex: "Jornada Técnica")
  └── Service Line (ex: "Hybrid Cloud", "Application Operations")
        └── Área (ex: "LowCode Outsystems", "DevOps")
              ├── Nível A - Júnior  (A1, A2, A3 requisitos → 1 Badge)
              ├── Nível B - Intermédio (B1, B2, B3 requisitos → 1 Badge)
              ├── Nível C - Sénior (C1, C2, C3 requisitos → 1 Badge)
              ├── Nível D - Especialista (D1, D2, D3 requisitos → 1 Badge)
              └── Nível E - Líder Conhecimento (E1, E2, E3 requisitos → 1 Badge)
```

- Existe apenas 1 Learning Path atual: "Jornada Técnica" (mas a BD suporta N)
- Cada nível agrupa N requisitos (ex: A1, A2, A3)
- Para obter um badge, o consultor tem de cumprir TODOS os requisitos desse nível
- Um consultor pode candidatar-se a qualquer nível sem ter badges anteriores, desde que tenha os requisitos

### 1.4 Perfis de Utilizador (Roles)

| Código | Perfil | Descrição |
|--------|--------|-----------|
| AD | Administrador | Gestor de conteúdos e de toda a plataforma |
| TM | Talent Manager | Valida evidências (qualquer área/SL) |
| SL | Service Line Leader | Validação final (apenas da sua SL) |
| CO | Consultor | Utilizador que obtém badges |

### 1.5 Workflow de Aprovação

```
1. CONSULTOR submete candidatura com evidências
   → Estado: Submetido (1)

2. TALENT MANAGER valida evidências
   ├── Correto → Avança para Service Line Leader
   │            → Estado: Correto (2)
   └── Incorreto → Devolve ao consultor para retificação
                  → Estado: Incorreto (3)

3. SERVICE LINE LEADER validação final
   ├── Aprovar → Badge atribuído ao consultor
   │           → Estado: Aprovado (4/8)
   ├── Rejeitar → Badge rejeitado com feedback
   │            → Estado: Rejeitado (5/7)
   └── Devolver → Retorna ao consultor com comentário
                 → Estado: Devolvido (6)

4. CONSULTOR pode re-submeter após devolução
   → Volta ao passo 2 (estado reenviado = 2)
```

**Nota:** O controller `PedidosBadges.controller.js` usa estados 1-8 que não correspondem exatamente aos seeds da tabela `Estados` (que só tem 6).

### 1.6 Regras de Atribuição de Talent Manager

Quando um pedido é criado, o TM com **menos pedidos ativos** (estados fora de 7 e 8) é selecionado automaticamente.

---

## 2. Modelo de Dados (Base de Dados)

### 2.1 Tabelas

#### Utilizadores
| Campo | Tipo | Notas |
|-------|------|-------|
| id_utilizador | SERIAL PK | |
| nome_utilizador | TEXT NOT NULL | |
| email_utilizador | TEXT NOT NULL | |
| password_utilizador | TEXT NOT NULL | Hash bcrypt |
| username_utilizador | TEXT NOT NULL | |
| tipo_utilizador | VARCHAR(2) NOT NULL | AD, TM, SL, CO |
| imagem_utilizador | TEXT NOT NULL | Base64 ou URL |
| estado_a_i | BOOLEAN NOT NULL | Ativo/Inativo |
| createdAt | TIMESTAMP | Auto (timestamps:true) |
| updatedAt | TIMESTAMP | Auto (timestamps:true) |

#### LearningPaths
| Campo | Tipo | Notas |
|-------|------|-------|
| id_learning_path | SERIAL PK | |
| nome_learning_path | TEXT NOT NULL | |
| descricao_learning_path | TEXT NOT NULL | |
| imagem_learning_path | TEXT NOT NULL | |
| estado_a_i | BOOLEAN NOT NULL DEFAULT TRUE | |
| data_insercao | DATE NOT NULL | |

#### ServiceLines
| Campo | Tipo | Notas |
|-------|------|-------|
| id_service_line | SERIAL PK | |
| id_learning_path | INTEGER FK → LearningPaths | |
| nome_service_line | TEXT NOT NULL | |
| descricao_service_line | TEXT NOT NULL | |
| imagem_service_line | TEXT NOT NULL | |
| estado_a_i | BOOLEAN NOT NULL | |
| data_insercao | DATE NOT NULL | |

#### Areas
| Campo | Tipo | Notas |
|-------|------|-------|
| id_area | SERIAL PK | |
| id_service_line | INTEGER FK → ServiceLines | |
| nome_area | TEXT NOT NULL | |
| descricao_area | TEXT NOT NULL | |
| imagem_area | TEXT NOT NULL | |
| estado_a_i | BOOLEAN NOT NULL | |
| data_insercao | DATE NOT NULL | |

#### Consultores
| Campo | Tipo | Notas |
|-------|------|-------|
| id_consultor | SERIAL PK | |
| id_utilizador | INTEGER FK → Utilizadores | |
| total_pontos | INTEGER | Acumulado de pontos |
| id_area | INTEGER FK → Areas | Área de preferência |
| createdAt | TIMESTAMP | Auto |
| updatedAt | TIMESTAMP | Auto |

#### Administradores
| Campo | Tipo |
|-------|------|
| id_administrador | SERIAL PK |
| id_utilizador | INTEGER FK → Utilizadores |

#### TalentManagers
| Campo | Tipo |
|-------|------|
| id_talent_manager | SERIAL PK |
| id_utilizador | INTEGER FK → Utilizadores |

#### ServiceLineLiders
| Campo | Tipo | Notas |
|-------|------|-------|
| id_service_line_lider | SERIAL PK | |
| id_utilizador | INTEGER FK → Utilizadores | |
| id_service_line | INTEGER FK → ServiceLines | SL a que pertence |

#### Badges
| Campo | Tipo | Notas |
|-------|------|-------|
| id_badge | SERIAL PK | |
| id_area | INTEGER FK → Areas | |
| nome_badge | TEXT NOT NULL | |
| descricao_badge | TEXT NOT NULL | |
| pontos_badge | INTEGER NOT NULL | Quem define é o Admin |
| pago | BOOLEAN NOT NULL | Certificação paga? |
| nivel_badge | VARCHAR(20) NOT NULL | junior, pleno, senior, etc. |
| imagem_badge | TEXT NOT NULL | |
| sla | INTEGER NOT NULL | Dias para SLA |
| validade | INTEGER NOT NULL | Dias de validade (ex: 365) |
| estado_a_i | BOOLEAN NOT NULL | |
| data_insercao | DATE NOT NULL | |

#### Conquistas
| Campo | Tipo |
|-------|------|
| id_conquista | SERIAL PK |
| descricao_conquista | TEXT NOT NULL |
| pontos_conquista | INTEGER NOT NULL |
| imagem_conquista | TEXT NOT NULL |
| estado_a_i | BOOLEAN NOT NULL |
| data_insercao | DATE NOT NULL |

#### Estados
| Campo | Tipo | Seed |
|-------|------|------|
| id_estado | SERIAL PK | 1-6 |
| nome_estado | TEXT NOT NULL | submetido, correto, incorreto, aprovado, rejeitado, devolvido |
| descricao_estado | TEXT NOT NULL | |

#### Requisitos
| Campo | Tipo |
|-------|------|
| id_requisito | SERIAL PK |
| id_badge | INTEGER FK → Badges |
| nome_requisito | TEXT NOT NULL |
| descricao_requisito | TEXT |
| imagem_requisito | TEXT |
| data_insercao | DATE NOT NULL |
| estado_a_i | BOOLEAN NOT NULL |

#### Objetivos
| Campo | Tipo | Notas |
|-------|------|-------|
| id_objetivo | SERIAL PK | |
| id_badge | INTEGER FK → Badges | |
| id_consultor | INTEGER FK → Consultores | |
| data_limite_conclusao | DATE NOT NULL | Prazo para concluir |
| nome_objetivo | TEXT NOT NULL | |
| data_conclusao_objetivo | DATE | NULL se não concluído |
| estado_objetivo | TEXT NOT NULL | ex: "em_andamento" |

#### BadgesConcluidos
| Campo | Tipo | Notas |
|-------|------|-------|
| id_badge_concluido | SERIAL PK | |
| id_badge | INTEGER FK → Badges | |
| id_consultor | INTEGER FK → Consultores | |
| data_limite_conclusao | DATE NOT NULL | |
| data_conclusao_badge | DATE NOT NULL | |
| url_validacao | TEXT NOT NULL | Link de verificação |

#### ConquistasConsultores
| Campo | Tipo |
|-------|------|
| id_conquista_consultor | SERIAL PK |
| id_consultor | INTEGER FK → Consultores |
| id_conquista | INTEGER FK → Conquistas |
| progresso | INTEGER NOT NULL |

#### PedidosBadges
| Campo | Tipo | Notas |
|-------|------|-------|
| id_pedido_badge | SERIAL PK | |
| id_consultor | INTEGER FK → Consultores | |
| id_talent_manager | INTEGER FK → TalentManagers | |
| id_service_line_lider | INTEGER FK → ServiceLineLiders | |
| id_badge | INTEGER FK → Badges | |
| estado_atual | INTEGER FK → Estados | 1-6 (ou 7-8 no controller) |

#### Documentacoes
| Campo | Tipo |
|-------|------|
| id_documentacao | SERIAL PK |
| id_pedido_badge | INTEGER FK → PedidosBadges |
| id_consultor | INTEGER FK → Consultores |
| documentacao | TEXT NOT NULL | Evidência (ex: base64 ou URL) |
| validado | BOOLEAN | NULL = pendente |

#### HistoricoPedidos
| Campo | Tipo | Notas |
|-------|------|-------|
| id_historico | SERIAL PK | |
| id_estado | INTEGER FK → Estados | |
| id_pedido_badge | INTEGER FK → PedidosBadges | |
| id_utilizador_avaliador | INTEGER | FK → Utilizadores (nullable; adicionado ao modelo na correção #24) |
| data | DATE NOT NULL | |
| estado_objetivo | TEXT NOT NULL | Descrição do evento |

#### NotificacoesAdmins
| Campo | Tipo |
|-------|------|
| id_notificacao_admin | SERIAL PK |
| id_administrador | INTEGER FK → Administradores |
| notificacao | TEXT |

#### NotificacoesPedidos
| Campo | Tipo |
|-------|------|
| id_notificacao_pedido | SERIAL PK |
| id_consultor | INTEGER FK → Consultores |
| id_pedido_badge | INTEGER FK → PedidosBadges |
| justificacao | TEXT |
| data_envio_notificacao | DATE NOT NULL |

#### Enviadas (PK composta)
| Campo | Tipo |
|-------|------|
| id_notificacao_admin | INTEGER FK → NotificacoesAdmins |
| id_utilizador | INTEGER FK → Utilizadores |

#### Favoritos (PK composta)
| Campo | Tipo |
|-------|------|
| id_consultor | INTEGER FK → Consultores |
| id_badge | INTEGER FK → Badges |

#### Politicas / RGPD
| Campo | Tipo |
|-------|------|
| id_politica | SERIAL PK |
| id_administrador | INTEGER FK → Administradores |
| politica | TEXT NOT NULL |
| created_at | TIMESTAMPTZ |
| updated_at | TIMESTAMPTZ |

### 2.2 Associações Principais (Sequelize)

- `Consultores.belongsTo(Utilizador, { foreignKey: 'id_utilizador' })`
- `Consultores.belongsTo(Area, { foreignKey: 'id_area' })`
- `Badges.belongsTo(Area, { foreignKey: 'id_area' })`
- `PedidosBadges.belongsTo(Consultor, { foreignKey: 'id_consultor' })`
- `PedidosBadges.belongsTo(TalentManager, { foreignKey: 'id_talent_manager' })`
- `PedidosBadges.belongsTo(ServiceLineLider, { foreignKey: 'id_service_line_lider' })`
- `PedidosBadges.belongsTo(Badge, { foreignKey: 'id_badge' })`
- `PedidosBadges.belongsTo(Estado, { foreignKey: 'estado_atual' })`
- `Badge.hasMany(PedidosBadges, { foreignKey: 'id_badge' })`

### 2.3 Correções Técnicas Conhecidas na BD / Código

Nenhuma — todas as correções foram aplicadas.

#### Corrigidas (13/05/2026) + (14/05/2026)
| # | Problema | Ficheiro | Fix |
|---|----------|----------|-----|
| 6 | `RGPD.models.js` e `Politicas.models.js` duplicam modelo `Politicas`; `Politicas.models.js` sem require de `Administradores` | ambos | `Politicas.models.js` sobrescrito com conteúdo correto; `RGPD.models.js` apagado; `setup.js:26` descomentado |
| 8 | Controller usa estados 1-8 que não correspondem aos seeds (só 6 estados) | `PedidosBadges.controller.js` | Seed mantido (6 estados); controller corrigido: `7→4`, `8→5`, `TM aprovar:5→2`, `SL aprovar:8→4`, `SL rejeitar:7→5`, `resubmit:2→1` |
| 9 | `estado_A_I_` (typo) em LearningPaths.controller — 3 ocorrências: getById, delete, update | `LearningPaths.controller.js:41,122,171` | `estado_A_I_` → `estado_a_i` |
| 10 | `estado_A_I_` (typo) em ServiceLines.controller — 3 ocorrências: getById, update destructure, update assign | `ServiceLines.controller.js:42,169,176` | `estado_A_I_` → `estado_a_i` |
| 11 | `router.update` não é método Express válido | `Badges.route.js:40` | `router.update` → `router.put` |
| 12 | Faltava `authVerification` em rotas CRUD | `Areas/ServiceLines/LearningPaths/Badges/Utilizadores.route.js` | Adicionado `requireAuth` em 15 rotas |
| 13 | `id_utilizador` em vez de `id_consultor` em createObjetivo, getAllNotificacoes, createNotificacao | `Utilizadores.controller.js:191,212,223` | FK corrigida para `id_consultor` |
| 14 | `deleteObjetivoById`: params conflituosos + FK errada | `Utilizadores.controller.js:197-205` | `id_objetivo` do body, `id_consultor` do route param |
| 15 | Stubs vazios em getAutenticacao, updateUser, deleteUser | `Autenticacao.controller.js:184-186` | Implementados com lógica completa |
| 16 | Dashboard.controller.js: syntax + import errados | `Dashboard.controller.js:97-107` | `where:{}`, `listarPedidosPorCargo`, + `await` |
| 17 | Padronização de roles: `A→a`, `TM→t`, `SL→s`, `CO→c` | 8 controllers + `criarUtilizadores.service.js` + `seed.sql` | 33 role checks atualizadas |
| 18 | Login web sem role ID específico no token | `Autenticacao.controller.js` | Token inclui `id_administrador`/`id_talent_manager`/`id_service_line_lider`/`id_consultor` conforme role |
| 19 | `getAutenticacao` removido | `Autenticacao.controller.js` + `Autenticacao.route.js` | Rota e função eliminadas |
| 20 | Rotas de objetivo/notificação movidas de `/utilizadores` para `/consultores` | `Consultores.controller/route.js` + `Utilizadores.controller/route.js` | `POST/DELETE /consultores/:id/objetivo` + `GET/POST /consultores/:id/notificacoes` |
| 21 | `Areas.controller.js`: `id_serviceline` não existe no modelo (4 ocorrências) | `Areas.controller.js:119,128,202,209` | `id_serviceline` → `id_service_line` |
| 22 | `ServiceLines.controller.js`: `nome_serviceline`/`descricao_serviceline`/`imagem_serviceline` não existem no modelo (6 ocorrências) | `ServiceLines.controller.js:74-76,83-85,166-168,172-175` | Renomeado para `nome_service_line`, `descricao_service_line`, `imagem_service_line` |
| 23 | `Enviadas.models.js`: `belongsTo` sem `foreignKey` — Sequelize gera FK errada | `Enviadas.models.js:31-32` | Adicionado `{ foreignKey: 'id_utilizador' }` e `{ foreignKey: 'id_notificacao_admin' }` |
| 24 | `HistoricoPedidos.models.js`: unused import de `Utilizador` + falta campo `id_utilizador_avaliador` | `HistoricoPedidos.models.js:4,+após38` | Removido import; adicionado campo `id_utilizador_avaliador` (INTEGER, nullable) |
| 25 | `Autenticacao.controller.js`: `username_utilizador: email` guarda email como username | `Autenticacao.controller.js:161` | `email` → `username` |
| 26 | `Consultores.controller.js`: 4 funções sem try/catch causam unhandled rejections | `Consultores.controller.js:252-294` | Adicionado try/catch com `return res.status(500)` |
| 27 | `Utilizadores.controller.js`: `updateUtilizadorById` não faz hash da password | `Utilizadores.controller.js:159` | Adicionado `bcrypt.hash(password, 10)` |
| 28 | `PedidosBadges.controller.js`: `BadgesConcluidos.create` com `data_conclusao` (campo errado) | `PedidosBadges.controller.js:353` | `data_conclusao` → `data_conclusao_badge` |
| 29 | `PedidosBadges.controller.js`: notificação criada com TM ID em campo `id_consultor` | `PedidosBadges.controller.js:202` | `tm.id_talent_manager` → `id_consultor` |
| 30 | `PedidosBadges.controller.js`: `id_service_line_lider` hardcoded como 1 | `PedidosBadges.controller.js:189` | Substituído por lookup dinâmico (Badge → Area → ServiceLineLider) |
| 31 | `database.js`: sync executado antes de modelos serem carregados | `database.js:31-42` | Removido `setup()` de database.js; sync movido para app.js após import de todos os modelos |
| 32 | `src/app.js`: sem sync/seed automático ao iniciar | `src/app.js` | Adicionado import de 24 modelos + `sequelize.sync({force:true})` + seed automático via `seed.service.js` |
| 33 | `database.js`: `logging: true` causa deprecation warning | `database.js:15` | `logging: true` → `logging: false` |
| 34 | `app.js`: `sync({alter:true})` falha com "column contains null values" em BD existente | `app.js:58` | `sync({alter:true})` → `sync({force:true})` — recria tabelas do zero |
| 35 | `sql/seed.sql`: INSERTs sem `"createdAt"`/`"updatedAt"` violam NOT NULL nas tabelas com `timestamps:true` | `sql/seed.sql:13,49,56,185` | Adicionadas colunas `"createdAt"`, `"updatedAt"` com `NOW()` em Utilizadores, Consultores, Administradores, Politicas |
| 36 | `seed.service.js`: `{ multiple: true }` é flag MSSQL — causa falha silenciosa em PostgreSQL | `seed.service.js:21` | Removido `{ multiple: true }` |
| 37 | `seed.service.js`: erro só logava `error.message`, sem mostrar SQL | `seed.service.js:25-26` | Adicionado `if (error.sql) console.error('   SQL:', ...)` |
| 38 | `seed.service.js`: COUNT query sem quotes lia tabela legado `utilizadores` em vez de `"Utilizadores"` | `seed.service.js:9` | `FROM Utilizadores` → `FROM "Utilizadores"` |
| 39 | `sql/seed.sql`: tabelas sem quotes no seed falham em pgAdmin porque PostgreSQL lowercase bate em tabelas legado | `sql/seed.sql` (23 INSERTs) | Todos os nomes de tabela quotados: `INSERT INTO "Tabela"` |
| 40 | `sql/seed.sql`: `INSERT INTO "Estados"` duplica seed do `afterSync` hook no model | `sql/seed.sql:90-98` | Removido bloco Estados (model `Estados.models.js` tem `afterSync` com `popularEstados()`) |
| 41 | Create controllers aceitavam ID primário do body, sobrescrevendo auto_increment da BD | `LearningPaths/ServiceLines/Areas/Badges.controller.js` | Removido `id_learning_path`/`id_service_line`/`id_area`/`id_badge` do destructuring e do `Model.create()` — BD agora gera IDs sequenciais automaticamente |
| 42 | DELETE/UPDATE não cascateia `estado_a_i` para filhos | `LearningPaths/ServiceLines/Areas.controller.js` | Adicionado cascade recursivo: LP → SLs → Áreas → Badges ao inativar (delete ou update) |
| 43 | CREATE não valida se o parent está ativo | `ServiceLines/Areas/Badges.controller.js` | Adicionada validação: rejeita criar entidade ativa se o pai estiver inativo |
| 44 | UPDATE com mudança de parent não valida estado do novo parent | `ServiceLines/Areas/Badges.controller.js` | Adicionada validação ao alterar FK do parent (rejeita associar a pai inativo) |
| 45 | `getAllUtilizadores` retorna admins e inativos para todos os perfis | `Utilizadores.controller.js` | Admin não vê a si próprio; TM/SL veem ativos + não-admin; CO vê só próprio; Guest 401 |
| 46 | `criarUtilizadores.service.js` guarda password em texto plano | `criarUtilizadores.service.js` | Adicionado `bcrypt.hash(password, 10)` antes de criar o utilizador |
| 47 | `seed.sql` usava strings placeholder (`img-*`) para imagens | `sql/seed.sql` | Substituídas por base64 da `placeholder.jpg` (34 campos) |

---

## 3. Requisitos Funcionais por Perfil

### 3.1 Consultor (CO)

| # | Requisito | Estado |
|---|-----------|--------|
| 1 | Receber email de confirmação de registo antes de usar a plataforma | ❌ |
| 2 | Alterar password obrigatoriamente no 1º login | ❌ |
| 3 | Escolher área preferencial no registo para ver badges recomendados | ✅ (parcial) |
| 4 | Consultar badges disponíveis mesmo de outras áreas | ❌ |
| 5 | Dashboard pessoal com progresso nos Learning Paths | ❌ |
| 6 | Upload de evidências (certificados, diplomas, relatórios) | ⚠️ (modelo Documentacoes existe, upload não) |
| 7 | Visualizar status dos pedidos em tempo real | ❌ |
| 8 | Consultar histórico de badges obtidos e em processo | ❌ |
| 9 | Catálogo de badges disponíveis com descrições | ⚠️ (API tem getBadges, frontend parcial) |
| 10 | Consultar requisitos de cada badge | ❌ (rotas comentadas) |
| 11 | Aceitar termos RGPD para publicação e partilha | ❌ |
| 12 | Partilhar badge no LinkedIn | ❌ |
| 13 | Sistema de pontos por badges obtidos | ⚠️ (modelo tem total_pontos, lógica parcial) |
| 14 | Badges de conquistas especiais (certificações pagas) | ❌ (controllers comentados) |
| 15 | Métricas de progresso visual | ❌ |
| 16 | Celebração de marcos alcançados | ❌ |
| 17 | Recomendações de próximos badges | ❌ |
| 18 | Download de certificados personalizados em PDF | ❌ |
| 19 | Email de confirmação de candidatura | ❌ |
| 20 | Notificações de aprovação/rejeição | ⚠️ (modelo NotificacoesPedidos existe, triggers parciais) |
| 21 | Alertas de expiração de badges | ❌ |
| 22 | Lembretes de objetivos (timeline) | ❌ |
| 24 | Galeria pública de badges obtidos | ❌ |
| 25 | Página individual do badge (link único) | ❌ |
| 26 | Sistema de verificação por hash único | ❌ |
| 27 | Informações detalhadas sobre competências certificadas | ❌ |
| 28 | Integração com softinsa.pt | ❌ |

#### Bónus Consultor
| # | Requisito | Estado |
|---|-----------|--------|
| 12 | Badge na assinatura de email | ❌ |
| 13 | Template de email com badges obtidos | ❌ |

### 3.2 Service Line Leader (SL)

| # | Requisito | Estado |
|---|-----------|--------|
| 1 | Consultar badges disponíveis (mesmo de outras SLs) | ❌ |
| 2 | Dashboard com progresso de todos os consultores da sua SL | ❌ |
| 3 | Visualizar status de pedidos da sua SL/área em tempo real | ❌ |
| 4 | Consultar histórico de badges da sua SL/área | ❌ |
| 5 | Catálogo de badges com descrições | ⚠️ |
| 6 | Consultar requisitos de cada badge | ❌ |
| 7 | Ver sistema de pontos da sua área | ⚠️ |
| 8 | Ver badges de conquistas especiais (Badges Premium) | ❌ |
| 9 | Gerar relatórios de badges atribuídos na sua área/período | ❌ |
| 10 | Exportar pedidos para Excel/PDF | ❌ |
| 11 | Exportar badges para Excel/PDF | ❌ |
| 12 | Exportar consultores para Excel/PDF | ❌ |
| 13 | Exportar aprovações para Excel/PDF | ❌ |
| 14 | Validar badges da sua SL (aprovar/rejeitar/devolver) | ✅ (slReview implementado) |
| 15 | Download de certificados PDF personalizados | ❌ |
| 16 | Receber emails de pedidos de candidatura/validações | ❌ |
| 17 | Notificações de aprovação/rejeição | ❌ |
| 18 | Visualizar/comparar ranking de badges da sua SL | ❌ |
| 19 | Consultar histórico de cada processo de candidatura | ❌ |

#### Bónus SL
| # | Requisito | Estado |
|---|-----------|--------|
| - | Métricas de comparação entre consultores | ❌ |
| - | Badge na assinatura de email | ❌ |

### 3.3 Talent Manager (TM)

| # | Requisito | Estado |
|---|-----------|--------|
| 1 | Consultar badges disponíveis na plataforma | ❌ |
| 2 | Dashboard com progresso de todos os consultores | ❌ |
| 3 | Sistema de verificação de evidências | ⚠️ (modelo Documentacoes, tmReview parcial) |
| 4 | Visualizar status de pedidos em tempo real | ❌ |
| 5 | Consultar histórico de badges obtidos e em processo | ❌ |
| 6 | Catálogo de badges com descrições | ⚠️ |
| 7 | Consultar requisitos de cada badge | ❌ |
| 8 | Gerar relatórios de badges atribuídos por área/período | ❌ |
| 9 | Exportar pedidos para Excel/PDF | ❌ |
| 10 | Exportar badges para Excel/PDF | ❌ |
| 11 | Exportar consultores para Excel/PDF | ❌ |
| 12 | Exportar aprovações para Excel/PDF | ❌ |
| 13 | Exportar rejeições para Excel/PDF | ❌ |
| 14 | Badge na assinatura de email | ❌ |
| 15 | Ver sistema de pontos por badges | ⚠️ |
| 16 | Ver badges de conquistas especiais | ❌ |
| 17 | Download de certificados PDF personalizados | ❌ |
| 18 | Receber emails de pedidos de candidatura | ❌ |
| 19 | Notificações de aprovação/rejeição | ❌ |
| 20 | Visualizar badges próximos da expiração | ❌ |
| 21 | Consultar histórico de cada processo de candidatura | ❌ |

#### Bónus TM
| # | Requisito | Estado |
|---|-----------|--------|
| - | Timeline de evolução profissional por consultor | ❌ |

### 3.4 Administrador (AD)

| # | Requisito | Estado |
|---|-----------|--------|
| 1 | Gestão de utilizadores e permissões | ⚠️ (CRUD Utilizadores existe, mas sem endpoints de perfil) |
| 2 | Criar utilizadores e definir perfil (SL, TM) | ✅ (parcial, criarUtilizadores.service.js) |
| 3 | Acrescentar/eliminar badges | ✅ (CRUD Badges implementado) |
| 4 | Acrescentar/eliminar Learning Paths / SLs / Áreas / Níveis / Requisitos | ⚠️ (LP, SL, Área OK; Requisitos comentados) |
| 5 | Exportação de dados para Excel/PDF | ❌ |
| 7 | Gestão de badges (expiração, pontos) | ⚠️ (modelo tem campos, CRUD parcial) |
| 8 | Configuração de notificações | ❌ |
| 9 | Configuração de políticas RGPD | ❌ |
| 10 | Consultar e gerir todos os pedidos de badges | ✅ (parcial, getAllPedidos) |
| 11 | Informações genéricas e avisos ativos/inativos | ❌ |
| 12 | Gestão de SLA | ❌ |

#### Bónus Admin
| # | Requisito | Estado |
|---|-----------|--------|
| - | Notificar equipa se SLA ultrapassado | ❌ |
| - | Definir e gerir SLA da equipa | ❌ |
| - | Notificação PUSH de SLA ultrapassados | ❌ |

### 3.5 Requisitos Mobile (App Flutter — Consultor)

| # | Requisito | Estado |
|---|-----------|--------|
| 1 | Email de confirmação de registo | ❌ |
| 2 | Alterar password no 1º login | ❌ |
| 3 | Escolher área no registo | ✅ (register com id_area) |
| 4 | Consultar badges disponíveis | ✅ (API Badges) |
| 5 | Dashboard com progresso | ❌ |
| 6 | Upload de evidências | ❌ |
| 7 | Status de pedidos em tempo real | ❌ |
| 8 | Histórico de badges | ❌ |
| 9 | Catálogo de badges | ⚠️ |
| 10 | Consultar requisitos | ❌ |
| 11 | Aceitação RGPD | ❌ |
| 12 | Partilha LinkedIn | ❌ |
| 13 | Ver pontos por badges | ⚠️ (total_pontos no modelo) |
| 14 | Ver conquistas especiais | ❌ |
| 15 | Métricas de progresso visual | ❌ |
| 16 | Celebração de marcos | ❌ |
| 17 | Recomendações de próximos badges | ❌ |
| 18 | Download certificados PDF | ❌ |
| 19 | Email de confirmação de candidatura | ❌ |
| 20 | Notificações de aprovação/rejeição | ❌ |
| 21 | Alertas de expiração de badges | ❌ |
| 22 | Lembretes de objetivos | ❌ |
| 24 | Página individual do badge | ❌ |
| 25 | Verificação por link único | ❌ |
| 26 | Informações de competências certificadas | ❌ |

#### Bónus Mobile
| # | Requisito | Estado |
|---|-----------|--------|
| a | Timeline de evolução profissional | ❌ |
| b | Notificação PUSH de SLA ultrapassados | ❌ |

---

## 4. Requisitos Transversais

### 4.1 Autenticação

- **Login:** Email + Password, JWT token com expiração 1 dia
- **Register:** Nome, Email, Username, Password, FotoPerfil, idAreaPref
- **Tipos de utilizador:** AD (Admin), TM (Talent Manager), SL (Service Line Leader), CO (Consultor)
- **Login Mobile:** Endpoint separado `POST /api/autenticacao/mobile/login` que devolve também `id_consultor`
- **Recuperar Password:** ❌ (não implementado)
- **1º Login obrigar alteração de password:** ❌ (não implementado)

### 4.2 Notificações e Emails

- Modelo `NotificacoesPedidos` existe: notificações associadas a pedidos
- Modelo `NotificacoesAdmin` existe: notificações para admins
- **Serviço de email (nodemailer):** ❌ (não implementado)
- **Triggers automáticos:** Parciais (cria notificações nas transições de estado, mas sem email)
- **Alertas de SLA:** ❌ (sem cron/node-schedule)

### 4.3 RGPD e Políticas

- Modelo `Politicas` existe (com conflito de nomes: `Politicas.models.js` e `RGPD.models.js`)
- **Endpoints de aceitação:** ❌
- **Configuração de políticas pelo Admin:** ❌

### 4.4 Internacionalização (Bónus)

- 3 línguas: Português, Inglês, Espanhol
- ❌ (não implementado)

### 4.5 Dashboard e KPIs (Reporting mínimo exigível)

- % de Badges com visão mensal
- # de Badges por range de datas
- # de Badges por Learning Path
- # de Badges por níveis das Learning Paths
- # de utilizadores registados
- ❌ (não implementado — `Dashboard.controller.js` tem stub incompleto)

### 4.6 Gamificação

- **Pontos:** Administrador define pontos por badge
- **Ranking:** Por pontos, para identificar melhores consultores
- **Conquistas especiais:** Badges premium (ex: certificações pagas)
- **Marcos:** Celebração de milestones (ex: 3 badges num período, X pontos, primeiro badge pago)
- **Expiração de badges:** Pontos mantêm-se mesmo se badge expirar
- ❌ (modelos existem, lógica não implementada)

### 4.7 Certificados PDF e Badges Públicos

- **Badges públicos:** Cada badge tem página única pública com hash de verificação
- **Certificados PDF:** Download de certificado personalizado (nome, badge, data, logo Softinsa)
- **LinkedIn Share:** URL de share com metadados do badge
- ❌ (não implementado)

### 4.8 Regras de Visibilidade (Soft Delete)

- Utilizadores não autenticados têm `role: "guest"`
- Se o user não é admin, apenas vê entidades com `estado_a_i = true`
- Admins veem todas as entidades (ativas e inativas)
- Soft delete: `estado_a_i = false` em vez de DELETE físico
- **Utilizadores (lista — `GET /api/utilizadores/get`):** Admin vê todos menos ele próprio; TM/SL veem ativos + não-admin; CO vê só próprio; Guest 401
- **Utilizadores (detalhe — `GET /api/utilizadores/:id/get`):** Admin vê qualquer ID; TM/SL veem apenas ativos + não-admin; CO vê só próprio; Guest 401

---

## 5. API Endpoints

### 5.1 Endpoints Implementados

#### Autenticação
| Método | Rota | Auth | Controller | Descrição |
|--------|------|------|------------|-----------|
| POST | /api/autenticacao/register | - | register | Criar conta consultor (username corrigido: já não guarda email) |
| POST | /api/autenticacao/login | - | login | Login geral |
| POST | /api/autenticacao/mobile/login | - | loginMobile | Login mobile (devolve id_consultor) |
| PUT | /api/autenticacao/update-me | requireAuth | updateUser | ✅ Atualiza nome/email/imagem/password |
| DELETE | /api/autenticacao/delete-me | requireAuth | deleteUser | ✅ Soft delete da conta |

#### Áreas
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | /api/areas/get | - | Listar áreas (com total_badges e ServiceLine) |
| GET | /api/areas/:id/get | - | Área por ID |
| POST | /api/areas/create | requireAuth | Criar área (admin) |
| PUT | /api/areas/:id/update | requireAuth | Atualizar área (admin) |
| DELETE | /api/areas/:id/delete | requireAuth | Soft delete área (admin) |

#### Badges
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | /api/badges/get | - | Listar badges |
| GET | /api/badges/:id/get | - | Badge por ID |
| POST | /api/badges/create | requireAuth | Criar badge (admin) |
| PUT | /api/badges/:id/update | requireAuth | Atualizar badge (admin) |
| DELETE | /api/badges/:id/delete | requireAuth | Soft delete badge (admin) |
| GET | /api/badges/:id_badge/consultor/:id_consultor/estado | - | Estado do badge (Concluido/Expirado/Em analise/Por Obter) |

#### Service Lines
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | /api/serviceLines/get | - | Listar SLs |
| GET | /api/serviceLines/:id/get | - | SL por ID |
| POST | /api/serviceLines/create | requireAuth | Criar SL (admin) |
| PUT | /api/serviceLines/:id/update | requireAuth | Atualizar SL (admin) |
| DELETE | /api/serviceLines/:id/delete | requireAuth | Soft delete SL (admin) |

#### Learning Paths
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | /api/learningPaths/get | - | Listar LPs |
| GET | /api/learningPaths/:id/get | - | LP por ID |
| POST | /api/learningPaths/create | requireAuth | Criar LP (admin) |
| PUT | /api/learningPaths/:id/update | requireAuth | Atualizar LP (admin) |
| DELETE | /api/learningPaths/:id/delete | requireAuth | Soft delete LP (admin) |

#### Pedidos Badges
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | /api/pedidos/get | requireAuth | Listar pedidos (filtrados por role) |
| GET | /api/pedidos/:id/get | requireAuth | Pedido por ID |
| POST | /api/pedidos/create | requireAuth | Criar pedido (consultor) |
| POST | /api/pedidos/:id/tm-review | - | TM: aprovar(2 - correto) / devolver(3 - incorreto) |
| POST | /api/pedidos/:id/sl-review | - | SL: aprovar(4) / devolver(6) / rejeitar(5) |
| POST | /api/pedidos/:id/resubmit | - | Consultor reenviar pedido |

#### Consultores
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| PUT | /api/consultores/:id | - | Editar dados do consultor |
| GET | /api/consultores/info/:id | - | Info consultor mobile |
| GET | /api/consultores/count/badgesObtidos/:id | - | Contagem badges obtidos |
| GET | /api/consultores/count/badgesPorObter/:id | - | Contagem badges por obter |
| GET | /api/consultores/badgesPorObter/lista/:id | - | Lista badges por obter |
| GET | /api/consultores/count/objetivos/porCompletar/:id | - | Objetivos por completar |
| GET | /api/consultores/objetivos/minDiasAteExpirar/:id | - | Dias até expirar objetivo |
| POST | /api/consultores/:id/objetivo/create | requireAuth | Criar objetivo (consultor) |
| DELETE | /api/consultores/:id/objetivo/delete | requireAuth | Apagar objetivo (consultor) |
| GET | /api/consultores/:id/notificacoes | requireAuth | Listar notificações (consultor) |
| POST | /api/consultores/:id/notificacoes | requireAuth | Criar notificação (consultor) |

#### Utilizadores
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | /api/utilizadores/get | requireAuth | Listar utilizadores |
| GET | /api/utilizadores/:id/get | requireAuth | Utilizador por ID |
| POST | /api/utilizadores/create | requireAuth | Criar utilizador (admin) |
| PUT | /api/utilizadores/:id/update | requireAuth | Atualizar utilizador (com bcrypt hash na password) |
| DELETE | /api/utilizadores/:id/delete | requireAuth | Soft delete utilizador |

#### Candidaturas
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | /api/candidaturas | - | Submeter candidatura com evidências |

#### Dashboard
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | /api/dashboard/consultor | - | ✅ Dashboard consultor (badges obtidos + pedidos) |

#### Seed Automático (app.js)
| Comportamento | Descrição |
|---------------|-----------|
| Ao iniciar (`npm start`) | Importa 24 modelos Sequelize |
| | `sequelize.sync({ force: true })` — recria tabelas conforme os modelos (destrutivo) |
| | `afterSync` hook em `Estados.models.js` — popula automaticamente os 6 estados |
| | `seedDatabase()` — verifica `"Utilizadores"` (quotes forçam case-sensitive); se vazia, lê e executa `sql/seed.sql` |
| | `app.listen(3000)` — só inicia após sync + seed |
| **Nota 1:** | `sql/seed.sql` usa nomes de tabela quotados (`"Utilizadores"`, `"Areas"`, etc.) para compatibilidade com PostgreSQL (case-sensitive) e pgAdmin |
| **Nota 2:** | Todas as imagens no seed usam `placeholder.jpg` (base64) — 34 campos em Utilizadores, LearningPaths, ServiceLines, Areas, Badges, Conquistas e Requisitos |

### 5.2 Endpoints com Rotas Comentadas (Por Implementar)

#### Requisitos (em Badges.route.js)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/badges/:badgeId/requisitos | Listar requisitos de um badge |
| GET | /api/badges/:badgeId/requisitos/:id | Requisito por ID |
| POST | /api/badges/:badgeId/requisitos/create | Criar requisito |
| DELETE | /api/badges/:badgeId/requisitos/:id/delete | Apagar requisito |
| PUT | /api/badges/:badgeId/requisitos/:id/update | Atualizar requisito |

#### Conquistas (em Conquistas.route.js — comentado)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/conquistas/get | Listar conquistas |
| GET | /api/conquistas/:id/get | Conquista por ID |
| POST | /api/conquistas/create | Criar conquista |
| PUT | /api/conquistas/:id/update | Atualizar conquista |
| DELETE | /api/conquistas/:id/delete | Apagar conquista |

#### Gestão (em Gestao.route.js — comentado na Rotas.js)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/gestao/sla/get | Listar SLAs |
| POST | /api/gestao/sla/create | Criar SLA |
| PUT | /api/gestao/sla/:id/update | Atualizar SLA |
| DELETE | /api/gestao/rgpd/:id/delete | Apagar SLA (typo: rgpd) |
| GET | /api/gestao/rgpd/get | Listar RGPD |
| POST | /api/gestao/rgpd/create | Criar RGPD |
| PUT | /api/gestao/rgpd/:id/update | Atualizar RGPD |
| DELETE | /api/gestao/rgpd/:id/delete | Apagar RGPD |

### 5.3 Endpoints Completamente em Falta

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/autenticacao/recuperar-password | Recuperar password |
| POST | /api/autenticacao/redefinir-password | Redefinir password |
| PUT | /api/autenticacao/alterar-password | Alterar password (1º login) |
| GET | /api/consultor/:id/dashboard | Dashboard pessoal |
| GET | /api/consultor/:id/metricas | Métricas de progresso |
| GET | /api/consultor/:id/marcos | Marcos/conquistas |
| GET | /api/consultor/:id/recomendacoes | Recomendações |
| GET | /api/consultor/:id/pontos | Pontos totais e histórico |
| GET | /api/consultor/:id/conquistas | Conquistas do consultor |
| GET | /api/consultor/:id/timeline | Timeline evolução |
| GET | /api/consultor/:id/assinatura-email | Assinatura de email |
| GET | /api/ranking | Ranking consultores |
| GET | /api/badges/expirar?dias=30 | Badges a expirar |
| GET | /api/badges/:id/linkedin-share | Partilha LinkedIn |
| GET | /api/certificados/:id_badge/:id_consultor/download | Download certificado PDF |
| GET | /api/public/badge/:hash | Página pública de badge |
| GET | /api/public/consultor/:id/badges | Galeria pública |
| GET | /api/dashboard/kpi | KPIs globais |
| GET | /api/relatorios/pedidos/export | Exportar pedidos |
| GET | /api/relatorios/badges/export | Exportar badges |
| GET | /api/relatorios/consultores/export | Exportar consultores |
| GET | /api/relatorios/aprovacoes/export | Exportar aprovações |
| GET | /api/relatorios/rejeicoes/export | Exportar rejeições |
| POST | /api/documentacoes/upload | Upload de evidências |
| PUT | /api/admin/utilizadores/:id/perfil | Gestão de permissões |
| GET | /api/admin/avisos | Listar avisos |
| POST | /api/admin/avisos/create | Criar aviso |
| PUT | /api/admin/avisos/:id/update | Atualizar aviso |
| DELETE | /api/admin/avisos/:id/delete | Apagar aviso |
| PUT | /api/admin/notificacoes/config | Configurar notificações |
| GET | /api/politicas | Listar políticas |
| POST | /api/politicas/create | Criar política |
| POST | /api/utilizador/:id/aceitar-politica/:id_politica | Aceitar política |
| GET | /api/avisos | Avisos públicos |

---

## 6. Serviços Implementados

### 6.1 `candidaturas.service.js`
- Submeter candidatura com transação
- Remove badge concluído anterior
- Se não existe pedido: escolhe TM com menos pedidos, cria pedido (estado=1), cria histórico, guarda documentos, cria notificação
- Se já existe pedido: atualiza estado para 1, cria novo histórico, documentação e notificação

### 6.2 `devolverEstadoBadge.service.js`
- Retorna: "Concluido" (válido ou sem validade), "Expirado" (validade ultrapassada), "Em análise" (estado 1-2), "Por Obter" (estado 3,5,6), "Erro no script!"

### 6.3 `editarDados.service.js`
- Edita nome, email, id_area, foto_perfil, password do consultor (com transação)

### 6.4 `criarUtilizadores.service.js`
- Cria utilizador + respetivo perfil (Consultor, TM, ou SL) com transação
- Valida username único
- Para CO: id_area obrigatório
- Para SL: id_service_line obrigatório

### 6.5 `listarPedidos.service.js`
- Lista pedidos por cargo (consultor, talent_manager, service_line_lider, admin)
- Adiciona estado calculado via `devolverEstadoBadge`

---

## 7. Frontend Web (React) — Rotas Implementadas

### 7.1 Rotas Públicas
| Rota | View | Descrição |
|------|------|-----------|
| `/` | LoginView | Página de login |
| `/login` | LoginView | Página de login |
| `/acesso` | AccessGatewayView | Gateway de acesso |

### 7.2 Rotas Admin (`/admin/*`)
| Rota | View | Descrição |
|------|------|-----------|
| `/admin` | DashboardView | Dashboard admin |
| `/admin/utilizadores` | AdminUsers | Gestão de utilizadores |
| `/admin/pedidos` | AdminPedidos | Gestão de pedidos |
| `/admin/slas` | AdminSlas | Gestão de SLAs |
| `/admin/rgpd` | AdminRgpd | Configuração RGPD |
| `/admin/badges` | AdminBadges | CRUD badges |
| `/admin/areas` | AdminAreas | CRUD áreas |
| `/admin/service-lines` | AdminServiceLines | CRUD service lines |
| `/admin/learning-paths` | AdminLearningPaths | CRUD learning paths |

### 7.3 Rotas Consultor (`/consultor/*`)
| Rota | View | Descrição |
|------|------|-----------|
| `/consultor` | ConsultorHomeView | Dashboard consultor |
| `/consultor/pedidos` | ConsultorPedidosView | Pedidos do consultor |
| `/consultor/listas-badges` | ConsultorBadgesListsView | Listas de badges |
| `/consultor/objetivos` | ConsultorObjetivosView | Objetivos |
| `/consultor/conquistas` | ConsultorConquistasView | Conquistas |
| `/consultor/outras-areas` | ConsultorOutrasAreasView | Outras áreas |
| `/consultor/perfil-publico` | ConsultorPerfilPublicoView | Perfil público |
| `/consultor/badges` | ConsultorBadgesView | Badges (a reavaliar) |
| `/consultor/mensagens` | ConsultorMessagesView | Mensagens (a reavaliar) |

### 7.4 Rotas Service Line Leader (`/sll/*`)
| Rota | View | Descrição |
|------|------|-----------|
| `/sll` | SLLHomeView | Dashboard SL |
| `/sll/certificados` | SLLCertificadosView | Certificados |
| `/sll/badges` | SLLBadgesView | Badges |
| `/sll/equipa` | SLLMinhaEquipaView | Minha equipa |
| `/sll/relatorios` | SLLRelatoriosView | Relatórios |
| `/sll/historico` | SLLHistoricoView | Histórico |
| `/sll/pendentes` | SLLPendentesView | Pedidos pendentes |
| `/sll/perfil-publico` | SLLPerfilPublicoView | Perfil público |

---

## 8. Resumo do Estado de Implementação

| Categoria | Total | ✅ Completo | ⚠️ Parcial | ❌ Em falta |
|-----------|:----:|:----------:|:----------:|:----------:|
| Autenticação/Registo | 4 | 0 | 1 | 3 |
| Consultor — Dashboard | 4 | 0 | 0 | 4 |
| Badges/Requisitos | 6 | 0 | 2 | 4 |
| Conquistas/Gamification | 3 | 0 | 1 | 2 |
| Exportações/Relatórios | 7 | 0 | 0 | 7 |
| Notificações/Emails | 5 | 0 | 1 | 4 |
| Admin — Gestão | 4 | 0 | 1 | 3 |
| Bónus/Integrações | 5 | 0 | 0 | 5 |
| **Total** | **38** | **0** | **6** | **32** |
| Correções técnicas (código) | 25 | 25 | 0 | 0 |

---

## 9. Regras de Negócio Críticas

1. **Badges sem pré-requisitos hierárquicos:** Consultor pode candidatar-se a qualquer nível sem ter badges anteriores
2. **Validade:** Badges podem ter data de expiração (definida em dias no campo `validade`). Pontos mantêm-se após expiração
3. **SLA:** Cada badge tem um SLA em dias. Quando ultrapassado, devem ser gerados alertas
4. **Upload de evidências:** Em base64 (body com limite de 50mb configurado no Express)
5. **Soft delete universal:** `estado_a_i = false` em vez de DELETE
6. **Timestamps:** `data_insercao` para entidades sem timestamps automáticos; `createdAt`/`updatedAt` para entidades com `timestamps: true`
7. **Tokens JWT:** Payload inclui `{ id, email, role, id_consultor? }`. Middleware auth aceita `Bearer <token>` no header Authorization
8. **User guest:** Se não há token ou é inválido, `req.user.role = "guest"` (não bloqueia, mas endpoints podem verificar)
9. **Atribuição de TM:** Automática — TM com menos pedidos ativos recebe o novo pedido
10. **Nomenclatura BD:** Campos em português (snake_case), nomes de tabelas em PascalCase

---

## 10. Variáveis de Ambiente Necessárias

| Variável | Descrição |
|----------|-----------|
| DB_NAME | Nome da base de dados PostgreSQL |
| DB_USER | Utilizador PostgreSQL |
| DB_PASSWORD | Password PostgreSQL |
| DB_HOST | Host PostgreSQL |
| DB_PORT | Porta PostgreSQL (default 5432) |
| JWT_SECRET | Chave secreta para assinar tokens JWT |

---

## 11. Dependências do Projeto (API)

```json
{
  "@sequelize/postgres": "^7.0.0-alpha.48",
  "bcrypt": "^6.0.0",
  "cors": "^2.8.6",
  "dotenv": "^17.4.2",
  "express": "^5.2.1",
  "jsonwebtoken": "^9.0.3",
  "nodemon": "^3.1.14",
  "pg": "^8.20.0",
  "sequelize": "^6.37.8"
}
```

---

## 12. Frontend Web (React) — Dependências

```json
{
  "react": "^19",
  "react-dom": "^19",
  "react-router-dom": "^7",
  "vite": "^6",
  "eslint": "^9"
}
```

---

## 13. Estrutura de Pastas (API)

```
API/
  .env
  database.js              # Conexão Sequelize + sync
  setup.js                 # Criação das tabelas (force:true)
  package.json
  sql/
    schema.sql             # Schema SQL manual
    seed.sql               # Dados de seed
  src/
    app.js                 # Entry point Express
    config/                # (vazio — config via .env)
    controllers/           # Lógica dos endpoints
    middleware/
      auth.middleware.js   # JWT verification
      requireAuth.middleware.js  # Role check
    models/                # 24 modelos Sequelize
    routes/
      Rotas.js             # Agregador de rotas
      # +12 ficheiros de rota individuais
    services/              # 6 serviços: lógica de negócio + seedDatabase()
    public/                # Ficheiros estáticos
  docs/
    analise-funcionalidades-falta.md  # Análise de funcionalidades em falta
```

---

## 14. Estrutura de Pastas (Web Frontend)

```
pint_web/
  src/
    App.jsx                # Router principal
    controllers/           # 4 controllers (dashboard, learningPaths, sidebar, topbar)
    models/                # Modelos frontend
    views/
      layouts/             # Layouts partilhados
      components/          # Componentes reutilizáveis
      pages/
        admin/             # 8 views admin
        SLL/               # 8 views Service Line Leader
        consultor/         # 9 views consultor
        auth/              # LoginView
        shared/            # AccessGatewayView
```

---

## 15. Regras de Comportamento para a IA

Quando usares este documento como contexto, segue obrigatoriamente estas regras:

1. **Scope:** Este documento define o âmbito EXATO do projeto. Não acrescentes funcionalidades que não estejam aqui.
2. **Linguagem:** Toda a comunicação com a API é em português (`mensagem`, `erro`, etc.).
3. **Hierarquia:** Respeita sempre: Learning Path → Service Line → Área → Nível → Badge → Requisitos.
4. **Perfis:** AD = Admin, TM = Talent Manager, SL = Service Line Leader, CO = Consultor.
5. **Estados workflow:** Usa os nomes portugueses: Submetido, Correto, Incorreto, Aprovado, Rejeitado, Devolvido.
6. **Soft delete:** `estado_a_i = false` é a forma correta de "eliminar".
7. **Não inventes endpoints.** Se um endpoint não está listado neste documento, não existe.
8. **Base de dados:** PostgreSQL + Sequelize ORM. Tabelas em PascalCase, campos em snake_case.
9. **Autenticação:** JWT no header `Authorization: Bearer <token>`. Sem token → `role: "guest"`.
10. **Perguntas fora do âmbito:** Se te perguntarem algo que não está neste documento, responde "Esse requisito não está definido no documento oficial do projeto."
