import React from 'react'
import { Card, Col, Row, Button } from 'react-bootstrap'
import { HiOutlineChevronRight, HiOutlineCalendar, HiOutlineFlag } from 'react-icons/hi'
import { MdOutlineCheckCircle, MdOutlineAccessTime } from 'react-icons/md'
import './consultor-objectives.css'

function ConsultorObjectivesView() {
  const [filter, setFilter] = React.useState('all')

  const objectives = [
    {
      id: 1,
      title: 'Completar Curso de Cloud Computing',
      description: 'Terminar o curso de AWS Cloud Essentials',
      status: 'active',
      progress: 75,
      daysLeft: 3,
      category: 'Aprendizagem',
      deadline: '15/04/2026',
      skills: ['Cloud', 'AWS']
    },
    {
      id: 2,
      title: 'Obter Certificação DevOps',
      description: 'Passar no exame de certificação DevOps Foundation',
      status: 'active',
      progress: 45,
      daysLeft: 7,
      category: 'Certificação',
      deadline: '21/04/2026',
      skills: ['DevOps', 'CI/CD']
    },
    {
      id: 3,
      title: 'Liderança de Projeto',
      description: 'Liderar um projeto cross-funcional com sucesso',
      status: 'completed',
      progress: 100,
      daysLeft: 0,
      category: 'Liderança',
      deadline: '10/04/2026',
      skills: ['Liderança', 'Gestão']
    },
    {
      id: 4,
      title: 'Desenvolver Habilidades em Python',
      description: 'Completar 50 horas de aprendizado em Python',
      status: 'pending',
      progress: 20,
      daysLeft: 14,
      category: 'Desenvolvimento',
      deadline: '28/04/2026',
      skills: ['Python', 'Programação']
    },
    {
      id: 5,
      title: 'Mentoria de Junior Developer',
      description: 'Mentorizar um junior developer durante 3 meses',
      status: 'pending',
      progress: 35,
      daysLeft: 21,
      category: 'Mentoría',
      deadline: '05/05/2026',
      skills: ['Mentoría', 'Desenvolvimento']
    },
    {
      id: 6,
      title: 'Melhorar Comunicação Interpessoal',
      description: 'Completar treinamento de comunicação efetiva',
      status: 'completed',
      progress: 100,
      daysLeft: 0,
      category: 'Soft Skills',
      deadline: '01/04/2026',
      skills: ['Comunicação', 'Soft Skills']
    }
  ]

  const filteredObjectives = filter === 'all' 
    ? objectives 
    : objectives.filter(obj => obj.status === filter)

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return <span className="status-badge completed">Completado</span>
      case 'active':
        return <span className="status-badge active">Ativo</span>
      case 'pending':
        return <span className="status-badge pending">Pendente</span>
      default:
        return null
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed':
        return <MdOutlineCheckCircle className="status-icon completed" />
      case 'active':
        return <HiOutlineFlag className="status-icon active" />
      case 'pending':
        return <MdOutlineAccessTime className="status-icon pending" />
      default:
        return null
    }
  }

  return (
    <section className="consultor-objectives-page">
      {/* Page Header */}
      <div className="objectives-page-header">
        <div className="objectives-header-content">
          <h1>Objetivos</h1>
          <p>Acompanha o teu progresso e cumpre os teus objetivos profissionais</p>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="stats-row g-3 mb-4">
        <Col md={6} lg={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-number">
                {objectives.filter(o => o.status === 'completed').length}
              </div>
              <p className="stat-label">Completados</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-number">
                {objectives.filter(o => o.status === 'active').length}
              </div>
              <p className="stat-label">Ativos</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-number">
                {objectives.filter(o => o.status === 'pending').length}
              </div>
              <p className="stat-label">Pendentes</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-number">
                {objectives.length}
              </div>
              <p className="stat-label">Total</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <div className="objectives-filters mb-4">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Todos ({objectives.length})
        </button>
        <button
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Ativos ({objectives.filter(o => o.status === 'active').length})
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completados ({objectives.filter(o => o.status === 'completed').length})
        </button>
        <button
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pendentes ({objectives.filter(o => o.status === 'pending').length})
        </button>
      </div>

      {/* Objectives List */}
      <Row className="objectives-grid g-4">
        {filteredObjectives.map((objective) => (
          <Col key={objective.id} lg={6} md={12}>
            <Card className={`objective-card status-${objective.status}`}>
              <Card.Body>
                <div className="objective-header">
                  <div className="objective-title-wrapper">
                    {getStatusIcon(objective.status)}
                    <div className="objective-title-section">
                      <h5>{objective.title}</h5>
                      <p className="objective-description">{objective.description}</p>
                    </div>
                  </div>
                  {getStatusBadge(objective.status)}
                </div>

                {/* Progress Bar */}
                {objective.status !== 'completed' && (
                  <div className="progress-section">
                    <div className="progress-header">
                      <span className="progress-label">Progresso</span>
                      <span className="progress-percent">{objective.progress}%</span>
                    </div>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        style={{ width: `${objective.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Meta Information */}
                <div className="objective-meta">
                  <div className="meta-item">
                    <HiOutlineCalendar className="meta-icon" />
                    <span className="meta-label">Deadline:</span>
                    <span className="meta-value">{objective.deadline}</span>
                  </div>
                  {objective.daysLeft > 0 && (
                    <div className="meta-item">
                      <MdOutlineAccessTime className="meta-icon" />
                      <span className="meta-label">Faltam:</span>
                      <span className="meta-value">{objective.daysLeft} dias</span>
                    </div>
                  )}
                  <div className="meta-item">
                    <span className="meta-label">Categoria:</span>
                    <span className="meta-value">{objective.category}</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="objective-skills">
                  {objective.skills.map((skill, idx) => (
                    <span key={idx} className="skill-tag">{skill}</span>
                  ))}
                </div>

                {/* Action Button */}
                <Button className="objective-action-btn">
                  Ver Detalhes
                  <HiOutlineChevronRight />
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  )
}

export default ConsultorObjectivesView
