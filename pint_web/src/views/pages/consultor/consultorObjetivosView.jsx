import React, { useState } from 'react'
import { HiOutlineCheckCircle } from 'react-icons/hi'
import './consultor-objetivos.css'

function ConsultorObjetivosView() {
  const [objectives, setObjectives] = useState([
    {
      id: 1,
      description: 'Completar 1 badge da SL de Hybrid Cloud',
      status: 'Em Andamento',
      statusIcon: 'progress',
      date: '5/10/2026',
      image: 'https://via.placeholder.com/45',
    },
    {
      id: 2,
      description: 'Completar 1 badge da SL de Hybrid Cloud',
      status: 'Em Andamento',
      statusIcon: 'progress',
      date: '6/10/2026',
      image: 'https://via.placeholder.com/45',
    },
    {
      id: 3,
      description: 'Completar 1 badge da SL de Hybrid Cloud',
      status: 'Concluído',
      statusIcon: 'success',
      date: '5/1/2026',
      image: 'https://via.placeholder.com/45',
    },
    {
      id: 4,
      description: 'Completar 1 badge da SL de Hybrid Cloud',
      status: 'Expirado',
      statusIcon: 'expired',
      date: '6/1/2026',
      image: 'https://via.placeholder.com/45',
    },
  ])

  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleAddObjective = () => {
    if (description.trim()) {
      const newObjective = {
        id: objectives.length + 1,
        description: description,
        status: 'Em Andamento',
        statusIcon: 'progress',
        date: endDate || new Date().toLocaleDateString('pt-PT'),
        image: 'https://via.placeholder.com/45',
      }
      setObjectives([...objectives, newObjective])
      setDescription('')
      setStartDate('')
      setEndDate('')
    }
  }

  const getStatusLabel = (statusIcon) => {
    switch (statusIcon) {
      case 'success':
        return '✓'
      case 'expired':
        return '✕'
      case 'progress':
      default:
        return 'i'
    }
  }

  return (
    <div className="consultor-objetivos-page">
      {/* Page Header */}
      <div className="objetivos-page-header">
        <div className="objetivos-header-content">
          <h1>Objetivos</h1>
          <p>Define objetivos para melhorar a tua organização</p>
        </div>
      </div>

      {/* Objetivos Table Card */}
      <div className="objetivos-card">
        <div className="objetivos-card-header">
          <div className="objetivos-card-title">
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2>Objetivos</h2>
          </div>
        </div>

        {/* Table Headers */}
        <div className="objetivos-table-header">
          <div className="objetivos-col-description">DESCRIÇÃO</div>
          <div className="objetivos-col-status">ESTADO</div>
          <div className="objetivos-col-date">DATA OBJETIVO</div>
          <div className="objetivos-col-actions">AÇÕES</div>
        </div>

        {/* Table Body */}
        <div className="objetivos-table-body">
          {objectives.map((objective) => (
            <div key={objective.id} className="objetivos-table-row">
              <div className="objetivos-col-description">
                <img src={objective.image} alt={objective.description} className="objective-avatar" />
                <span className="description-text">{objective.description}</span>
              </div>
              <div className="objetivos-col-status">
                <span className="status-label">{objective.status}</span>
                <span className={`status-icon status-${objective.statusIcon}`}>
                  {getStatusLabel(objective.statusIcon)}
                </span>
              </div>
              <div className="objetivos-col-date">{objective.date}</div>
              <div className="objetivos-col-actions">
                <button className="action-btn">
                  <HiOutlineCheckCircle />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Objective Section */}
      <div className="objetivos-add-card">
        <h3 className="add-objetivos-title">Adicionar Objetivo</h3>

        <div className="form-group">
          <label>Descrição:</label>
          <textarea
            className="form-textarea"
            placeholder="Digite a descrição do objetivo..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-dates">
          <div className="form-group">
            <label>Data Objetivos:</label>
            <div className="date-range">
              <input
                type="date"
                className="form-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="date-separator">até</span>
              <input
                type="date"
                className="form-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="add-button-container">
          <button className="add-objetivo-btn" onClick={handleAddObjective}>
            + Adicionar Objetivo
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConsultorObjetivosView
