import React, { useState } from 'react'
import { Container } from 'react-bootstrap'
import './consultor-perfil-publico.css'

// Image constants
const imgBearedGuy02Min1 = 'http://localhost:3845/assets/7ffed3a9c0dc8d07848a7a822fc8ff982d8e671f.png'
const imgSearch = 'http://localhost:3845/assets/735ec776c0c41c37329638609b923cf1e0925bef.svg'
const imgVectorPoints = 'http://localhost:3845/assets/31d386521a9921b9a382c98e6eb906f33b7940d7.svg'
const imgAccept = 'http://localhost:3845/assets/faeada7168a0eb04471bed13f552a9f1c1293299.svg'
const imgEmail = 'http://localhost:3845/assets/79171258a1c348778e3c9c1867b59d301c68f3e1.svg'
const imgBadgesIcon = 'http://localhost:3845/assets/c379d967a0dea9cfcfd0228c02ae3cf24f808423.svg'

// Sample badge images
const imgBadge1 = 'http://localhost:3845/assets/34092422fec34f7138cd22f625b67823940cf58f.png'
const imgBadge2 = 'http://localhost:3845/assets/b383293a5bd03592c863205896c17eff5a3db066.png'
const imgBadge3 = 'http://localhost:3845/assets/24c4166e10b0ee7c2ea132bb91b450e18b799b6b.png'

const BadgeItem = ({ image, name, date }) => (
  <div className="perfil-badge-item">
    <div className="perfil-badge-image">
      <img src={image} alt={name} />
    </div>
    <p className="perfil-badge-name">{name}</p>
    <p className="perfil-badge-date">{date}</p>
  </div>
)

const badgesData = [
  { id: 1, name: 'Citzen Developer', date: '31/12/2025', image: imgBadge1 },
  { id: 2, name: 'Team Lider Beginner', date: '31/12/2025', image: imgBadge2 },
  { id: 3, name: 'DevOps Intermidiate', date: '31/12/2025', image: imgBadge3 },
  { id: 4, name: 'Citzen Developer', date: '31/12/2025', image: imgBadge1 },
  { id: 5, name: 'Team Lider Beginner', date: '31/12/2025', image: imgBadge2 },
  { id: 6, name: 'DevOps Intermidiate', date: '31/12/2025', image: imgBadge3 },
  { id: 7, name: 'Citzen Developer', date: '31/12/2025', image: imgBadge1 },
  { id: 8, name: 'Team Lider Beginner', date: '31/12/2025', image: imgBadge2 },
  { id: 9, name: 'DevOps Intermidiate', date: '31/12/2025', image: imgBadge3 }
]

function ConsultorPerfilPublicoView() {
  const [searchValue, setSearchValue] = useState('')

  const handleSearch = (e) => {
    setSearchValue(e.target.value)
  }

  return (
    <div className="perfil-publico-page">
      {/* Banner */}
      <div className="perfil-banner">
        <div className="perfil-banner-content">
          <h1 className="perfil-banner-title">Perfil Público</h1>
          <p className="perfil-banner-subtitle">Estamos aqui para te ajudar a melhorar o currículo</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="perfil-container">
        {/* Search Bar */}
        <div className="perfil-search-wrapper">
          <div className="perfil-search">
            <img src={imgSearch} alt="search" className="perfil-search-icon" />
            <input
              type="text"
              placeholder="Pesquisar nome do consultor…"
              value={searchValue}
              onChange={handleSearch}
              className="perfil-search-input"
            />
          </div>
        </div>

        {/* Profile Card */}
        <div className="perfil-profile-card">
          <div className="perfil-profile-left">
            <div className="perfil-profile-image">
              <img src={imgBearedGuy02Min1} alt="profile" />
            </div>
            <div className="perfil-profile-info">
              <div className="perfil-profile-header">
                <h2 className="perfil-profile-name">António Portugal</h2>
                <div className="perfil-profile-role">
                  <span className="perfil-role-divider">—</span>
                  <span>Consultor</span>
                </div>
              </div>
              <p className="perfil-profile-detail">Área: LowCode (Outsystems)</p>
              <p className="perfil-profile-detail">Service Line: Hybrid Cloud</p>
              <p className="perfil-profile-detail">Learning Path: Jornada Técnica</p>
            </div>
          </div>

          <div className="perfil-profile-divider"></div>

          <div className="perfil-profile-right">
            <div className="perfil-profile-stat">
              <img src={imgVectorPoints} alt="points" className="perfil-stat-icon" />
              <p className="perfil-stat-value">550 Pontos</p>
            </div>
            <div className="perfil-profile-stat">
              <img src={imgAccept} alt="badges" className="perfil-stat-icon" />
              <p className="perfil-stat-value">9 Badges Obtidos</p>
            </div>
            <div className="perfil-profile-stat">
              <img src={imgEmail} alt="email" className="perfil-stat-icon" />
              <p className="perfil-stat-value">antoniopt@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="perfil-badges-card">
          <div className="perfil-badges-header">
            <img src={imgBadgesIcon} alt="badges" className="perfil-badges-header-icon" />
            <h3 className="perfil-badges-title">Badges Obtidos</h3>
          </div>

          <div className="perfil-badges-grid">
            {badgesData.map((badge) => (
              <BadgeItem key={badge.id} image={badge.image} name={badge.name} date={badge.date} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConsultorPerfilPublicoView
