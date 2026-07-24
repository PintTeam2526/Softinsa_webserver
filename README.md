# 🏅 Plataforma de Badges Digitais - Softinsa

A **Plataforma de Badges Digitais da Softinsa** é uma solução Web e Mobile desenhada para gerir, reconhecer e promover a formação contínua e a certificação de competências dos colaboradores da empresa. 

A aplicação transforma as formações internas e externas num sistema gamificado de credenciais verificáveis, promovendo o crescimento individual e a visibilidade de talentos internos.

---

## 🚀 Funcionalidades Principais

### 👥 Perfis de Utilizador & Controlo de Acesso

#### 1. Consultor (Aplicação Web & Mobile)
* **Dashboard & Progresso:** Visualização pessoal da evolução nos *Learning Paths* (*Jornada Técnica*).
* **Gestão de Candidaturas:** Submissão de candidaturas a badges com *upload* de evidências (certificados, diplomas, relatórios).
* **Acompanhamento:** Estado do pedido em tempo real e histórico de badges obtidos ou em processo.
* **Catálogo & Requisitos:** Consulta do catálogo de badges, requisitos específicos por nível (Júnior, Intermédio, Sénior, Especialista, Líder) e recomendações de próximos badges.
* **Gamificação & Reconhecimento:** Sistema de pontos por badges obtidos, visualização de *rankings*, conquistas especiais e celebração de marcos.
* **Partilha & Verificação:**
  * Página individual/pública com link único de verificação atestando as competências do consultor.
  * Exportação e download de certificados personalizados em PDF.
  * Partilha direta de badges no LinkedIn.
  * **[BÓNUS IMPLEMENTADO] Integrador de Assinatura de Email:** Possibilidade de incorporar o badge obtido diretamente na assinatura de email.

#### 2. Talent Manager (Portal Web)
* **Validação de Evidências (1ª Fase):** Acesso e validação global a todas as submissões de evidências efetuadas pelos consultores (encaminhamento para o Service Line Leader em caso de aprovação ou devolução ao consultor para correção).
* **Relatórios & Métricas:** Emissão de relatórios e exportação de dados (Badges, Pedidos, Consultores) nos formatos PDF e Excel.
* **Histórico Auditável:** Registo completo de decisões e feedback associado a cada processo de candidatura.

#### 3. Service Line Leader (Portal Web)
* **Aprovação Final (2ª Fase):** Validação final dos badges associados à sua respetiva *Service Line*.
* **Gestão de Equipas:** Visão do progresso, métricas e comparação do *ranking* de pontuação dos consultores da sua área.
* **Certificados & Relatórios:** Exportação e visualização de dados e histórico de formações.

#### 4. Administrador / Gestor (Portal Web)
* **Gestão da Estrutura:** Criação e manutenção de *Learning Paths*, *Service Lines*, Áreas, Níveis, Requisitos e Badges.
* **Gestão do Sistema:** Controlo de utilizadores, atribuição de permissões, gestão das políticas de RGPD, expiração de badges e configuração do sistema de pontos.
* **Dashboards Globais & KPIs:** Estatísticas globais de utilização, % de badges atribuídos por período e controlo de utilizadores ativos.

---

## 🔄 Workflow de Validação de Badges

```text
[Consultor] Submete candidatura + Evidências (Estado: Open / Submitted)
     │
     ▼
[Talent Manager] Valida Evidências
     ├─► Incorreto ──► Retorna ao Consultor (Estado: Open)
     └─► Correto ───► Envia ao Service Line Leader (Estado: Em Validação)
                             │
                             ▼
              [Service Line Leader] Validação Final
                     ├─► Aprovar ────► Badge Publicado & Notificação (Estado: Fechado)
                     ├─► Rejeitar ───► Rejeitado com Feedback (Estado: Fechado)
                     └─► Send Back ──► Retorna ao Consultor (Estado: Open)
