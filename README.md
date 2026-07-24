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
```

---

## 🛠️ Ferramentas e Tecnologias Utilizadas

Below are the technologies and tools used in the development of the Web and Mobile ecosystems:

### **Languages & Core**
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

### **Frontend & Mobile Frameworks**
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Flutter](https://img.shields.io/badge/Flutter-%2302569B.svg?style=for-the-badge&logo=Flutter&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)

### **Backend & APIs**
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

### **Database**
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)

### **DevOps & Tools**
![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![Jira](https://img.shields.io/badge/jira-%230A0FFF.svg?style=for-the-badge&logo=jira&logoColor=white)

---

## 🔒 Segurança e Privacidade (RGPD)

* Toda a comunicação entre o cliente e o servidor é encriptada através de **HTTPS**.
* Aceitação de termos de consentimento **RGPD** para publicação e partilha de dados/badges.
* Autenticação segura através do preenchimento do e-mail e criação de uma palavra-passe no registo.
