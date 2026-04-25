import React, { useState } from 'react'
import { Card, Col, Row, Form, Button } from 'react-bootstrap'
import { HiOutlineSearch, HiCheckCircle, HiExclamation, HiArrowSmRight } from 'react-icons/hi'
import './consultor-pedidos.css'

function ConsultorPedidosView() {
  const [searchTerm, setSearchTerm] = useState('')

  const badgeRequests = [
    {
      id: 1,
      name: 'Citzen Developer',
      image: 'https://via.placeholder.com/45',
      evaluators: [{ initials: 'TM' }, { initials: 'SL' }],
      status: 'Em Análise',
      statusColor: 'pending',
      progress: 25,
    },
    {
      id: 2,
      name: 'Team Lider Beginner',
      image: 'https://via.placeholder.com/45',
      evaluators: [{ initials: 'TM' }, { initials: 'SL' }],
      status: 'Em Análise',
      statusColor: 'pending',
      progress: 64,
    },
    {
      id: 3,
      name: 'DevOps Intermidiate',
      image: 'https://via.placeholder.com/45',
      evaluators: [{ initials: 'TM' }, { initials: 'SL' }],
      status: 'Badge Aceite',
      statusColor: 'success',
      progress: 100,
    },
    {
      id: 4,
      name: 'Citzen Developer',
      image: 'https://via.placeholder.com/45',
      evaluators: [{ initials: 'TM' }, { initials: 'SL' }],
      status: 'Badge Recusado',
      statusColor: 'error',
      progress: 100,
    },
    {
      id: 5,
      name: 'Team Lider Beginner',
      image: 'https://via.placeholder.com/45',
      evaluators: [{ initials: 'TM' }],
      status: 'Devolvido',
      statusColor: 'warning',
      progress: 25,
    },
    {
      id: 6,
      name: 'DevOps Intermidiate',
      image: 'https://via.placeholder.com/45',
      evaluators: [{ initials: 'TM' }, { initials: 'SL' }],
      status: 'Devolvido',
      statusColor: 'warning',
      progress: 77,
    },
  ]

  const availableBadges = [
    {
      id: 1,
      name: 'Citzen Developer',
      category: 'LowCode(Outsystems)',
      image: 'https://via.placeholder.com/40',
    },
    {
      id: 2,
      name: 'Team Lider Beginner',
      category: 'Talent Management',
      image: 'https://via.placeholder.com/40',
    },
    {
      id: 3,
      name: 'DevOps Intermidiate',
      category: 'DevOps',
      image: 'https://via.placeholder.com/40',
    },
  ]

  const getStatusColor = (statusColor) => {
    switch (statusColor) {
      case 'success':
        return '#1AA053'
      case 'error':
        return '#C03221'
      case 'warning':
        return '#FFD329'
      case 'pending':
        return '#3A57E8'
      default:
        return '#E9ECEF'
    }
  }

  const getStatusLabel = (statusColor) => {
    switch (statusColor) {
      case 'success':
        return '✓'
      case 'error':
        return '✕'
      case 'warning':
        return '↻'
      case 'pending':
        return 'i'
      default:
        return ''
    }
  }

  return (
    <div className="consultor-pedidos-page">
      {/* Page Header */}
      <div className="pedidos-page-header">
        <div className="pedidos-header-content">
          <h1>Pedidos</h1>
          <p>Aqui podes acompanhar o estado das tuas candidaturas a badges e submeter novos pedidos</p>
        </div>
      </div>

      {/* Histórico de Pedidos Section */}
      <Card className="pedidos-card pedidos-history-card">
        <Card.Body className="p-0">
          <div className="pedidos-card-header">
            <div className="pedidos-card-title">
              <HiOutlineSearch className="icon" />
              <h2>Histórico de Pedidos</h2>
            </div>
          </div>

          {/* Table Headers */}
          <div className="pedidos-table-header">
            <div className="pedidos-table-col-badge">BADGE</div>
            <div className="pedidos-table-col-evaluators">AVALIADORES</div>
            <div className="pedidos-table-col-status">ESTADO</div>
          </div>

          {/* Table Rows */}
          <div className="pedidos-table-body">
            {badgeRequests.map((request, index) => (
              <div key={request.id} className="pedidos-table-row">
                <div className="pedidos-table-col-badge">
                  <img src={request.image} alt={request.name} className="badge-avatar" />
                  <span>{request.name}</span>
                </div>
                <div className="pedidos-table-col-evaluators">
                  <div className="evaluators-container">
                    {request.evaluators.map((evaluator, idx) => (
                      <div
                        key={idx}
                        className="evaluator-badge"
                        style={{
                          marginLeft: idx > 0 ? '-15px' : '0',
                        }}
                      >
                        {evaluator.initials}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pedidos-table-col-status">
                  <div className="status-container">
                    <div className="status-label">
                      <span>{request.status}</span>
                      {request.statusColor === 'success' && <HiCheckCircle className="status-icon success" />}
                      {request.statusColor === 'error' && <HiExclamation className="status-icon error" />}
                      {request.statusColor === 'warning' && <HiArrowSmRight className="status-icon warning" />}
                    </div>
                    <div className="status-progress">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${request.progress}%`,
                            backgroundColor: getStatusColor(request.statusColor),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Candidatar a um Badge Section */}
      <Card className="pedidos-card pedidos-apply-card">
        <Card.Body>
          <h2 className="pedidos-section-title">Candidatar a um Badge</h2>

          {/* Search Input */}
          <div className="pedidos-search-container">
            <HiOutlineSearch className="search-icon" />
            <input
              type="text"
              placeholder="Pesquisar por nome do badge..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Available Badges List */}
          <div className="pedidos-badges-list">
            {availableBadges.map((badge) => (
              <div key={badge.id} className="pedidos-badge-item">
                <div className="badge-info">
                  <img src={badge.image} alt={badge.name} className="badge-avatar-sm" />
                  <div className="badge-details">
                    <h3 className="badge-name">{badge.name}</h3>
                    <p className="badge-category">{badge.category}</p>
                  </div>
                </div>
                <button className="badge-apply-btn">
                  <HiOutlineSearch />
                </button>
              </div>
            ))}
          </div>

          {/* Ver Mais Badges Button */}
          <div className="pedidos-more-badges-container">
            <button className="pedidos-more-badges-btn">Ver Mais Badges</button>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default ConsultorPedidosView
