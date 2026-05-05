import './consultor-DashboardView.css'

const metricCards = [
  {
    title: 'Área',
    value: '50%',
    icon: 'https://www.figma.com/api/mcp/asset/0acf49db-3b4d-4ec3-82fc-8650f2c3a4aa',
    widthClass: 'is-area',
  },
  {
    title: 'Service Line',
    value: '40%',
    icon: 'https://www.figma.com/api/mcp/asset/0a69b3ea-1f1d-4eb9-9831-ecf67dc039b0',
    widthClass: 'is-service-line',
  },
  {
    title: 'Learning Path',
    value: '25%',
    icon: 'https://www.figma.com/api/mcp/asset/fe338133-f0f4-4325-91ea-9c78fd1547c2',
    widthClass: 'is-learning-path',
  },
]

const recommendedBadges = [
  {
    image: 'https://www.figma.com/api/mcp/asset/81dd147b-a305-4898-9278-57a77240bbb0',
    name: 'Citzen Developer',
    subtitle: 'LowCode(Outsystems)',
  },
  {
    image: 'https://www.figma.com/api/mcp/asset/43c06d2e-6900-4930-b272-5c2b4dd6a02c',
    name: 'Team Lider Beginner',
    subtitle: 'Talent Management',
  },
  {
    image: 'https://www.figma.com/api/mcp/asset/6d114912-0649-40f4-8a19-8ca69f1cbfad',
    name: 'DevOps Intermidiate',
    subtitle: 'DevOps',
  },
  {
    image: 'https://www.figma.com/api/mcp/asset/6d114912-0649-40f4-8a19-8ca69f1cbfad',
    name: 'DevOps Intermidiate',
    subtitle: 'DevOps',
  },
]

const myBadges = [
  {
    image: 'https://www.figma.com/api/mcp/asset/81dd147b-a305-4898-9278-57a77240bbb0',
    name: 'Citzen Developer',
    status: 'Expirado',
    statusIcon: '📅',
  },
  {
    image: 'https://www.figma.com/api/mcp/asset/43c06d2e-6900-4930-b272-5c2b4dd6a02c',
    name: 'Team Lider Beginner',
    status: 'Devolvido',
    statusIcon: '↩',
  },
  {
    image: 'https://www.figma.com/api/mcp/asset/6d114912-0649-40f4-8a19-8ca69f1cbfad',
    name: 'DevOps Intermidiate',
    status: 'Em Análise',
    statusIcon: 'i',
  },
  {
    image: 'https://www.figma.com/api/mcp/asset/6d114912-0649-40f4-8a19-8ca69f1cbfad',
    name: 'DevOps Intermidiate',
    status: 'Aceite',
    statusIcon: '✓',
  },
  {
    image: 'https://www.figma.com/api/mcp/asset/6d114912-0649-40f4-8a19-8ca69f1cbfad',
    name: 'DevOps Intermidiate',
    status: 'Recusado',
    statusIcon: '×',
  },
]

function DashboardAction({ icon, title, subtitle, value, type }) {
  return (
    <article className={`consultor-dashboard-metric ${type}`}>
      <img src={icon} alt="" aria-hidden="true" className="consultor-dashboard-metric-icon" />

      <div className="consultor-dashboard-metric-copy">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>

      {value ? <strong className="consultor-dashboard-metric-value">{value}</strong> : null}
    </article>
  )
}

function BadgeRow({ badge, isLarge = false }) {
  return (
    <div className={`consultor-dashboard-badge-row${isLarge ? ' is-my-badge' : ''}`}>
      <img
        src={badge.image}
        alt={badge.name}
        className={`consultor-dashboard-badge-image${isLarge ? ' consultor-dashboard-badge-image--large' : ''}`}
      />

      <div className={`consultor-dashboard-badge-copy${isLarge ? ' consultor-dashboard-badge-copy--my-badge' : ''}`}>
        <h4>{badge.name}</h4>
        <p>
          {isLarge ? badge.status : badge.subtitle}
          {isLarge ? (
            <span className="consultor-dashboard-badge-status-icon" aria-hidden="true">
              {badge.statusIcon}
            </span>
          ) : null}
        </p>
      </div>

      {!isLarge ? <span className="consultor-dashboard-badge-action">↗</span> : null}
    </div>
  )
}

function DashboardView() {
  return (
    <section className="consultor-dashboard-page">
      <header className="consultor-dashboard-hero">
        <div className="consultor-dashboard-hero-overlay" aria-hidden="true" />

        <div className="consultor-dashboard-hero-copy">
          <h1>Olá, António Portugal!</h1>
          <p>Estamos aqui para te ajudar a melhorar o currículo</p>
        </div>
      </header>

      <section className="consultor-dashboard-summary" aria-label="Métricas">
        {metricCards.map((metric) => (
          <article key={metric.title} className={`consultor-dashboard-summary-card ${metric.widthClass}`}>
            <img src={metric.icon} alt="" aria-hidden="true" className="consultor-dashboard-summary-icon" />

            <div className="consultor-dashboard-summary-copy">
              <h2>{metric.title}</h2>
              <p>{metric.value}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="consultor-dashboard-alerts" aria-label="Alertas">
        <DashboardAction
          type="is-message"
          icon="https://www.figma.com/api/mcp/asset/705c415b-1097-4e95-a2b7-0ef4fd0115bc"
          title="Tem mensagens por ler"
          subtitle="Acede agora às notificações, para ver mais"
        />

        <DashboardAction
          type="is-objective"
          icon="https://www.figma.com/api/mcp/asset/ab6ae11b-d4be-4e95-9473-111119786903"
          title="Objetivo Por Completar"
          subtitle="3 dias até o próximo objetivo expirar"
        />

        <DashboardAction
          type="is-points"
          icon="https://www.figma.com/api/mcp/asset/c6080d40-1dd3-42d1-a061-18034566db9c"
          title="Pontuação total"
          subtitle="Não pares por aqui, candidata-te a mais badges"
          value="550"
        />
      </section>

      <section className="consultor-dashboard-bottom-grid" aria-label="Badges">
        <article className="consultor-dashboard-card">
          <header className="consultor-dashboard-card-header">
            <h2>Badges Recomendados</h2>
          </header>

          <div className="consultor-dashboard-card-body">
            {recommendedBadges.map((badge) => (
              <BadgeRow key={`${badge.name}-${badge.subtitle}`} badge={badge} />
            ))}
          </div>
        </article>

        <article className="consultor-dashboard-card consultor-dashboard-card--my-badges">
          <header className="consultor-dashboard-card-header consultor-dashboard-card-header--with-action">
            <h2>Os meus badges</h2>
            <span className="consultor-dashboard-card-chevron">›</span>
          </header>

          <div className="consultor-dashboard-card-body consultor-dashboard-card-body--my-badges">
            {myBadges.map((badge) => (
              <BadgeRow key={`${badge.name}-${badge.status}`} badge={badge} isLarge />
            ))}
          </div>
        </article>
      </section>
    </section>
  )
}

export default DashboardView
