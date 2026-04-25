import { Card, Col, Row } from 'react-bootstrap'
import { HiOutlineChevronRight } from 'react-icons/hi'
import { MdOutlineNotifications, MdOutlineTaskAlt, MdOutlineEmojiEvents } from 'react-icons/md'
import './consultor-home.css'

function ConsultorHomeView() {
  const user = {
    name: 'António Portugal',
    greeting: 'Estamos aqui para te ajudar a melhorar o currículo'
  }

  const metrics = [
    { label: 'Área', value: '50%', color: '#369BFF' },
    { label: 'Service Line', value: '40%', color: '#08B1BA' },
    { label: 'Learning Path', value: '25%', color: '#369BFF' }
  ]

  const badgesRecommended = [
    { id: 1, name: 'Citzen Developer', subtitle: 'LowCode(Outsystems)', image: 'https://via.placeholder.com/56' },
    { id: 2, name: 'Team Lider Beginner', subtitle: 'Talent Management', image: 'https://via.placeholder.com/56' },
    { id: 3, name: 'DevOps Intermidiate', subtitle: 'DevOps', image: 'https://via.placeholder.com/56' },
    { id: 4, name: 'DevOps Intermidiate', subtitle: 'DevOps', image: 'https://via.placeholder.com/56' },
    { id: 5, name: 'DevOps Intermidiate', subtitle: 'DevOps', image: 'https://via.placeholder.com/56' }
  ]

  const badgesMy = [
    { id: 1, name: 'Citzen Developer', status: 'Expirado', image: 'https://via.placeholder.com/56' },
    { id: 2, name: 'Team Lider Beginner', status: 'Desctivo', image: 'https://via.placeholder.com/56' },
    { id: 3, name: 'DevOps Intermidiate', status: 'Em Análise', image: 'https://via.placeholder.com/56' },
    { id: 4, name: 'DevOps Intermidiate', status: 'Aceite', image: 'https://via.placeholder.com/56' },
    { id: 5, name: 'DevOps Intermidiate', status: 'Recusado', image: 'https://via.placeholder.com/56' }
  ]

  return (
    <section className="consultor-home-page">
      {/* Hero Section */}
      <div className="consultor-hero">
        <div className="consultor-hero-content">
          <h1>Olá, {user.name}!</h1>
          <p>{user.greeting}</p>
        </div>
      </div>

      {/* Metrics Cards */}
      <Row className="metrics-row g-3 mb-4">
        {metrics.map((metric) => (
          <Col key={metric.label} lg={4} md={6} sm={12}>
            <Card className="metric-card">
              <Card.Body className="metric-card-body">
                <div className="metric-icon" style={{ borderColor: metric.color }}>
                  <div className="metric-progress" style={{ borderColor: metric.color }}>
                    <span className="metric-value">{metric.value}</span>
                  </div>
                </div>
                <h5 className="metric-label">{metric.label}</h5>
                <button className="metric-arrow">
                  <HiOutlineChevronRight size={20} />
                </button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Alert Cards */}
      <div className="alert-cards mb-4">
        {/* Messages Card */}
        <Card className="alert-card">
          <Card.Body className="alert-card-body">
            <div className="alert-icon-wrapper">
              <div className="alert-icon message-icon">
                <MdOutlineNotifications size={28} />
              </div>
            </div>
            <div className="alert-content">
              <h5>Tem mensagens por ler</h5>
              <p>Acede agora às notificações, para ver mais</p>
            </div>
            <button className="alert-arrow">
              <HiOutlineChevronRight size={24} />
            </button>
          </Card.Body>
        </Card>

        {/* Objectives Card */}
        <Card className="alert-card">
          <Card.Body className="alert-card-body">
            <div className="alert-icon-wrapper">
              <div className="alert-icon objective-icon">
                <MdOutlineTaskAlt size={28} />
              </div>
            </div>
            <div className="alert-content">
              <h5>Objetivo Por Completar</h5>
              <p><strong>3 dias</strong> até o próximo objetivo expirar</p>
            </div>
            <button className="alert-arrow">
              <HiOutlineChevronRight size={24} />
            </button>
          </Card.Body>
        </Card>

        {/* Points Card */}
        <Card className="alert-card">
          <Card.Body className="alert-card-body">
            <div className="alert-icon-wrapper">
              <div className="alert-icon points-icon">
                <MdOutlineEmojiEvents size={28} />
              </div>
            </div>
            <div className="alert-content flex-grow">
              <h5>Pontuação total</h5>
              <p>Não pares por aqui, candidata-te a mais badges</p>
            </div>
            <div className="points-value">550</div>
          </Card.Body>
        </Card>
      </div>

      {/* Badges Sections */}
      <Row className="badges-row g-4">
        {/* Recommended Badges */}
        <Col lg={6}>
          <Card className="badges-card">
            <Card.Header className="badges-card-header">
              <h5 className="mb-0">Badges Recomendados</h5>
            </Card.Header>
            <Card.Body className="badges-card-body">
              {badgesRecommended.map((badge) => (
                <div key={badge.id} className="badge-item">
                  <img src={badge.image} alt={badge.name} className="badge-image" />
                  <div className="badge-info">
                    <h6>{badge.name}</h6>
                    <p>{badge.subtitle}</p>
                  </div>
                  <button className="badge-action">
                    <span className="add-icon">+</span>
                  </button>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        {/* My Badges */}
        <Col lg={6}>
          <Card className="badges-card">
            <Card.Header className="badges-card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Os meus badges</h5>
              <button className="see-more-btn">
                Ver mais <HiOutlineChevronRight size={16} />
              </button>
            </Card.Header>
            <Card.Body className="badges-card-body">
              {badgesMy.map((badge) => (
                <div key={badge.id} className="badge-item">
                  <img src={badge.image} alt={badge.name} className="badge-image" />
                  <div className="badge-info">
                    <h6>{badge.name}</h6>
                    <p>{badge.status}</p>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </section>
  )
}

export default ConsultorHomeView
