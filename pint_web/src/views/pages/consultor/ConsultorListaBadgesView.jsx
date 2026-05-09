import { useMemo, useState } from 'react'
import {
  HiOutlineMagnifyingGlass,
  HiOutlineStar,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineQuestionMarkCircle,
  HiOutlineCalendarDays,
  HiOutlineDocumentText,
  HiOutlineGlobeAlt,
  HiOutlineXMark,
  HiOutlineArrowTopRightOnSquare,
} from 'react-icons/hi2'
import './ConsultorListaBadgesView.css'
import avtar1 from '../../../assets/images/avatars/avtar_1.png'
import avtar2 from '../../../assets/images/avatars/avtar_2.png'
import avtar3 from '../../../assets/images/avatars/avtar_3.png'
import avtar4 from '../../../assets/images/avatars/avtar_4.png'
import avtar5 from '../../../assets/images/avatars/avtar_5.png'

const FILTERS = [
  { id: 'favoritos',  label: 'Favoritos',           Icon: HiOutlineStar,                  HeaderIcon: HiOutlineStar          },
  { id: 'analise',    label: 'Em análise',          Icon: HiOutlineClock,                 HeaderIcon: HiOutlineClock         },
  { id: 'obtidos',    label: 'Obtidos',             Icon: HiOutlineCheckCircle,           HeaderIcon: HiOutlineCheckCircle   },
  { id: 'porObter',   label: 'Por Obter',           Icon: HiOutlineQuestionMarkCircle,    HeaderIcon: HiOutlineQuestionMarkCircle },
  { id: 'expirados',  label: 'Expirados',           Icon: HiOutlineCalendarDays,          HeaderIcon: HiOutlineCalendarDays  },
  { id: 'devolvidos', label: 'Devolvidos',          Icon: HiOutlineDocumentText,          HeaderIcon: HiOutlineDocumentText  },
  { id: 'todos',      label: 'Todos',               Icon: HiOutlineGlobeAlt,              HeaderIcon: HiOutlineGlobeAlt      },
]

const FILTER_LABELS = Object.fromEntries(FILTERS.map((f) => [f.id, f.label]))
const FILTER_ICONS  = Object.fromEntries(FILTERS.map((f) => [f.id, f.HeaderIcon]))

const allBadges = [
  { id: 1, name: 'Citizen Developer',    thumb: avtar1, level: 'Júnior',       points: 100, status: 'obtidos',    favorite: true  },
  { id: 2, name: 'Team Lider Beginner',  thumb: avtar2, level: 'Júnior',       points: 100, status: 'analise',    favorite: true  },
  { id: 3, name: 'DevOps Intermediate',  thumb: avtar3, level: 'Intermédio',   points: 250, status: 'obtidos',    favorite: false },
  { id: 4, name: 'Application Creator',  thumb: avtar4, level: 'Sénior',       points: 400, status: 'porObter',   favorite: true  },
  { id: 5, name: 'Full-Stack Low-Code',  thumb: avtar5, level: 'Especialista', points: 600, status: 'expirados',  favorite: false },
  { id: 6, name: 'Elite OutSystems',     thumb: avtar1, level: 'Líder',        points: 800, status: 'devolvidos', favorite: false },
  { id: 7, name: 'Citizen Developer',    thumb: avtar2, level: 'Intermédio',   points: 250, status: 'analise',    favorite: true  },
  { id: 8, name: 'Team Lider Pro',       thumb: avtar3, level: 'Sénior',       points: 400, status: 'obtidos',    favorite: false },
  { id: 9, name: 'Cloud Architect',      thumb: avtar4, level: 'Especialista', points: 600, status: 'porObter',   favorite: true  },
]

function filterBadges(badges, filterId) {
  if (!filterId) return []
  if (filterId === 'todos')     return badges
  if (filterId === 'favoritos') return badges.filter((b) => b.favorite)
  return badges.filter((b) => b.status === filterId)
}

function FilterChip({ filter, isActive, onClick }) {
  const Icon = filter.Icon

  return (
    <button
      type="button"
      className={`consultor-lista-chip${isActive ? ' is-active' : ''}`}
      onClick={() => onClick(filter.id)}
      aria-pressed={isActive}
    >
      <Icon className="consultor-lista-chip-icon" aria-hidden="true" />
      <span>{filter.label}</span>
    </button>
  )
}

function BadgeRow({ badge }) {
  return (
    <tr>
      <td>
        <div className="consultor-lista-name-cell">
          <img src={badge.thumb} alt="" className="consultor-lista-thumb" />
          <span className="consultor-lista-name-text">{badge.name}</span>
        </div>
      </td>
      <td>
        <span className="consultor-lista-level-cell">
          <span>{badge.level}</span>
          <HiOutlineStar className="consultor-lista-level-icon" aria-hidden="true" />
        </span>
      </td>
      <td>
        <span className="consultor-lista-points-cell">
          <HiOutlineStar className="consultor-lista-points-icon" aria-hidden="true" />
          <span>{badge.points} Pontos</span>
        </span>
      </td>
      <td>
        <div className="consultor-lista-action-cell">
          <button
            type="button"
            className="consultor-lista-action-btn"
            aria-label={`Ver detalhes do badge ${badge.name}`}
          >
            <HiOutlineArrowTopRightOnSquare className="consultor-lista-action-btn-icon" aria-hidden="true" />
          </button>
        </div>
      </td>
    </tr>
  )
}

function ConsultorListaBadgesView() {
  const [activeFilter, setActiveFilter] = useState('')

  const filtered = useMemo(() => filterBadges(allBadges, activeFilter), [activeFilter])

  function handleFilterClick(id) {
    setActiveFilter((prev) => (prev === id ? '' : id))
  }

  function handleClose() {
    setActiveFilter('')
  }

  const HeaderIcon = activeFilter ? FILTER_ICONS[activeFilter] : null
  const headerLabel = activeFilter ? FILTER_LABELS[activeFilter] : ''

  return (
    <section className="consultor-lista-page">
      <header className="consultor-lista-hero">
        <div className="consultor-lista-hero-art" aria-hidden="true">
          <div className="consultor-lista-hero-circle consultor-lista-hero-circle-5" />
          <div className="consultor-lista-hero-circle consultor-lista-hero-circle-4" />
          <div className="consultor-lista-hero-circle consultor-lista-hero-circle-3" />
          <div className="consultor-lista-hero-circle consultor-lista-hero-circle-2" />
          <div className="consultor-lista-hero-circle consultor-lista-hero-circle-1" />
        </div>

        <div className="consultor-lista-hero-copy">
          <h1>Listas de Badges</h1>
          <p>Encontra os teus badges de forma mais eficiente</p>
        </div>
      </header>

      <article className="consultor-lista-filter" aria-label="Filtros">
        <div className="consultor-lista-filter-search">
          <HiOutlineMagnifyingGlass className="consultor-lista-filter-search-icon" aria-hidden="true" />
          <span className="consultor-lista-filter-search-text">Selecione um Filtro...</span>
        </div>

        <div className="consultor-lista-chips" role="group" aria-label="Categorias">
          {FILTERS.map((filter) => (
            <FilterChip
              key={filter.id}
              filter={filter}
              isActive={activeFilter === filter.id}
              onClick={handleFilterClick}
            />
          ))}
        </div>
      </article>

      {activeFilter ? (
        <article className="consultor-lista-card" aria-label={`Badges ${headerLabel}`}>
          <header className="consultor-lista-card-header">
            {HeaderIcon ? <HeaderIcon className="consultor-lista-card-header-icon" aria-hidden="true" /> : null}
            <h2>Badges {headerLabel} - {filtered.length}</h2>
            <button
              type="button"
              className="consultor-lista-card-close"
              onClick={handleClose}
              aria-label="Fechar lista"
            >
              <HiOutlineXMark className="consultor-lista-card-close-icon" aria-hidden="true" />
            </button>
          </header>

          {filtered.length > 0 ? (
            <table className="consultor-lista-table">
              <thead>
                <tr>
                  <th className="consultor-lista-col-name" scope="col">NOME DO BADGE</th>
                  <th className="consultor-lista-col-level" scope="col">NÍVEL</th>
                  <th className="consultor-lista-col-points" scope="col">PONTOS</th>
                  <th className="consultor-lista-col-action" scope="col" aria-label="Ações"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((badge) => (
                  <BadgeRow key={badge.id} badge={badge} />
                ))}
              </tbody>
            </table>
          ) : (
            <div className="consultor-lista-empty">Sem badges nesta categoria.</div>
          )}
        </article>
      ) : (
        <div className="consultor-lista-placeholder">
          Seleciona um filtro acima para ver a lista de badges.
        </div>
      )}
    </section>
  )
}

export default ConsultorListaBadgesView
