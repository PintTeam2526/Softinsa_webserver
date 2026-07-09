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

const FILTERS = [
  { id: 'favoritos', label: 'Favoritos', Icon: HiOutlineStar, fetchFn: getFavoritos },
  { id: 'analise', label: 'Em análise', Icon: HiOutlineClock, fetchFn: getBadgesEmAnalise },
  { id: 'obtidos', label: 'Obtidos', Icon: HiOutlineCheckCircle, fetchFn: getBadgesObtidos },
  { id: 'porObter', label: 'Por Obter', Icon: HiOutlineQuestionMarkCircle, fetchFn: getBadgesPorObter },
  { id: 'expirados', label: 'Expirados', Icon: HiOutlineCalendarDays, fetchFn: getBadgesExpirados },
  { id: 'devolvidos', label: 'Devolvidos', Icon: HiOutlineArrowUturnLeft, fetchFn: getBadgesDevolvidos },
]

const FILTER_MAP = Object.fromEntries(FILTERS.map((f) => [f.id, f]))

function FilterChip({ filter, isActive, onClick }) {
  const { Icon, label, id } = filter
  return (
    <button
      type="button"
      className={`consultor-lista-chip d-inline-flex align-items-center gap-2${isActive ? ' is-active' : ''}`}
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
      className="consultor-lista-row is-clickable align-middle"
      onClick={onOpen}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalhes do badge ${badge.name}`}
    >
      <td>
        <div className="consultor-lista-name-cell d-flex align-items-center gap-2">
          {badge.image ? (
            <img src={badge.image} alt="" className="consultor-lista-thumb rounded-circle flex-shrink-0" />
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
        <span className="consultor-lista-points-cell d-inline-flex align-items-center gap-1">
          <HiOutlineStar className="consultor-lista-points-icon flex-shrink-0" aria-hidden="true" />
          <span>{badge.points} Pontos</span>
        </span>
      </td>
      <td>
        <div className="consultor-lista-action-cell d-flex justify-content-end">
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

function BadgeRowSkeleton() {
  return (
    <tr className="consultor-lista-row">
      <td>
        <div className="consultor-lista-name-cell d-flex align-items-center gap-2">
          <div className="consultor-lista-skeleton consultor-lista-skeleton-thumb" />
          <div className="consultor-lista-skeleton consultor-lista-skeleton-line consultor-lista-skeleton-line-name" />
        </div>
      </td>
      <td>
        <div className="consultor-lista-skeleton consultor-lista-skeleton-pill" />
      </td>
      <td>
        <div className="consultor-lista-skeleton consultor-lista-skeleton-pill consultor-lista-skeleton-pill-wide" />
      </td>
      <td>
        <div className="consultor-lista-action-cell d-flex justify-content-end">
          <div className="consultor-lista-skeleton consultor-lista-skeleton-action-btn" />
        </div>
      </td>
    </tr>
  )
}

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
    <section className="consultor-lista-page d-flex flex-column gap-3">
      <header className="consultor-lista-hero d-flex align-items-center">
        <div className="consultor-lista-hero-copy">
          <h1>Listas de Badges</h1>
          <p>Encontra os teus badges de forma mais eficiente</p>
        </div>
      </header>

      <article className="consultor-lista-filter d-flex flex-column gap-3" aria-label="Filtros">
        <div className="consultor-lista-chips d-flex flex-wrap justify-content-center gap-2" role="group" aria-label="Categorias">
          {FILTERS.map((filter) => (
            <FilterChip
              key={filter.id}
              filter={filter}
              isActive={activeFilter === filter.id}
              onClick={handleFilterClick}
            />
          ))}
        </div>

        <div className="consultor-lista-filter-search d-flex align-items-center w-100">
          <HiOutlineMagnifyingGlass className="consultor-lista-filter-search-icon flex-shrink-0" aria-hidden="true" />
          <input
            className="consultor-lista-filter-search-input w-100"
            type="search"
            placeholder="Pesquisar badge pelo nome…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Pesquisar badge pelo nome"
            disabled={!activeFilter}
          />
        </div>
      </article>

      {activeFilter ? (
        <article className="consultor-lista-card d-flex flex-column gap-3" aria-label={`Badges ${headerLabel}`}>
          <header className="consultor-lista-card-header d-flex align-items-center justify-content-between gap-2 flex-wrap">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              {HeaderIcon && <HeaderIcon className="consultor-lista-card-header-icon flex-shrink-0" aria-hidden="true" />}
              <h2 className="m-0">
                Badges {headerLabel}
                {!loading && <span> — {filtered.length}</span>}
              </h2>
            </div>
            <button
              type="button"
              className="consultor-lista-card-close d-inline-flex align-items-center justify-content-center flex-shrink-0"
              onClick={handleClose}
              aria-label="Fechar lista"
            >
              <HiOutlineXMark className="consultor-lista-card-close-icon" aria-hidden="true" />
            </button>
          </header>

          {loading && (
            <div className="consultor-lista-table-wrap w-100 table-responsive">
              <table className="consultor-lista-table w-100">
                <thead>
                  <tr>
                    <th className="consultor-lista-col-name" scope="col">NOME DO BADGE</th>
                    <th className="consultor-lista-col-level" scope="col">NÍVEL</th>
                    <th className="consultor-lista-col-points" scope="col">PONTOS</th>
                    <th className="consultor-lista-col-action" scope="col" aria-label="Ações"></th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <BadgeRowSkeleton key={i} />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && error && (
            <div className="consultor-lista-empty consultor-lista-empty--error">{error}</div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="consultor-lista-table-wrap w-100 table-responsive">
              <table className="consultor-lista-table w-100">
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
            </div>
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