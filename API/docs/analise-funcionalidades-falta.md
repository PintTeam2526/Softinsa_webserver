# Análise de Funcionalidades em Falta na API

**Projeto:** Plataforma de Badges Softinsa  
**Documento:** PINT_2025_V3.2_Mobile  
**Data:** 2025-05-13

---

## Índice

1. [Autenticação e Registo](#1-autenticação-e-registo)
2. [Consultor — Dashboard e Progresso](#2-consultor--dashboard-e-progresso)
3. [Badges e Requisitos](#3-badges-e-requisitos)
4. [Conquistas e Gamification](#4-conquistas-e-gamification)
5. [Exportações e Relatórios](#5-exportações-e-relatórios)
6. [Notificações e Emails](#6-notificações-e-emails)
7. [Admin — Gestão Avançada](#7-admin--gestão-avançada)
8. [Bónus — Integrações](#8-bónus--integrações)
9. [Correções Técnicas Pendentes](#9-correções-técnicas-pendentes)

---

## 1. Autenticação e Registo

### 1.1 Registo com escolha de área

| Campo | Valor |
|-------|-------|
| **Referência** | PDF Consultor #2, Mobile #2 |
| **Descrição** | "O consultor ao registar, deve escolher a sua área, por forma a que ao iniciar a aplicação sejam mostrados os Badges preferenciais da sua área." |
| **Endpoint necessário** | Modificar `POST /api/autenticacao/register` |
| **O que falta** | Adicionar campo `id_area` ao body do register; criar Consultor com a área selecionada |

### 1.2 Email de confirmação de registo

| Campo | Valor |
|-------|-------|
| **Referência** | PDF Consultor #1, Mobile #1 |
| **Descrição** | "Os utilizadores devem receber um email de confirmação de registo, antes de poderem utilizar a solução." |
| **O que falta** | Serviço de email (nodemailer), trigger de envio após register bem-sucedido |

### 1.3 Recuperar password

| Campo | Valor |
|-------|-------|
| **Referência** | PDF "Recuperar Password" |
| **Endpoints necessários** | `POST /api/autenticacao/recuperar-password` |
| | `POST /api/autenticacao/redefinir-password` |
| **O que falta** | Gerar token temporário com expiração; enviar email com link; endpoint de redefinição |

### 1.4 Obrigar alteração de password no 1º login

| Campo | Valor |
|-------|-------|
| **Referência** | PDF Consultor #1, Mobile #1 |
| **Descrição** | "Na primeira vez que um utilizador entrar na aplicação tem de alterar a password." |
| **O que falta** | Campo `primeiro_login` (BOOLEAN) no modelo Utilizadores; middleware que bloqueie acesso se `primeiro_login = true`; endpoint `PUT /api/autenticacao/alterar-password` |

---

## 2. Consultor — Dashboard e Progresso

### 2.1 Dashboard pessoal com progresso

| Campo | Valor |
|-------|-------|
| **Referência** | PDF Consultor #4, Mobile #4 |
| **Endpoint necessário** | `GET /api/consultor/:id/dashboard` |
| **O que falta** | Endpoint que devolva: badges obtidos vs total, pontos totais, progresso por Learning Path, badges em processo, próximos badges recomendados |

### 2.2 Métricas de progresso visual

| Campo | Valor |
|-------|-------|
| **Referência** | PDF Consultor #15, Mobile #15 |
| **Endpoint necessário** | `GET /api/consultor/:id/metricas` |
| **O que falta** | Dados para gráficos de progresso temporal (badges por mês, pontos acumulados, etc.) |

### 2.3 Celebração de marcos

| Campo | Valor |
|-------|-------|
| **Referência** | PDF Consultor #16, Mobile #16 |
| **Endpoint necessário** | `GET /api/consultor/:id/marcos` |
| **O que falta** | Lógica que detete milestones (3 badges num período, x pontos, primeiro badge pago, etc.) |

### 2.4 Recomendações de próximos badges

| Campo | Valor |
|-------|-------|
| **Referência** | PDF Consultor #17, Mobile #17 |
| **Endpoint necessário** | `GET /api/consultor/:id/recomendacoes` |
| **O que falta** | Algoritmo de recomendação baseado em badges obtidos, área do consultor e níveis seguintes |

---

## 3. Badges e Requisitos

### 3.1 CRUD de Requisitos (descomentar rotas)

| Campo | Valor |
|-------|-------|
| **Referência** | PDF Consultor #9, SL #6, TM #7 |
| **Localização** | `Badges.route.js:28-40` (comentado) |
| **Endpoints necessários** | `GET /api/badges/:badgeId/requisitos` |
| | `GET /api/badges/:badgeId/requisitos/:id` |
| | `POST /api/badges/:badgeId/requisitos/create` |
| | `PUT /api/badges/:badgeId/requisitos/:id/update` |
| | `DELETE /api/badges/:badgeId/requisitos/:id/delete` |
| **O que falta** | Implementar métodos no controller `Badges.controller.js` e ativar as rotas |

### 3.2 Upload de evidências

| Campo | Valor |
|-------|-------|
| **Referência** | PDF Consultor #5, Mobile #5, TM #3 |
| **Endpoint necessário** | `POST /api/documentacoes/upload` |
| **O que falta** | Configurar multer (ou similar) para upload de ficheiros; associar ficheiro a `Documentacoes`; servir ficheiros estáticos |

### 3.3 Download de certificados PDF

| Campo | Valor |
|-------|-------|
| **Referência** | PDF Consultor #18, Mobile #18, SL #15, TM #17 |
| **Endpoint necessário** | `GET /api/certificados/:id_badge/:id_consultor/download` |
| **O que falta** | Gerador de PDF (pdfkit) com template de certificado personalizado (nome consultor, badge, data, logótipo Softinsa) |

### 3.4 Página pública de badge (link único)

| Campo | Valor |
|-------|-------|
| **Referência** | PDF Consultor #25, #26, #27 |
| **Endpoint necessário** | `GET /api/public/badge/:hash` |
| **O que falta** | Gerar hash único por BadgesConcluidos; endpoint público (sem auth) que devolva info do badge + consultor + data; página HTML renderizada ou JSON |

### 3.5 Galeria pública de badges

| Campo | Valor |
|-------|-------|
| **Referência** | PDF Consultor #24 |
| **Endpoint necessário** | `GET /api/public/consultor/:id/badges` |
| **O que falta** | Endpoint público que liste badges obtidos por consultor |

### 3.6 Badges próximos da expiração

| Campo | Valor |
|-------|-------|
| **Referência** | PDF TM #20 |
| **Endpoint necessário** | `GET /api/badges/expirar?dias=30` |
| **O que falta** | Endpoint que filtre BadgesConcluidos com `data_limite_conclusao` próxima (baseado na `validade` do badge) |

---

## 4. Conquistas e Gamification

### 4.1 CRUD de Conquistas

| Campo | Valor |
|-------|-------|
| **Referência** | PDF Consultor #14, SL #9, TM #16 |
| **Modelo existente** | `Conquistas.models.js` |
| **Endpoints necessários** | `GET /api/conquistas/get` |
| | `GET /api/conquistas/:id/get` |
| | `POST /api/conquistas/create` (admin) |
| | `PUT /api/conquistas/:id/update` (admin) |
| | `DELETE /api/conquistas/:id/delete` (admin) |
| | `GET /api/consultor/:id/conquistas` |

### 4.2 Sistema de pontos

| Campo | Valor |
|-------|-------|
| **Referência** | PDF Consultor #13, Mobile #13 |
| **Endpoint necessário** | `GET /api/consultor/:id/pontos` |
| **O que falta** | Lógica de acumulação de pontos ao obter badge (soma `pontos_badge`); endpoint de total e histórico |

### 4.3 Ranking de consultores

| Campo | Valor |
|-------|-------|
| **Referência** | PDF SL #18, secção gamification |
| **Endpoint necessário** | `GET /api/ranking` |
| **Parâmetros** | `?sl=:id` (filtro por service line), `?area=:id` (filtro por área), `?periodo=:dias` |
| **O que falta** | Endpoint de leaderboard por pontos |

---

## 5. Exportações e Relatórios

### 5.1 Exportação para Excel/PDF

| Referência | Endpoint necessário |
|------------|-------------------|
| PDF SL #10, TM #8 | `GET /api/relatorios/pedidos/export?formato=excel\|pdf&data_inicio=&data_fim=` |
| PDF SL #11, TM #9 | `GET /api/relatorios/pedidos/export` |
| PDF SL #12, TM #10 | `GET /api/relatorios/badges/export` |
| PDF SL #13, TM #11 | `GET /api/relatorios/consultores/export` |
| PDF SL #14, TM #12 | `GET /api/relatorios/aprovacoes/export` |
| PDF TM #13 | `GET /api/relatorios/rejeicoes/export` |
| PDF Admin #5 | `GET /api/relatorios/:tipo/export` (genérico para admin) |

**O que falta:** Biblioteca de exportação (exceljs para xlsx, pdfkit para PDF); filtros por data/área/SL

### 5.2 Dashboard com KPIs globais

| Campo | Valor |
|-------|-------|
| **Referência** | PDF "Reporting (mínimo exigível)" |
| **Endpoint necessário** | `GET /api/dashboard/kpi` |
| **Dados a devolver** | % badges por mês, # badges por range de datas, # badges por Learning Path, # badges por nível, # utilizadores registados |

---

## 6. Notificações e Emails

### 6.1 Notificações automáticas de workflow

| Campo | Valor |
|-------|-------|
| **Referência** | PDF Consultor #20, TM #19, SL #17 |
| **O que falta** | Triggers nos controllers `tmReview`, `slReview`, `resubmitPedido` para criar automaticamente notificação em `NotificacoesPedidos` + enviar email |

### 6.2 Email de confirmação de candidatura

| Campo | Valor |
|-------|-------|
| **Referência** | PDF Consultor #19, Mobile #19 |
| **O que falta** | Serviço de email chamado no `createPedido` |

### 6.3 Alertas de SLA ultrapassado

| Campo | Valor |
|-------|-------|
| **Referência** | PDF Admin bónus #1, #11, Mobile bónus b) |
| **O que falta** | Serviço periódico (cron/node-schedule) que verifique pedidos com SLA excedido; criar notificação + enviar email |

### 6.4 Configuração de notificações

| Campo | Valor |
|-------|-------|
| **Referência** | PDF Admin #7 |
| **Endpoint necessário** | `PUT /api/admin/notificacoes/config` |
| **O que falta** | Modelo de configuração + endpoint para admin definir regras |

### 6.5 Lembretes de objetivos

| Campo | Valor |
|-------|-------|
| **Referência** | PDF Consultor #22, Mobile #22 |
| **O que falta** | Serviço que verifique Objetivos com `data_limite_conclusao` próxima e notifique o consultor |

---

## 7. Admin — Gestão Avançada

### 7.1 CRUD de SLA (Service Level Agreements)

| Campo | Valor |
|-------|-------|
| **Referência** | PDF Admin bónus #10 |
| **Modelo existente** | Esboço comentado em `Gestao.route.js` |
| **Endpoints necessários** | `GET /api/gestao/sla/get` |
| | `POST /api/gestao/sla/create` |
| | `PUT /api/gestao/sla/:id/update` |
| | `DELETE /api/gestao/sla/:id/delete` |
| **O que falta** | Ativar modelo + rotas + controller |

### 7.2 Informações/Avisos (notificações PUSH)

| Campo | Valor |
|-------|-------|
| **Referência** | PDF Admin #12, bónus "Informações/Avisos" |
| **Endpoints necessários** | `GET /api/admin/avisos` |
| | `POST /api/admin/avisos/create` |
| | `PUT /api/admin/avisos/:id/update` |
| | `DELETE /api/admin/avisos/:id/delete` |
| | `GET /api/avisos` (público, para todos os utilizadores verem) |
| **O que falta** | Modelo + rotas + controller |

### 7.3 Gestão de permissões

| Campo | Valor |
|-------|-------|
| **Referência** | PDF Admin #2 |
| **Endpoint necessário** | `PUT /api/admin/utilizadores/:id/perfil` |
| **O que falta** | Endpoint específico para admin alterar `tipo_utilizador` (já existe parcialmente no `updateUtilizadorById`) |

### 7.4 Configuração e aceitação de Politicas (RGPD)

| Campo | Valor |
|-------|-------|
| **Referência** | PDF Consultor #10, Admin #8 |
| **Modelo existente** | `Politicas.models.js` + `RGPD.models.js` (conflito de nomes) |
| **Endpoints necessários** | `GET /api/politicas` |
| | `POST /api/politicas/create` (admin) |
| | `POST /api/utilizador/:id/aceitar-politica/:id_politica` |
| **O que falta** | Corrigir naming conflict entre `Politicas.models.js` e `RGPD.models.js`; implementar rotas + modelo de aceitação |

---

## 8. Bónus — Integrações

### 8.1 Assinatura de email com badges

| Campo | Valor |
|-------|-------|
| **Referência** | PDF Consultor bónus #12, SL bónus #7, TM #14 |
| **Endpoint necessário** | `GET /api/consultor/:id/assinatura-email` |
| **O que falta** | Gerar HTML de assinatura com badges obtidos |

### 8.2 Partilha no LinkedIn

| Campo | Valor |
|-------|-------|
| **Referência** | PDF Consultor #11, Mobile #11 |
| **Endpoint necessário** | `GET /api/badges/:id/linkedin-share` |
| **O que falta** | URL de share com metadados do badge |

### 8.3 Timeline de evolução profissional

| Campo | Valor |
|-------|-------|
| **Referência** | PDF TM bónus #1, Mobile bónus a) |
| **Endpoint necessário** | `GET /api/consultor/:id/timeline` |
| **O que falta** | Agregar histórico de pedidos, badges concluídos e objetivos por ordem cronológica |

### 8.4 Integração Teams/Slack

| Campo | Valor |
|-------|-------|
| **Referência** | PDF bónus geral |
| **O que falta** | Serviço de webhook configurável |

### 8.5 Internacionalização (3 línguas)

| Campo | Valor |
|-------|-------|
| **Referência** | PDF bónus |
| **O que falta** | Backend devolver mensagens com chave de i18n (ex: `"mensagem.chave"`) em vez de texto fixo; frontend interpreta conforme idioma |

---

## 9. Correções Técnicas Pendentes

| # | Problema | Ficheiro | Linha |
|---|----------|----------|-------|
| 1 | `setup.js` importa `Potilicas.models` (typo) e 2 ficheiros que não existem (`PoliticasAceites`, `EstadoPedidos`) | `setup.js` | 26-28 |
| 2 | `BadgesConcluidos.belongsTo(Consultor)` usa `foreignKey: 'id_utilizador'` em vez de `id_consultor` | `BadgesConcluidos.models.js` | 49 |
| 3 | `BadgesConcluidos.belongsTo(Badge)` usa `foreignKey: 'id_utilizador'` em vez de `id_badge` | `BadgesConcluidos.models.js` | 50 |
| 4 | `Politicas.models.js` referencia `Administradores` no `references.model` sem fazer require | `Politicas.models.js` | 17 |
| 5 | `RGPD.models.js` e `Politicas.models.js` definem modelo com o mesmo nome `Politicas` (conflito) | `RGPD.models.js` + `Politicas.models.js` | ambos |
| 6 | `HistoricoPedidos.models.js` não utiliza `id_utilizador_avaliador` (controller insere este campo) | `HistoricoPedidos.models.js` | — |
| 7 | `Autenticacao.controller.js` — `getAutenticacao`, `updateUser`, `deleteUser` são stubs vazios | `Autenticacao.controller.js` | 240-242 |
| 8 | Controller `PedidosBadges.controller.js` usa constantes de estado (1-8) que não correspondem totalmente aos seeds do modelo `Estados` (que só tem 6) | `Estados.models.js` + `PedidosBadges.controller.js` | — |

---

## Resumo

| Categoria | Total Requisitos | ✅ Implementado | ⚠️ Parcial | ❌ Em falta |
|-----------|:---------------:|:--------------:|:----------:|:---------:|
| Autenticação/Registo | 4 | 0 | 1 | 3 |
| Consultor — Dashboard | 4 | 0 | 0 | 4 |
| Badges/Requisitos | 6 | 0 | 2 | 4 |
| Conquistas/Gamification | 3 | 0 | 1 | 2 |
| Exportações/Relatórios | 7 | 0 | 0 | 7 |
| Notificações/Emails | 5 | 0 | 1 | 4 |
| Admin — Gestão | 4 | 0 | 1 | 3 |
| Bónus/Integrações | 5 | 0 | 0 | 5 |
| **Total** | **38** | **0** | **6** | **32** |
| Correções técnicas | 8 | 2 | 0 | 6 |

**Legenda:** ✅ = Completo | ⚠️ = Parcial (modelo existe, faltam endpoints) | ❌ = Não implementado
