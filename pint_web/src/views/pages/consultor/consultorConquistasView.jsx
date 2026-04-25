import React, { useState } from 'react'
import { Container, Table } from 'react-bootstrap'
import './consultor-conquistas.css'

// Image constants
const imgSearch = 'http://localhost:3845/assets/735ec776c0c41c37329638609b923cf1e0925bef.svg'
const imgNotification = 'http://localhost:3845/assets/2bd04c7baab01f9499de972f5fba063af2db7ae5.svg'
const imgBearedGuy02Min1 = 'http://localhost:3845/assets/7ffed3a9c0dc8d07848a7a822fc8ff982d8e671f.png'
const imgImage = 'http://localhost:3845/assets/e587368a9c0fa9bda054f81670df76a6ab4af11b.png'

const ConquistasTableRow = ({ icon, title, progressValue, progressColor, rowBg = 'white' }) => {
  const progressPercentage = parseInt(progressValue)
  const progressColorMap = {
    0: '#39639c',
    25: '#369bff',
    50: '#05666c',
    75: '#1aa053',
    100: '#409900'
  }
  
  const color = progressColorMap[progressValue] || progressColor

  return (
    <tr className={`conquistas-table-row ${rowBg === 'gray' ? 'conquistas-row-gray' : ''}`}>
      <td className="conquistas-cell-description">
        <div className="d-flex align-items-center gap-3">
          <img src={icon} alt="achievement" className="rounded-circle" width="45" height="45" />
          <span className="conquistas-achievement-name">{title}</span>
        </div>
      </td>
      <td className="conquistas-cell-progress">
        <div className="progress-container">
          <div className="progress-bar-wrapper">
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${progressPercentage}%`,
                  backgroundColor: color
                }}
              />
            </div>
            <span className="progress-text">{progressValue}%</span>
          </div>
        </div>
      </td>
    </tr>
  )
}

function ConsultorConquistasView() {
  const conquistas = [
    {
      id: 1,
      title: 'Obter todos os Badges de uma Área',
      progress: 0,
      color: '#39639c'
    },
    {
      id: 2,
      title: 'Obter 50 badge',
      progress: 25,
      color: '#369bff'
    },
    {
      id: 3,
      title: 'Obter 10 badge',
      progress: 50,
      color: '#05666c'
    },
    {
      id: 4,
      title: 'Obter 3 badge',
      progress: 75,
      color: '#1aa053'
    },
    {
      id: 5,
      title: 'Obter 1 badge',
      progress: 100,
      color: '#409900'
    }
  ]

  return (
    <div className="conquistas-page">
      {/* Banner */}
      <div className="conquistas-banner">
        <div className="conquistas-banner-content">
          <h1 className="conquistas-banner-title">Conquistas</h1>
          <p className="conquistas-banner-subtitle">Alcança estes marcos e progride na carreira</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="conquistas-container">
        <div className="conquistas-card">
          <div className="conquistas-card-header">
            <div className="conquistas-card-title-wrapper">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2L17.09 10.26H26L19.55 15.74L22.64 24L14 18.52L5.36 24L8.45 15.74L2 10.26H10.91L14 2Z" fill="#232D42" />
              </svg>
              <h2 className="conquistas-card-title">Histórico de Conquistas</h2>
            </div>
          </div>

          <div className="conquistas-table-wrapper">
            <table className="conquistas-table">
              <thead>
                <tr className="conquistas-table-header">
                  <th className="conquistas-cell-description">DESCRIÇÃO</th>
                  <th className="conquistas-cell-progress">PROGRESSO</th>
                </tr>
              </thead>
              <tbody>
                {conquistas.map((conquista, index) => (
                  <ConquistasTableRow
                    key={conquista.id}
                    icon={imgImage}
                    title={conquista.title}
                    progressValue={conquista.progress}
                    progressColor={conquista.color}
                    rowBg={index % 2 === 1 ? 'gray' : 'white'}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConsultorConquistasView
