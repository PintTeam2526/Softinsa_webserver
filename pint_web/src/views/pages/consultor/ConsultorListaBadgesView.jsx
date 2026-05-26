import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HiOutlineMagnifyingGlass,
  HiOutlineStar,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineQuestionMarkCircle,
  HiOutlineCalendarDays,
  HiOutlineArrowUturnLeft,
  HiOutlineXMark,
  HiOutlineArrowTopRightOnSquare,
} from 'react-icons/hi2'
import './ConsultorListaBadgesView.css'

import { getFavoritos, getBadgesEmAnalise, getBadgesObtidos, getBadgesPorObter, getBadgesExpirados, getBadgesDevolvidos } from '../../../controllers/badgesController'


function resolveImage(raw) {
  if (!raw) return null
  if (raw.startsWith('data:') || raw.startsWith('http')) return raw
  return `data:image/png;base64,${raw}`
}

// ── Normalise each filter's response to a common shape ───────────────────────

function normaliseBadge(raw) {
  const b = raw.Badge ?? raw

  const imageRaw = b.imagem_badge ?? b.IMAGEM_BADGE ?? null

  return {
    id: b.id_badge ?? b.ID_BADGE ?? raw.id_badge ?? raw.id,
    name: b.nome_badge ?? b.NOME_BADGE ?? '—',
    level: b.nivel_badge ?? b.NIVEL_BADGE ?? '—',
    points: b.pontos_badge ?? b.PONTOS_BADGE ?? 0,
    image: resolveImage(imageRaw),
  }
}


// ── Filter definitions ────────────────────────────────────────────────────────

const FILTERS = [
  { id: 'favoritos', label: 'Favoritos', Icon: HiOutlineStar, fetchFn: getFavoritos },
  { id: 'analise', label: 'Em análise', Icon: HiOutlineClock, fetchFn: getBadgesEmAnalise },
  { id: 'obtidos', label: 'Obtidos', Icon: HiOutlineCheckCircle, fetchFn: getBadgesObtidos },
  { id: 'porObter', label: 'Por Obter', Icon: HiOutlineQuestionMarkCircle, fetchFn: getBadgesPorObter },
  { id: 'expirados', label: 'Expirados', Icon: HiOutlineCalendarDays, fetchFn: getBadgesExpirados },
  { id: 'devolvidos', label: 'Devolvidos', Icon: HiOutlineArrowUturnLeft, fetchFn: getBadgesDevolvidos },
]

const FILTER_MAP = Object.fromEntries(FILTERS.map((f) => [f.id, f]))

// ── Sub-components ────────────────────────────────────────────────────────────

function FilterChip({ filter, isActive, onClick }) {
  const { Icon, label, id } = filter
  return (
    <button
      type="button"
      className={`consultor-lista-chip${isActive ? ' is-active' : ''}`}
      onClick={() => onClick(id)}
      aria-pressed={isActive}
    >
      <Icon className="consultor-lista-chip-icon" aria-hidden="true" />
      <span>{label}</span>
    </button>
  )
}

function BadgeRow({ badge, onOpen }) {
  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen() }
  }

  return (
    <tr
      className="consultor-lista-row is-clickable"
      onClick={onOpen}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalhes do badge ${badge.name}`}
    >
      <td>
        <div className="consultor-lista-name-cell">
          {badge.image ? (
            <img src={badge.image} alt="" className="consultor-lista-thumb" />
          ) : (
            <div className="consultor-lista-thumb consultor-lista-thumb--placeholder" aria-hidden="true" />
          )}
          <span className="consultor-lista-name-text">{badge.name}</span>
        </div>
      </td>
      <td>
        <span className="consultor-lista-level-cell">{badge.level}</span>
      </td>
      <td>
        <span className="consultor-lista-points-cell">
          <HiOutlineStar className="consultor-lista-points-icon" aria-hidden="true" />
          <span>{badge.points}</span>
        </span>
      </td>
      <td>
        <div className="consultor-lista-action-cell">
          <button
            type="button"
            className="consultor-lista-action-btn"
            aria-label={`Ver detalhes do badge ${badge.name}`}
            onClick={(e) => { e.stopPropagation(); onOpen() }}
          >
            <HiOutlineArrowTopRightOnSquare className="consultor-lista-action-btn-icon" aria-hidden="true" />
          </button>
        </div>
      </td>
    </tr>
  )
}

// ── Main view ────────────────────────────────────────────────────────────────

function ConsultorListaBadgesView() {
  const navigate = useNavigate()

  const [activeFilter, setActiveFilter] = useState('')
  const [badges, setBadges] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  // Fetch whenever the active filter changes
  const fetchBadges = useCallback(async (filterId) => {
    if (!filterId) return

    const filter = FILTER_MAP[filterId]
    if (!filter) return

    setLoading(true)
    setError(null)
    setBadges([])
    setSearch('')

    try {
      const data = await filter.fetchFn()
      setBadges(Array.isArray(data) ? data.map(normaliseBadge) : [])
    } catch {
      setError('Erro ao carregar os badges. Tenta novamente.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBadges(activeFilter)
  }, [activeFilter, fetchBadges])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return badges
    return badges.filter((b) => b.name.toLowerCase().includes(q))
  }, [badges, search])

  function handleFilterClick(id) {
    setActiveFilter((prev) => (prev === id ? '' : id))
  }

  function handleClose() {
    setActiveFilter('')
    setBadges([])
    setSearch('')
    setError(null)
  }

  function openBadge(badge) {
    navigate(`/consultor/badge/${badge.id}`)
  }

  const activeFilterDef = activeFilter ? FILTER_MAP[activeFilter] : null
  const HeaderIcon = activeFilterDef?.Icon ?? null
  const headerLabel = activeFilterDef?.label ?? ''

  return (
    <section className="consultor-lista-page">
      <header className="consultor-lista-hero">
        <div className="consultor-lista-hero-copy">
          <h1>Listas de Badges</h1>
          <p>Encontra os teus badges de forma mais eficiente</p>
        </div>
      </header>

      {/* ── Filter panel: chips (centred) → search bar ── */}
      <article className="consultor-lista-filter" aria-label="Filtros">
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

        <div className="consultor-lista-filter-search">
          <HiOutlineMagnifyingGlass className="consultor-lista-filter-search-icon" aria-hidden="true" />
          <input
            className="consultor-lista-filter-search-input"
            type="search"
            placeholder="Pesquisar badge pelo nome…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Pesquisar badge pelo nome"
            disabled={!activeFilter}
          />
        </div>
      </article>

      {/* ── Results ── */}
      {activeFilter ? (
        <article className="consultor-lista-card" aria-label={`Badges ${headerLabel}`}>
          <header className="consultor-lista-card-header">
            {HeaderIcon && <HeaderIcon className="consultor-lista-card-header-icon" aria-hidden="true" />}
            <h2>
              Badges {headerLabel}
              {!loading && <span> — {filtered.length}</span>}
            </h2>
            <button
              type="button"
              className="consultor-lista-card-close"
              onClick={handleClose}
              aria-label="Fechar lista"
            >
              <HiOutlineXMark className="consultor-lista-card-close-icon" aria-hidden="true" />
            </button>
          </header>

          {loading && (
            <div className="consultor-lista-empty">A carregar…</div>
          )}

          {!loading && error && (
            <div className="consultor-lista-empty consultor-lista-empty--error">{error}</div>
          )}

          {!loading && !error && filtered.length > 0 && (
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
                  <BadgeRow key={badge.id} badge={badge} onOpen={() => openBadge(badge)} />
                ))}
              </tbody>
            </table>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="consultor-lista-empty">
              {search ? 'Nenhum badge encontrado para essa pesquisa.' : 'Sem badges nesta categoria.'}
            </div>
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