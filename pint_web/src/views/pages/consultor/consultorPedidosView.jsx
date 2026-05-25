import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HiOutlineMagnifyingGlass,
  HiOutlinePlus,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineArrowUturnLeft,
} from 'react-icons/hi2'
import outsystems1 from '../../../assets/images/badges/outsystems_1.png'
import tm1 from '../../../assets/images/badges/tm_1.png'
import devops2 from '../../../assets/images/badges/devops_2.png'
import './ConsultorPedidosView.css'

import { getPedidos } from '../../../controllers/pedidosController'
import { getBadgesRecomendados } from '../../../controllers/badgesController'

// ─── helpers ────────────────────────────────────────────────────────────────

function slugify(value) {
  return value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ─── normalização dos dados da API ──────────────────────────────────────────

// Mapeamento de estado_atual → chave interna
// 1 = submetido (aguarda TM)
// 2 = aprovado TM (aguarda SL)
// 3 = devolvido TM
// 4 = aprovado SL (aceite)
// 5 = rejeitado
// 6 = devolvido SL

const ESTADO_STATUS_MAP = {
  1: 'analysis',
  2: 'analysis',
  3: 'returned',
  4: 'accepted',
  5: 'rejected',
  6: 'returned',
}

const ESTADO_PROGRESS_MAP = {
  1: 25,
  2: 50,
  3: 25,
  4: 100,
  5: 100,
  6: 50,
}

function deriveEvaluators(estado) {
  if (estado === 1) return ['TM']
  if (estado === 2) return ['TM', 'SL']
  if (estado === 3) return ['TM']
  if (estado === 4 || estado === 5 || estado === 6) return ['TM', 'SL']
  return []
}

function resolveImage(raw) {
  if (!raw) return null
  if (raw.startsWith('data:')) return raw
  if (raw.startsWith('http')) return raw
  if (/\.(png|jpe?g|gif|webp)$/i.test(raw)) return raw
  return `data:image/png;base64,${raw}`
}

function normalizePedido(raw) {
  const estado = raw.estado_atual ?? 1
  const badge = raw.Badge ?? {}

  return {
    id: raw.id_pedido_badge,
    badgeId: raw.id_badge,
    name: badge.nome_badge ?? raw.nome_badge ?? '—',
    image: badge.imagem_badge ?? raw.imagem_badge ?? null,
    evaluators: deriveEvaluators(estado),
    status: ESTADO_STATUS_MAP[estado] ?? 'analysis',
    progress: ESTADO_PROGRESS_MAP[estado] ?? 0,
  }
}

const STATUS_MAP = {
  // português → chave interna
  'em analise': 'analysis',
  'badge aceite': 'accepted',
  'badge recusado': 'rejected',
  'devolvido': 'returned',
}

function normalizeStatus(raw = '') {
  const known = ['analysis', 'accepted', 'rejected', 'returned']
  if (known.includes(raw)) return raw
  return STATUS_MAP[raw.toLowerCase()] ?? 'analysis'
}

function normalizeBadgeSugestao(raw) {
  return {
    id: raw.id_badge ?? raw.id,
    name: raw.nome_badge ?? raw.nome ?? raw.name ?? '—',
    area: raw.Area?.nome_area ?? raw.area?.nome ?? raw.area ?? '—',
    image: resolveImage(raw.imagem_badge ?? raw.imagem ?? raw.image ?? null),
    isRecomendado: raw._recomendado ?? false,
  }
}

// ─── fallback de imagem local (enquanto o back não servir imagens) ───────────

const BADGE_IMAGE_BY_NAME = {
  'Citizen Developer': outsystems1,
  'Team Lider Beginner': tm1,
  'DevOps Intermediate': devops2,
}

// ─── ícone svg ───────────────────────────────────────────────────────────────

function IconPedidos({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path d="M5.25 1.5C5.05109 1.5 4.86032 1.57902 4.71967 1.71967C4.57902 1.86032 4.5 2.05109 4.5 2.25V21.75C4.5 21.9489 4.57902 22.1397 4.71967 22.2803C4.86032 22.421 5.05109 22.5 5.25 22.5H9.75V21H6V3H18V10.5H19.5V2.25C19.5 2.05109 19.421 1.86032 19.2803 1.71967C19.1397 1.57902 18.9489 1.5 18.75 1.5H5.25Z" fill="currentColor" />
      <path opacity="0.4" d="M7.5 7.5H16.5V6H7.5V7.5ZM7.5 10.5H13.5V9H7.5V10.5Z" fill="currentColor" />
      <path opacity="0.4" fillRule="evenodd" clipRule="evenodd" d="M15.75 12C14.3576 12 13.0223 12.5531 12.0377 13.5377C11.0531 14.5223 10.5 15.8576 10.5 17.25C10.5 18.6424 11.0531 19.9777 12.0377 20.9623C13.0223 21.9469 14.3576 22.5 15.75 22.5C17.1424 22.5 18.4777 21.9469 19.4623 20.9623C20.4469 19.9777 21 18.6424 21 17.25C21 15.8576 20.4469 14.5223 19.4623 13.5377C18.4777 12.5531 17.1424 12 15.75 12ZM15 14.25V17.25C14.9998 17.3486 15.0191 17.4462 15.0567 17.5373C15.0942 17.6284 15.1494 17.7112 15.219 17.781L17.469 20.031L18.531 18.969L16.5 16.9395V14.25H15Z" fill="currentColor" />
    </svg>
  )
}

// ─── config de estado / avaliador ────────────────────────────────────────────

const STATUS_CONFIG = {
  analysis: { label: 'Em Análise', Icon: HiOutlineClock, cls: 'is-analysis' },
  accepted: { label: 'Badge Aceite', Icon: HiOutlineCheckCircle, cls: 'is-accepted' },
  rejected: { label: 'Badge Recusado', Icon: HiOutlineXCircle, cls: 'is-rejected' },
  returned: { label: 'Devolvido', Icon: HiOutlineArrowUturnLeft, cls: 'is-returned' },
}

const EVALUATOR_CONFIG = {
  TM: { label: 'Talent Manager', cls: 'is-tm' },
  SL: { label: 'Service Line Lider', cls: 'is-sl' },
}

// ─── sub-componentes ─────────────────────────────────────────────────────────

function BadgeThumbnail({ badge }) {
  const image =
    resolveImage(badge.image) ||
    BADGE_IMAGE_BY_NAME[badge.name] ||
    outsystems1

  return (
    <img
      src={image}
      alt={badge.name}
      className="consultor-pedidos-badge-thumb"
    />
  )
}

function HistoryRow({ row, onClick }) {
  const status = STATUS_CONFIG[row.status] ?? STATUS_CONFIG.analysis
  const StatusIcon = status.Icon

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() }
  }

  return (
    <tr
      className="consultor-pedidos-row is-clickable"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalhes do badge ${row.name}`}
    >
      <td>
        <div className="consultor-pedidos-badge-cell">
          <BadgeThumbnail badge={row} />
          <span className="consultor-pedidos-badge-name">{row.name}</span>
        </div>
      </td>

      <td>
        <div className="consultor-pedidos-evaluators">
          {row.evaluators.map((code, i) => {
            const cfg = EVALUATOR_CONFIG[code] ?? { label: code, cls: '' }
            return (
              <span key={i} className={`consultor-pedidos-evaluator-tag ${cfg.cls}`} title={cfg.label}>
                {code}
              </span>
            )
          })}
        </div>
      </td>

      <td>
        <div className="consultor-pedidos-status">
          <div className="consultor-pedidos-status-row">
            <span>{status.label}</span>
            <StatusIcon className={`consultor-pedidos-status-icon ${status.cls}`} aria-hidden="true" />
          </div>
          <div
            className="consultor-pedidos-progress"
            role="progressbar"
            aria-valuenow={row.progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={`consultor-pedidos-progress-bar ${status.cls}`}
              style={{ width: `${row.progress}%` }}
            />
          </div>
        </div>
      </td>
    </tr>
  )
}

function CandidateRow({ badge, onApply }) {
  return (
    <div className="consultor-pedidos-suggestion">
      <BadgeThumbnail badge={badge} />
      <div className="consultor-pedidos-suggestion-copy">
        <h4>
          {badge.name}
          {badge.isRecomendado && (
            <span className="consultor-pedidos-recomendado-tag">Recomendado</span>
          )}
        </h4>
        <p>{badge.area}</p>
      </div>
      <button
        type="button"
        className="consultor-pedidos-apply-btn"
        aria-label={`Ver badge ${badge.name}`}
        onClick={() => onApply(badge)}
      >
        <HiOutlinePlus className="consultor-pedidos-apply-btn-icon" aria-hidden="true" />
      </button>
    </div>
  )
}


// ─── view principal ───────────────────────────────────────────────────────────

function ConsultorPedidosView() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [historyRows, setHistoryRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sugestoes, setSugestoes] = useState([])
  const [loadingSug, setLoadingSug] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function fetchPedidos() {
      try {
        setLoading(true); setError(null)
        const data = await getPedidos()
        if (!cancelled) {
          const rows = Array.isArray(data) ? data : (data.pedidos ?? data.data ?? [])
          const badgeGroups = {}
          rows.forEach((row) => {
            const key = String(row.id_badge ?? row.Badge?.id_badge ?? 'unknown')
            if (!badgeGroups[key]) badgeGroups[key] = []
            badgeGroups[key].push(row)
          })
          const agrupados = Object.values(badgeGroups)
            .filter((g) => g.length > 0)
            .map((g) => {
              const sorted = [...g].sort((a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0))
              return normalizePedido(sorted[0])
            })
          setHistoryRows(agrupados)
        }
      } catch {
        if (!cancelled) setError('Não foi possível carregar os pedidos. Tenta novamente.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchPedidos()
    return () => { cancelled = true }
  }, [])

  // ── novo: fetch badges recomendados ──
  useEffect(() => {
    let cancelled = false
    async function fetchRecomendados() {
      try {
        setLoadingSug(true)
        const data = await getBadgesRecomendados()
        if (!cancelled) {
          const recomendados = (data.recomendados ?? []).map((b) =>
            normalizeBadgeSugestao({ ...b, _recomendado: true })
          )
          const restantes = (data.restantes ?? []).map((b) =>
            normalizeBadgeSugestao(b)
          )
          setSugestoes([...recomendados, ...restantes])
        }
      } catch {
        if (!cancelled) setSugestoes([])
      } finally {
        if (!cancelled) setLoadingSug(false)
      }
    }
    fetchRecomendados()
    return () => { cancelled = true }
  }, [])


  const filteredCandidates = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    const filtered = term
      ? sugestoes.filter((b) => `${b.name} ${b.area}`.toLowerCase().includes(term))
      : sugestoes
    return filtered.slice(0, 3)
  }, [searchTerm, sugestoes])

  function goToBadge(id, name) {
    navigate(`/consultor/badge/${id}`)
  }

  function goToOutrasAreas() {
    navigate('/consultor/badges/outras-areas')
  }

  // ── render do corpo da tabela ──
  function renderTableBody() {
    if (loading) {
      return (
        <tr>
          <td colSpan={3} className="consultor-pedidos-feedback">
            A carregar pedidos…
          </td>
        </tr>
      )
    }
    if (error) {
      return (
        <tr>
          <td colSpan={3} className="consultor-pedidos-feedback is-error">
            {error}
          </td>
        </tr>
      )
    }
    if (historyRows.length === 0) {
      return (
        <tr>
          <td colSpan={3} className="consultor-pedidos-feedback">
            Ainda não tens pedidos submetidos.
          </td>
        </tr>
      )
    }
    return historyRows.map((row) => (
      <HistoryRow key={row.id} row={row} onClick={() => goToBadge(row.badgeId, row.name)} />
    ))
  }

  return (
    <section className="consultor-pedidos-page">
      <header className="consultor-pedidos-hero">
        <div className="consultor-pedidos-hero-copy">
          <h1>Pedidos</h1>
          <p>Aqui podes acompanhar o estado das tuas candidaturas a badges e submeter novos pedidos</p>
        </div>
      </header>

      <article className="consultor-pedidos-card" aria-label="Histórico de Pedidos">
        <header className="consultor-pedidos-card-header">
          <IconPedidos className="consultor-pedidos-card-header-icon" />
          <h2>Histórico de Pedidos</h2>
        </header>

        <table className="consultor-pedidos-table">
          <thead>
            <tr>
              <th className="consultor-pedidos-col-badge" scope="col">BADGE</th>
              <th className="consultor-pedidos-col-evaluators" scope="col">AVALIADORES</th>
              <th className="consultor-pedidos-col-status" scope="col">ESTADO</th>
            </tr>
          </thead>
          <tbody>{renderTableBody()}</tbody>
        </table>
      </article>

      <article className="consultor-pedidos-card" aria-label="Candidatar a um Badge">
        <header className="consultor-pedidos-card-header">
          <h2>Candidatar a um Badge</h2>
        </header>

        <label className="consultor-pedidos-search">
          <HiOutlineMagnifyingGlass className="consultor-pedidos-search-icon" aria-hidden="true" />
          <input
            type="text"
            placeholder="Pesquisar por nome do badge..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Pesquisar badges"
          />
        </label>

        <div className="consultor-pedidos-suggestions">
          {loadingSug ? (
            <div className="consultor-pedidos-feedback">A carregar badges…</div>
          ) : filteredCandidates.length > 0 ? (
            filteredCandidates.map((badge) => (
              <CandidateRow
                key={badge.id}
                badge={badge}
                onApply={(b) => goToBadge(b.id, b.name)}
              />
            ))
          ) : (
            <div className="consultor-pedidos-empty">Nenhum badge encontrado.</div>
          )}
        </div>

        <div className="consultor-pedidos-card-footer">
          <button type="button" className="consultor-pedidos-more-btn" onClick={goToOutrasAreas}>
            Ver Mais Badges
          </button>
        </div>
      </article>
    </section>
  )
}

export default ConsultorPedidosView