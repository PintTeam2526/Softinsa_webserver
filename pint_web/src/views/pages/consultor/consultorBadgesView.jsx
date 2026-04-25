import React from 'react'
import { Card, Col, Row, Form } from 'react-bootstrap'
import { HiOutlineSearch, HiOutlineChevronRight } from 'react-icons/hi'
import './consultor-badges.css'

function ConsultorBadgesView() {
  const [activeTab, setActiveTab] = React.useState('recommended')

  const badgesRecommended = [
    {
      id: 1,
      name: 'Citzen Developer',
      subtitle: 'LowCode(Outsystems)',
      category: 'Beginner',
      image: 'https://via.placeholder.com/120'
    },
    {
      id: 2,
      name: 'Team Lider Beginner',
      subtitle: 'Talent Management',
      category: 'Intermediate',
      image: 'https://via.placeholder.com/120'
    },
    {
      id: 3,
      name: 'DevOps Intermidiate',
      subtitle: 'DevOps',
      category: 'Intermediate',
      image: 'https://via.placeholder.com/120'
    },
    {
      id: 4,
      name: 'DevOps Advanced',
      subtitle: 'DevOps',
      category: 'Advanced',
      image: 'https://via.placeholder.com/120'
    },
    {
      id: 5,
      name: 'Cloud Architect',
      subtitle: 'Cloud Computing',
      category: 'Advanced',
      image: 'https://via.placeholder.com/120'
    },
    {
      id: 6,
      name: 'Security Expert',
      subtitle: 'Cybersecurity',
      category: 'Expert',
      image: 'https://via.placeholder.com/120'
    }
  ]

  const badgesMy = [
    {
      id: 1,
      name: 'Citzen Developer',
      category: 'Beginner',
      status: 'Expirado',
      statusClass: 'expired',
      earnedDate: '15/01/2024',
      image: 'https://via.placeholder.com/120'
    },
    {
      id: 2,
      name: 'Team Lider Beginner',
      category: 'Intermediate',
      status: 'Ativo',
      statusClass: 'active',
      earnedDate: '10/02/2024',
      image: 'https://via.placeholder.com/120'
    },
    {
      id: 3,
      name: 'DevOps Intermidiate',
      category: 'Intermediate',
      status: 'Em Análise',
      statusClass: 'pending',
      earnedDate: '20/02/2024',
      image: 'https://via.placeholder.com/120'
    },
    {
      id: 4,
      name: 'DevOps Advanced',
      category: 'Advanced',
      status: 'Aceite',
      statusClass: 'accepted',
      earnedDate: '05/03/2024',
      image: 'https://via.placeholder.com/120'
    },
    {
      id: 5,
      name: 'Cloud Architect',
      category: 'Advanced',
      status: 'Recusado',
      statusClass: 'rejected',
      earnedDate: '12/03/2024',
      image: 'https://via.placeholder.com/120'
    }
  ]

  return (
    <section className="consultor-badges-page">
      {/* Page Header */}
      <div className="badges-page-header">
        <div className="badges-header-content">
          <h1>Badges</h1>
          <p>Descobre e conquista badges para melhorar o teu currículo</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="badges-search-section mb-4">
        <div className="search-wrapper">
          <HiOutlineSearch className="search-icon" />
          <Form.Control
            type="text"
            placeholder="Procura por badges..."
            className="badges-search-input"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="badges-tabs mb-4">
        <button
          className={`tab-button ${activeTab === 'recommended' ? 'active' : ''}`}
          onClick={() => setActiveTab('recommended')}
        >
          Recomendados para Ti
        </button>
        <button
          className={`tab-button ${activeTab === 'my' ? 'active' : ''}`}
          onClick={() => setActiveTab('my')}
        >
          Os Meus Badges
        </button>
      </div>

      {/* Recommended Badges */}
      {activeTab === 'recommended' && (
        <Row className="badges-grid g-4">
          {badgesRecommended.map((badge) => (
            <Col key={badge.id} lg={4} md={6} sm={12}>
              <Card className="badge-detail-card">
                <div className="badge-image-wrapper">
                  <img src={badge.image} alt={badge.name} className="badge-detail-image" />
                  <span className="badge-category">{badge.category}</span>
                </div>
                <Card.Body className="badge-detail-body">
                  <h5>{badge.name}</h5>
                  <p className="badge-subtitle">{badge.subtitle}</p>
                  <button className="badge-detail-btn">
                    Candidatar-me
                    <HiOutlineChevronRight />
                  </button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* My Badges */}
      {activeTab === 'my' && (
        <Row className="badges-grid g-4">
          {badgesMy.map((badge) => (
            <Col key={badge.id} lg={4} md={6} sm={12}>
              <Card className="badge-detail-card">
                <div className="badge-image-wrapper">
                  <img src={badge.image} alt={badge.name} className="badge-detail-image" />
                  <div className={`badge-status ${badge.statusClass}`}>
                    {badge.status}
                  </div>
                </div>
                <Card.Body className="badge-detail-body">
                  <h5>{badge.name}</h5>
                  <p className="badge-subtitle">{badge.category}</p>
                  <div className="badge-earned-date">
                    Obtido em: {badge.earnedDate}
                  </div>
                  <button className="badge-detail-btn">
                    Ver detalhes
                    <HiOutlineChevronRight />
                  </button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </section>
  )
}

export default ConsultorBadgesView
