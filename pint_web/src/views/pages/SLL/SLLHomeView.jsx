import {
  FaBell,
  FaCheckCircle,
  FaClipboardList,
  FaClock,
  FaMedal,
  FaTimesCircle,
  FaUserCircle,
  FaUsers,
} from 'react-icons/fa'
import SLLSidebar from '../../components/SLLSidebar'
import SLLTopbar from '../../components/SLLTopbar'
import './SLL-home.css'

const heroArt = {
  circle1: 'https://www.figma.com/api/mcp/asset/44d621a5-5f77-49f8-97ab-d9acc1d9112c',
  circle2: 'https://www.figma.com/api/mcp/asset/0031c923-79a2-4f81-a561-192a0c6849b0',
  circle3: 'https://www.figma.com/api/mcp/asset/b0852dd2-c31a-4830-be65-d3c6b37c002f',
  circle4: 'https://www.figma.com/api/mcp/asset/8919d2e8-f08e-4e6d-9567-3137bf5a3772',
  circle5: 'https://www.figma.com/api/mcp/asset/92d686ed-3af6-4a87-90b1-e7a92d4cf489',
}

const pendingRequests = [
  {
    title: 'Cloud Architecture - Intermedio',
    consultant: 'Joao Silva',
    deadline: 'Tempo limite de resposta termina em 3 dias',
    deadlineTone: 'danger',
    badgeLabel: 'CI',
  },
  {
    title: 'Data Analytics - Senior',
    consultant: 'Maria Santos',
    deadline: 'Tempo limite de resposta termina em 5 dias',
    deadlineTone: 'danger',
    badgeLabel: 'DA',
  },
  {
    title: 'Agile Leadership - Junior',
    consultant: 'Pedro Costa',
    deadline: 'Tempo limite de resposta termina em 10 dias',
    deadlineTone: 'info',
    badgeLabel: 'AL',
  },
]

const teamStatusCards = [
  { label: 'Aprovados', value: '85%', icon: FaCheckCircle, tone: 'approved' },
  { label: 'Pendentes', value: '12%', icon: FaClock, tone: 'pending' },
  { label: 'Rejeitados', value: '3%', icon: FaTimesCircle, tone: 'rejected' },
]

const topConsultants = [
  { name: 'Joao Silva', badges: '15 badges', rank: '1o', rankTone: 'gold' },
  { name: 'Ana Costa', badges: '12 badges', rank: '2o', rankTone: 'silver' },
  { name: 'Maria Santos', badges: '10 badges', rank: '3o', rankTone: 'bronze' },
]

function PendingRequestCard({ request }) {
  return (
    <article className="sll-request-row">
      <div className="sll-request-main">
        <h4>{request.title}</h4>
        <p className="sll-request-consultant">{request.consultant}</p>

        <div className={`sll-request-deadline is-${request.deadlineTone}`}>
          <FaClock aria-hidden="true" />
          <span>{request.deadline}</span>
        </div>
      </div>

      <div className="sll-request-badge" aria-label={`Badge ${request.badgeLabel}`}>
        {request.badgeLabel}
      </div>
    </article>
  )
}

function SLLHomeView() {
  return (
    <div className="sll-homepage">
      <SLLSidebar />

      <main className="sll-main-content">
        <SLLTopbar />

        <div className="sll-main-scroll">
          <section className="sll-hero" aria-label="Resumo de boas-vindas">
            <div className="sll-hero-art" aria-hidden="true">
              <img className="sll-hero-circle sll-hero-circle-5" src={heroArt.circle5} alt="" />
              <img className="sll-hero-circle sll-hero-circle-4" src={heroArt.circle4} alt="" />
              <img className="sll-hero-circle sll-hero-circle-3" src={heroArt.circle3} alt="" />
              <img className="sll-hero-circle sll-hero-circle-2" src={heroArt.circle2} alt="" />
              <img className="sll-hero-circle sll-hero-circle-1" src={heroArt.circle1} alt="" />
            </div>

            <div className="sll-hero-copy">
              <h1>Olá, João Silva!</h1>
              <p>Hybrid Cloud</p>
            </div>
          </section>

          <article className="sll-alert-card" aria-label="Alertas pendentes">
            <div className="sll-alert-icon">
              <FaBell aria-hidden="true" />
            </div>

            <div>
              <h3>Tem 5 alertas por ler</h3>
              <p>Aceda agora aos alertas</p>
            </div>
          </article>

          <section className="sll-dashboard-grid">
            <article className="sll-card sll-pending-card">
              <header className="sll-card-header">
                <div className="sll-title-wrap">
                  <span className="sll-title-icon" aria-hidden="true">
                    <FaClipboardList />
                  </span>
                  <h3>Pedidos Pendentes</h3>
                </div>

                <button className="sll-link-btn" type="button">
                  Ver todos
                </button>
              </header>

              <div className="sll-request-list">
                {pendingRequests.map((request) => (
                  <PendingRequestCard key={request.title} request={request} />
                ))}
              </div>
            </article>

            <div className="sll-status-column">
              {teamStatusCards.map((statusCard) => {
                const Icon = statusCard.icon

                return (
                  <article className="sll-card sll-status-card" key={statusCard.label}>
                    <span className={`sll-status-icon is-${statusCard.tone}`} aria-hidden="true">
                      <Icon />
                    </span>

                    <div>
                      <p>{statusCard.label}</p>
                      <strong>{statusCard.value}</strong>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>

          <section className="sll-bottom-grid">
            <article className="sll-card sll-top-consultants-card">
              <h3>Top 3 Consultores</h3>

              <div className="sll-top-list">
                {topConsultants.map((consultant) => (
                  <article className="sll-top-item" key={consultant.rank}>
                    <div className="sll-top-main">
                      <span className="sll-top-avatar" aria-hidden="true">
                        <FaUserCircle />
                      </span>

                      <div>
                        <h4>{consultant.name}</h4>
                        <p>{consultant.badges}</p>
                      </div>
                    </div>

                    <span className={`sll-rank-badge is-${consultant.rankTone}`}>{consultant.rank}</span>
                  </article>
                ))}
              </div>
            </article>

            <article className="sll-card sll-team-card">
              <h3>Service Line Pessoal</h3>

              <div className="sll-team-stats">
                <article className="sll-team-stat">
                  <span className="sll-team-stat-icon" aria-hidden="true">
                    <FaUsers />
                  </span>
                  <strong>50</strong>
                  <p>Consultores</p>
                </article>

                <article className="sll-team-stat">
                  <span className="sll-team-stat-icon" aria-hidden="true">
                    <FaMedal />
                  </span>
                  <strong>150</strong>
                  <p>Badges conquistados</p>
                </article>
              </div>
            </article>
          </section>
        </div>
      </main>
    </div>
  )
}

export default SLLHomeView
