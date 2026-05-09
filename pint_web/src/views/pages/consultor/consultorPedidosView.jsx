import { useMemo, useState } from 'react'
import {
  HiOutlineClipboardDocumentList,
  HiOutlineMagnifyingGlass,
  HiOutlinePlus,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineArrowUturnLeft,
} from 'react-icons/hi2'
import './ConsultorPedidosView.css'
import avtar1 from '../../../assets/images/avatars/avtar_1.png'
import avtar2 from '../../../assets/images/avatars/avtar_2.png'
import avtar3 from '../../../assets/images/avatars/avtar_3.png'
import avtar4 from '../../../assets/images/avatars/avtar_4.png'
import avtar5 from '../../../assets/images/avatars/avtar_5.png'

const STATUS_CONFIG = {
  analysis: { label: 'Em Análise',      Icon: HiOutlineClock,           cls: 'is-analysis' },
  accepted: { label: 'Badge Aceite',    Icon: HiOutlineCheckCircle,     cls: 'is-accepted' },
  rejected: { label: 'Badge Recusado',  Icon: HiOutlineXCircle,         cls: 'is-rejected' },
  returned: { label: 'Devolvido',       Icon: HiOutlineArrowUturnLeft,  cls: 'is-returned' },
}

const historyRows = [
  { id: 1, name: 'Citizen Developer',    thumb: avtar1, evaluators: [avtar1],         status: 'analysis', progress: 25  },
  { id: 2, name: 'Team Lider Beginner',  thumb: avtar2, evaluators: [avtar2, avtar3], status: 'analysis', progress: 64  },
  { id: 3, name: 'DevOps Intermediate',  thumb: avtar3, evaluators: [avtar3, avtar4], status: 'accepted', progress: 100 },
  { id: 4, name: 'Citizen Developer',    thumb: avtar4, evaluators: [avtar4, avtar2], status: 'rejected', progress: 100 },
  { id: 5, name: 'Team Lider Beginner',  thumb: avtar5, evaluators: [avtar5],         status: 'returned', progress: 25  },
  { id: 6, name: 'DevOps Intermediate',  thumb: avtar1, evaluators: [avtar1, avtar3], status: 'returned', progress: 76  },
]

const candidateBadges = [
  { id: 1, name: 'Citizen Developer',    area: 'LowCode (Outsystems)', thumb: avtar1 },
  { id: 2, name: 'Team Lider Beginner',  area: 'Talent Management',    thumb: avtar2 },
  { id: 3, name: 'DevOps Intermediate',  area: 'DevOps',               thumb: avtar3 },
]

function HistoryRow({ row }) {
  const status = STATUS_CONFIG[row.status]
  const StatusIcon = status.Icon

  return (
    <tr>
      <td>
        <div className="consultor-pedidos-badge-cell">
          <img src={row.thumb} alt="" className="consultor-pedidos-badge-thumb" />
          <span className="consultor-pedidos-badge-name">{row.name}</span>
        </div>
      </td>

      <td>
        <div className="consultor-pedidos-evaluators">
          {row.evaluators.map((avatar, index) => (
            <img
              key={index}
              src={avatar}
              alt=""
              className="consultor-pedidos-evaluator-avatar"
            />
          ))}
        </div>
      </td>

      <td>
        <div className="consultor-pedidos-status">
          <div className="consultor-pedidos-status-row">
            <span>{status.label}</span>
            <StatusIcon className={`consultor-pedidos-status-icon ${status.cls}`} aria-hidden="true" />
          </div>
          <div className="consultor-pedidos-progress" role="progressbar" aria-valuenow={row.progress} aria-valuemin={0} aria-valuemax={100}>
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
      <img src={badge.thumb} alt="" className="consultor-pedidos-suggestion-thumb" />

      <div className="consultor-pedidos-suggestion-copy">
        <h4>{badge.name}</h4>
        <p>{badge.area}</p>
      </div>

      <button
        type="button"
        className="consultor-pedidos-apply-btn"
        aria-label={`Candidatar ao badge ${badge.name}`}
        onClick={() => onApply(badge)}
      >
        <HiOutlinePlus className="consultor-pedidos-apply-btn-icon" aria-hidden="true" />
      </button>
    </div>
  )
}

function ConsultorPedidosView() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCandidates = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return candidateBadges
    return candidateBadges.filter((b) => `${b.name} ${b.area}`.toLowerCase().includes(term))
  }, [searchTerm])

  function handleApply(badge) {
    // TODO: ligar à API de candidatura a badges
    console.info('Candidatar:', badge.name)
  }

  return (
    <section className="consultor-pedidos-page">
      <header className="consultor-pedidos-hero">
        <div className="consultor-pedidos-hero-art" aria-hidden="true">
          <div className="consultor-pedidos-hero-circle consultor-pedidos-hero-circle-5" />
          <div className="consultor-pedidos-hero-circle consultor-pedidos-hero-circle-4" />
          <div className="consultor-pedidos-hero-circle consultor-pedidos-hero-circle-3" />
          <div className="consultor-pedidos-hero-circle consultor-pedidos-hero-circle-2" />
          <div className="consultor-pedidos-hero-circle consultor-pedidos-hero-circle-1" />
        </div>

        <div className="consultor-pedidos-hero-copy">
          <h1>Pedidos</h1>
          <p>Aqui podes acompanhar o estado das tuas candidaturas a badges e submeter novos pedidos</p>
        </div>
      </header>

      <article className="consultor-pedidos-card" aria-label="Histórico de Pedidos">
        <header className="consultor-pedidos-card-header">
          <HiOutlineClipboardDocumentList className="consultor-pedidos-card-header-icon" aria-hidden="true" />
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
          <tbody>
            {historyRows.map((row) => (
              <HistoryRow key={row.id} row={row} />
            ))}
          </tbody>
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
            onChange={(event) => setSearchTerm(event.target.value)}
            aria-label="Pesquisar badges"
          />
        </label>

        <div className="consultor-pedidos-suggestions">
          {filteredCandidates.length > 0 ? (
            filteredCandidates.map((badge) => (
              <CandidateRow key={badge.id} badge={badge} onApply={handleApply} />
            ))
          ) : (
            <div className="consultor-pedidos-empty">Nenhum badge encontrado.</div>
          )}
        </div>

        <div className="consultor-pedidos-card-footer">
          <button type="button" className="consultor-pedidos-more-btn">
            Ver Mais Badges
          </button>
        </div>
      </article>
    </section>
  )
}

export default ConsultorPedidosView
