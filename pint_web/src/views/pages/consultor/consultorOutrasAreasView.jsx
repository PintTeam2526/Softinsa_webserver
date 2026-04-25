import React, { useState } from 'react'
import { Container } from 'react-bootstrap'
import './consultor-outras-areas.css'

// Image constants
const imgIcon = 'http://localhost:3845/assets/588cbfd2bea8b38542585efb2c0d705bb8a61d54.svg'
const imgChevron = 'http://localhost:3845/assets/22467f33cd625503cbd063c9e112b6cb4dea675e.svg'

const areasData = [
  {
    id: 1,
    name: 'Hybrid Cloud',
    areas: 3,
    badges: 15
  },
  {
    id: 2,
    name: 'Application Ops.',
    areas: 2,
    badges: 12
  },
  {
    id: 3,
    name: 'Sourc. & Talent Manag.',
    areas: 1,
    badges: 6
  }
]

const tabs = [
  {
    id: 'jornada-tecnica',
    name: 'Jornada Técnica',
    label: 'Jornada Técnica (Sugestão)',
    progress: 25
  },
  {
    id: 'power-skills',
    name: 'Power Skills',
    label: 'Power Skills',
    progress: 0
  }
]

function ConsultorOutrasAreasView() {
  const [activeTab, setActiveTab] = useState('jornada-tecnica')

  const handleAreaClick = (area) => {
    console.log('Clicked on area:', area)
    // Handle navigation or modal opening
  }

  return (
    <div className="outras-areas-page">
      {/* Banner */}
      <div className="outras-areas-banner">
        <div className="outras-areas-banner-content">
          <h1 className="outras-areas-banner-title">Outras Áreas</h1>
          <p className="outras-areas-banner-subtitle">Descobre novas áreas e badges que valorizam o teu percurso profissional</p>
        </div>
      </div>

      {/* Tabs and Content */}
      <div className="outras-areas-container">
        <div className="outras-areas-card">
          {/* Tabs */}
          <div className="outras-areas-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`outras-areas-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <p className="outras-areas-tab-title">{tab.name}</p>
                <p className="outras-areas-tab-progress">Progresso: {tab.progress}%</p>
              </button>
            ))}
          </div>

          {/* Areas List */}
          <div className="outras-areas-list">
            {areasData.map((area) => (
              <button
                key={area.id}
                className="outras-areas-item"
                onClick={() => handleAreaClick(area)}
              >
                <div className="outras-areas-item-content">
                  <div className="outras-areas-item-icon">
                    <img src={imgIcon} alt="area icon" />
                  </div>
                  <div className="outras-areas-item-info">
                    <p className="outras-areas-item-name">{area.name}</p>
                    <p className="outras-areas-item-meta">{area.areas} áreas • {area.badges} badges</p>
                  </div>
                </div>
                <div className="outras-areas-item-chevron">
                  <img src={imgChevron} alt="navigate" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConsultorOutrasAreasView
