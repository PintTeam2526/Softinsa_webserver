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
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#0078d4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.4908 9.39785C20.4908 11.6511 19.5957 13.8121 18.0024 15.4054C16.409 16.9987 14.2481 17.8939 11.9948 17.8939C9.7415 17.8939 7.58051 16.9987 5.9872 15.4054C4.39389 13.8121 3.49878 11.6511 3.49878 9.39785C3.49878 7.14458 4.39389 4.98359 5.9872 3.39028C7.58051 1.79697 9.7415 0.901855 11.9948 0.901855C14.2481 0.901855 16.409 1.79697 18.0024 3.39028C19.5957 4.98359 20.4908 7.14458 20.4908 9.39785Z" />
            <path d="M4.63546 13.5653L0.857178 20.1105L4.93889 19.0168L6.03432 23.0985L9.31204 17.4208M19.3646 13.5653L23.1429 20.1105L19.0595 19.0168L17.9657 23.0985L14.688 17.4208M12.3429 4.78477L13.5137 7.1402C13.5392 7.20005 13.5803 7.25189 13.6328 7.29022C13.6854 7.32855 13.7473 7.35195 13.812 7.35792L16.4126 7.7522C16.487 7.76172 16.5572 7.79226 16.6149 7.84026C16.6725 7.88826 16.7153 7.95171 16.7381 8.02317C16.761 8.09463 16.763 8.17113 16.7439 8.24368C16.7248 8.31623 16.6854 8.38183 16.6303 8.43277L14.7086 10.2568C14.6798 10.3112 14.6647 10.3718 14.6647 10.4333C14.6647 10.4949 14.6798 10.5555 14.7086 10.6099L15.0772 13.1951C15.0932 13.27 15.087 13.3479 15.0594 13.4194C15.0318 13.4909 14.984 13.5527 14.9218 13.5975C14.8596 13.6422 14.7858 13.6678 14.7092 13.6713C14.6327 13.6747 14.5568 13.6558 14.4909 13.6168L12.1766 12.3928C12.1168 12.3658 12.0519 12.3519 11.9863 12.3519C11.9207 12.3519 11.8558 12.3658 11.796 12.3928L9.48175 13.6168C9.41587 13.6547 9.34043 13.6728 9.26451 13.6689C9.18859 13.6649 9.11543 13.6391 9.05384 13.5945C8.99225 13.55 8.94486 13.4886 8.91737 13.4177C8.88987 13.3468 8.88346 13.2695 8.89889 13.1951L9.33432 10.6099C9.35321 10.55 9.35683 10.4863 9.34485 10.4246C9.33288 10.363 9.30569 10.3053 9.26575 10.2568L7.34746 8.41734C7.29591 8.36579 7.25967 8.30094 7.24275 8.23002C7.22584 8.1591 7.22892 8.08488 7.25166 8.01561C7.2744 7.94633 7.31589 7.88472 7.37154 7.83761C7.42719 7.79051 7.49481 7.75976 7.56689 7.74877L10.1657 7.37163C10.2305 7.36566 10.2924 7.34227 10.3449 7.30393C10.3975 7.2656 10.4386 7.21376 10.464 7.15392L11.6349 4.79849C11.6661 4.73163 11.7154 4.67486 11.7772 4.63463C11.839 4.59439 11.9109 4.5723 11.9846 4.57087C12.0584 4.56945 12.131 4.58873 12.1944 4.62655C12.2577 4.66436 12.3092 4.71918 12.3429 4.78477Z" />
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

        <a
          href="https://softinsa.pt/"
          target="_blank"
          rel="noopener noreferrer"
          className="welcome-btn-softinsa"
          aria-label="Visitar o site da Softinsa"
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="welcome-btn-softinsa-ext">
            <path d="M6.5 9.5a4.243 4.243 0 0 0 6 0l2-2a4.243 4.243 0 0 0-6-6L7.5 2.5M9.5 6.5a4.243 4.243 0 0 0-6 0l-2 2a4.243 4.243 0 0 0 6 6l1-1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>softinsa.pt</span>
          <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className="welcome-btn-softinsa-ext">
            <path d="M2 10L10 2M10 2H5M10 2v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>

    </div>
  )
}

export default WelcomeView