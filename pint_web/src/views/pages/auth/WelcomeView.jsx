import './WelcomeView.css'

function WelcomeView() {
  return (
    <div className="welcome-page">

      <div className="welcome-bg" aria-hidden="true">
        <div className="welcome-ring welcome-ring-1" />
        <div className="welcome-ring welcome-ring-2" />
        <div className="welcome-ring welcome-ring-3" />
        <div className="welcome-dots" />
      </div>

      <div className="welcome-stats" aria-hidden="true">
        <div className="welcome-stat-card welcome-stat-left-1">
          <span className="welcome-stat-value">1050</span>
          <span className="welcome-stat-label">Badges Atribuídos</span>
        </div>
        <div className="welcome-stat-card welcome-stat-left-2">
          <span className="welcome-stat-value">180</span>
          <span className="welcome-stat-label">Consultores Ativos</span>
        </div>
        <div className="welcome-stat-card welcome-stat-right-1">
          <span className="welcome-stat-value">67</span>
          <span className="welcome-stat-label">Áreas</span>
        </div>
        <div className="welcome-stat-card welcome-stat-right-2">
          <span className="welcome-stat-value">2040</span>
          <span className="welcome-stat-label">Pedidos Respondidos</span>
        </div>
      </div>

      <div className="welcome-content">
        <div className="welcome-logo" aria-hidden="true">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="26" r="12" fill="#deecf9" stroke="#0078d4" strokeWidth="1.5" />
            <circle cx="20" cy="26" r="8.5" fill="#0078d4" />
            <path d="M20 20.5l1.5 4.6h4.8l-3.9 2.8 1.5 4.6L20 29.7l-3.9 2.8 1.5-4.6-3.9-2.8h4.8z" fill="#ffffff" />
            <path d="M14.5 15l-2.5-7h16l-2.5 7" fill="#50a0e4" stroke="#0078d4" strokeWidth="1.2" strokeLinejoin="round" />
            <rect x="17" y="6" width="6" height="3" rx="1.5" fill="#0078d4" />
          </svg>
        </div>

        <h1 className="welcome-title">
          Plataforma de Badges da<br />
          <span className="welcome-title-brand">Softinsa</span>
        </h1>

        <div className="welcome-actions">
          <a href="/badges" className="welcome-btn-primary">
            Ver badges da plataforma
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="welcome-btn-arrow">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a href="/login" className="welcome-btn-secondary">
            Iniciar sessão
          </a>
        </div>
      </div>

    </div>
  )
}

export default WelcomeView