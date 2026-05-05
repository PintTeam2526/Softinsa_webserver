import { FaBell, FaClipboardList } from 'react-icons/fa'


const heroCircle5 = 'https://www.figma.com/api/mcp/asset/739430e1-57f7-4057-8b30-e4e9ac3df7a9'
const heroCircle4 = 'https://www.figma.com/api/mcp/asset/31ef0c85-37c3-4902-831e-06a6e32c1a31'
const heroCircle3 = 'https://www.figma.com/api/mcp/asset/fb86f390-2b2f-4a33-87ed-0360cd912651'
const heroCircle2 = 'https://www.figma.com/api/mcp/asset/4d42a602-3e7c-4d29-914a-c936496586f7'
const heroCircle1 = 'https://www.figma.com/api/mcp/asset/8e0c1c48-1af5-4053-870f-1e35ff081df1'
const pendingImage1 = 'https://www.figma.com/api/mcp/asset/351dcc52-b438-4039-8032-2145a7543488'
const pendingImage2 = 'https://www.figma.com/api/mcp/asset/cc1850d2-ede7-4d3f-b410-76c7191d8812'
const pendingImage3 = 'https://www.figma.com/api/mcp/asset/fdcac280-e852-47a8-a018-ef47d87ca4b6'
const badgeJunior = 'https://www.figma.com/api/mcp/asset/5e7441b9-9e56-408f-b55b-f4c1ff9ac25e'
const badgeIntermedio = 'https://www.figma.com/api/mcp/asset/75068ae9-9335-4083-8d92-65ac0d0370de'
const badgeSenior = 'https://www.figma.com/api/mcp/asset/19bc82e2-8968-4464-8773-ea7b019e00db'
const badge4 = 'https://www.figma.com/api/mcp/asset/a5449093-d00b-4959-94e8-73067670a5c9'
const badge5 = 'https://www.figma.com/api/mcp/asset/151de966-29b4-4c0f-8b8b-cb7dd0f8cf0d'
const badge6 = 'https://www.figma.com/api/mcp/asset/5109254f-b005-417b-bbae-724799eeed67'
const badge7 = 'https://www.figma.com/api/mcp/asset/b3faff3f-ab54-49c8-affb-e1d6bd232a34'
const requestClockIcon = 'https://www.figma.com/api/mcp/asset/675891eb-9ef9-4feb-9b53-6c651d6e435c'

const pendingRequests = [
  { title: 'Cloud Architecture - Intermédio', consultant: 'João Silva', deadline: 'Tempo limite de resposta termina em 3 dias', image: pendingImage1, tone: 'urgent' },
  { title: 'Data Analytics - Sénior', consultant: 'Maria Santos', deadline: 'Tempo limite de resposta termina em 5 dias', image: pendingImage2, tone: 'urgent' },
  { title: 'Agile Leadership - Júnior', consultant: 'Pedro Costa', deadline: 'Tempo limite de resposta termina em 10 dias', image: pendingImage3, tone: 'calm' },
]

const badgeExpiring = [
  { name: 'Citizen Developer', consultant: 'João Silva', date: '18/05/2026', image: badgeJunior, tone: 'red' },
  { name: 'Low-Code Builder', consultant: 'Antonio Cardoso', date: '18/05/2026', image: badgeIntermedio, tone: 'red' },
  { name: 'Application Creator', consultant: 'Guilherme Pinto', date: '18/05/2026', image: badgeSenior, tone: 'red' },
  { name: 'DevOps Intermediate', consultant: 'Vasco Oliveira', date: '18/05/2026', image: badge4, tone: 'blue' },
  { name: 'Team Lider Beginner', consultant: 'Rodrigo Almeida', date: '18/05/2026', image: badge5, tone: 'green' },
  { name: 'Team Lider Beginner', consultant: 'Pedro Alexandre', date: '18/05/2026', image: badge6, tone: 'green' },
  { name: 'DevOps Intermediate', consultant: 'Francisco Francisco', date: '18/05/2026', image: badge7, tone: 'blue' },
]

function PendingCard({ item }) {
  return (
    <article className="tm-pending-card">
      <div className="tm-pending-copy">
        <h3>{item.title}</h3>
        <p>{item.consultant}</p>
        <div className={`tm-pending-deadline${item.tone === 'calm' ? ' is-calm' : ''}`}>
          <img src={requestClockIcon} alt="" aria-hidden="true" />
          <span>{item.deadline}</span>
        </div>
      </div>

      <div className="tm-pending-image-wrap" aria-hidden="true">
        <img src={item.image} alt="" />
        <span className="tm-pending-image-ring" />
      </div>
    </article>
  )
}

function BadgeRow({ badge }) {
  return (
    <div className="tm-badge-row">
      <div className="tm-badge-row-left">
        <img src={badge.image} alt="" aria-hidden="true" className="tm-badge-image" />
        <div className="tm-badge-row-copy">
          <strong>{badge.name}</strong>
          <div className="tm-badge-row-meta">
            <span>{badge.date}</span>
          </div>
        </div>
      </div>

      <div className="tm-badge-row-right">
        <div className={`tm-badge-consultant-dot is-${badge.tone}`} aria-hidden="true" />
        <span>{badge.consultant}</span>
        <a href="/" onClick={(event) => event.preventDefault()}>
          Ver perfil +
        </a>
      </div>
    </div>
  )
}

function TalentManagerDashboardView() {
  return (
    <>
      <section className="tm-hero" aria-label="Dashboard Talent Manager">
        <div className="tm-hero-art" aria-hidden="true">
          <img className="tm-hero-circle tm-hero-circle-5" src={heroCircle5} alt="" />
          <img className="tm-hero-circle tm-hero-circle-4" src={heroCircle4} alt="" />
          <img className="tm-hero-circle tm-hero-circle-3" src={heroCircle3} alt="" />
          <img className="tm-hero-circle tm-hero-circle-2" src={heroCircle2} alt="" />
          <img className="tm-hero-circle tm-hero-circle-1" src={heroCircle1} alt="" />
        </div>

        <div className="tm-hero-copy">
          <h1>Olá, Austin Robertson!</h1>
        </div>
      </section>

      <section className="tm-notification-callout">
        <div className="tm-notification-icon">
          <FaBell aria-hidden="true" />
        </div>

        <div>
          <h2>Tem 5 notificações por ler</h2>
          <p>Aceda agora às notificações</p>
        </div>
      </section>

      <section className="tm-dashboard-grid" aria-label="Conteúdo principal">
        <article className="tm-panel tm-pending-panel">
          <div className="tm-panel-header">
            <div className="tm-panel-title-wrap">
              <div className="tm-panel-badge">
                <FaClipboardList aria-hidden="true" />
              </div>
              <h2>Pedidos Pendentes</h2>
            </div>

            <a href="/" onClick={(event) => event.preventDefault()} className="tm-panel-link">
              Ver todos
            </a>
          </div>

          <div className="tm-pending-list">
            {pendingRequests.map((item, index) => (
              <div key={item.title} className="tm-pending-item-wrap">
                <PendingCard item={item} />
                {index < pendingRequests.length - 1 ? <div className="tm-panel-divider" aria-hidden="true" /> : null}
              </div>
            ))}
          </div>
        </article>

        <article className="tm-panel tm-badges-panel">
          <div className="tm-panel-header tm-badges-header">
            <h2>Badges prestes a expirar</h2>
          </div>

          <div className="tm-badges-list">
            {badgeExpiring.map((badge) => (
              <BadgeRow key={`${badge.name}-${badge.consultant}`} badge={badge} />
            ))}
          </div>
        </article>
      </section>
    </>
  )
}

export default TalentManagerDashboardView