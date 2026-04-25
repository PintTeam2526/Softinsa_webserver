import React, { useState } from 'react'
import { HiOutlineFilter } from 'react-icons/hi'
import './consultor-badges-lists.css'

function ConsultorBadgesListsView() {
  const [selectedFilters, setSelectedFilters] = useState([])

  const filterButtons = [
    { id: 'favorites', icon: '★', label: 'Favoritos' },
    { id: 'analysis', icon: 'i', label: 'Em análise' },
    { id: 'obtained', icon: '✓', label: 'Obtidos' },
    { id: 'pending', icon: '?', label: 'Por Obter' },
    { id: 'expired', icon: '📅', label: 'Expirados' },
    { id: 'returned', icon: '↻', label: 'Devolvidos' },
    { id: 'all', icon: '🌍', label: 'Todos' },
  ]

  const handleFilterClick = (filterId) => {
    if (filterId === 'all') {
      setSelectedFilters(selectedFilters.includes('all') ? [] : ['all'])
    } else {
      setSelectedFilters((prev) => {
        const newFilters = prev.filter((f) => f !== 'all')
        if (newFilters.includes(filterId)) {
          return newFilters.filter((f) => f !== filterId)
        } else {
          return [...newFilters, filterId]
        }
      })
    }
  }

  return (
    <div className="consultor-badges-lists-page">
      {/* Page Header */}
      <div className="badges-lists-page-header">
        <div className="badges-lists-header-content">
          <h1>Listas de Badges</h1>
          <p>Encontra ou teus badges de forma mais eficiente</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="badges-lists-filter-container">
        <div className="badges-lists-filter-label">
          <HiOutlineFilter className="filter-icon" />
          <span>Selecione um Filtro...</span>
        </div>
        <div className="badges-lists-filter-buttons">
          {filterButtons.map((filter) => (
            <button
              key={filter.id}
              className={`badge-filter-btn ${
                selectedFilters.includes(filter.id) ? 'active' : ''
              } ${selectedFilters.includes('all') && filter.id !== 'all' ? 'disabled' : ''}`}
              onClick={() => handleFilterClick(filter.id)}
              disabled={selectedFilters.includes('all') && filter.id !== 'all'}
            >
              <span className="filter-icon-emoji">{filter.icon}</span>
              <span className="filter-label">{filter.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ConsultorBadgesListsView
