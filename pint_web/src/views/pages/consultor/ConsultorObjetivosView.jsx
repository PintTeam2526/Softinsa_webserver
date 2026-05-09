import { useMemo, useState } from 'react'
import {
  HiOutlineFlag,
  HiOutlineMagnifyingGlass,
  HiOutlinePlus,
  HiOutlineCalendarDays,
  HiOutlineCheck,
  HiOutlineExclamationTriangle,
} from 'react-icons/hi2'
import './ConsultorObjetivosView.css'
import avtar1 from '../../../assets/images/avatars/avtar_1.png'
import avtar2 from '../../../assets/images/avatars/avtar_2.png'
import avtar3 from '../../../assets/images/avatars/avtar_3.png'
import avtar4 from '../../../assets/images/avatars/avtar_4.png'

const STATUS_CONFIG = {
  progress: { label: 'Em Andamento', Icon: HiOutlineCalendarDays,        cls: 'is-progress' },
  done:     { label: 'Concluído',    Icon: HiOutlineCheck,               cls: 'is-done'     },
  expired:  { label: 'Expirado',     Icon: HiOutlineExclamationTriangle, cls: 'is-expired'  },
}

const objetivosData = [
  { id: 1, description: 'Completar Badge: Citizen Developer',   thumb: avtar1, status: 'progress', date: '5/10/2026' },
  { id: 2, description: 'Completar Badge: Team Lider Beginner', thumb: avtar2, status: 'progress', date: '6/10/2026' },
  { id: 3, description: 'Completar Badge: Citizen Developer',   thumb: avtar3, status: 'done',     date: '5/1/2026'  },
  { id: 4, description: 'Completar Badge: DevOps Intermediate', thumb: avtar4, status: 'expired',  date: '6/1/2026'  },
]

const candidateBadges = [
  { id: 1, name: 'Citizen Developer',    area: 'LowCode (Outsystems)', thumb: avtar1 },
  { id: 2, name: 'Team Lider Beginner',  area: 'Talent Management',    thumb: avtar2 },
  { id: 3, name: 'DevOps Intermediate',  area: 'DevOps',               thumb: avtar3 },
]

function formatDateForInput(date) {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function ObjetivoRow({ row }) {
  const status = STATUS_CONFIG[row.status]
  const StatusIcon = status.Icon

  return (
    <tr>
      <td>
        <div className="consultor-objetivos-description-cell">
          <img src={row.thumb} alt="" className="consultor-objetivos-thumb" />
          <span className="consultor-objetivos-description-text">{row.description}</span>
        </div>
      </td>
      <td>
        <span className={`consultor-objetivos-status-cell ${status.cls}`}>
          <span>{status.label}</span>
          <StatusIcon className="consultor-objetivos-status-icon" aria-hidden="true" />
        </span>
      </td>
      <td>
        <span className="consultor-objetivos-date-cell">{row.date}</span>
      </td>
    </tr>
  )
}

function CandidateRow({ badge, isSelected, onToggle }) {
  return (
    <label className="consultor-objetivos-suggestion">
      <img src={badge.thumb} alt="" className="consultor-objetivos-suggestion-thumb" />

      <div className="consultor-objetivos-suggestion-copy">
        <h4>{badge.name}</h4>
        <p>{badge.area}</p>
      </div>

      <input
        type="checkbox"
        className="consultor-objetivos-checkbox"
        checked={isSelected}
        onChange={() => onToggle(badge.id)}
        aria-label={`Selecionar ${badge.name}`}
      />
    </label>
  )
}

function ConsultorObjetivosView() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIds, setSelectedIds] = useState(() => new Set())
  const [targetDate, setTargetDate] = useState(() => formatDateForInput(new Date()))

  const filteredCandidates = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return candidateBadges
    return candidateBadges.filter((b) => `${b.name} ${b.area}`.toLowerCase().includes(term))
  }, [searchTerm])

  function toggleSelection(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleAddObjetivo() {
    // TODO: ligar à API de criação de objetivos
    const selected = candidateBadges.filter((b) => selectedIds.has(b.id))
    console.info('Adicionar objetivos:', selected, 'data:', targetDate)
    setSelectedIds(new Set())
  }

  const canSubmit = selectedIds.size > 0 && Boolean(targetDate)

  return (
    <section className="consultor-objetivos-page">
      <header className="consultor-objetivos-hero">
        <div className="consultor-objetivos-hero-art" aria-hidden="true">
          <div className="consultor-objetivos-hero-circle consultor-objetivos-hero-circle-5" />
          <div className="consultor-objetivos-hero-circle consultor-objetivos-hero-circle-4" />
          <div className="consultor-objetivos-hero-circle consultor-objetivos-hero-circle-3" />
          <div className="consultor-objetivos-hero-circle consultor-objetivos-hero-circle-2" />
          <div className="consultor-objetivos-hero-circle consultor-objetivos-hero-circle-1" />
        </div>

        <div className="consultor-objetivos-hero-copy">
          <h1>Objetivos</h1>
          <p>Define objetivos para melhorar a tua organização</p>
        </div>
      </header>

      <article className="consultor-objetivos-card" aria-label="Objetivos">
        <header className="consultor-objetivos-card-header">
          <HiOutlineFlag className="consultor-objetivos-card-header-icon" aria-hidden="true" />
          <h2>Objetivos</h2>
        </header>

        <table className="consultor-objetivos-table">
          <thead>
            <tr>
              <th className="consultor-objetivos-col-description" scope="col">DESCRIÇÃO</th>
              <th className="consultor-objetivos-col-status" scope="col">ESTADO</th>
              <th className="consultor-objetivos-col-date" scope="col">DATA OBJETIVO</th>
            </tr>
          </thead>
          <tbody>
            {objetivosData.map((row) => (
              <ObjetivoRow key={row.id} row={row} />
            ))}
          </tbody>
        </table>
      </article>

      <article className="consultor-objetivos-card" aria-label="Adicionar Objetivo">
        <header className="consultor-objetivos-card-header">
          <h2>Adicionar Objetivo</h2>
        </header>

        <label className="consultor-objetivos-search">
          <HiOutlineMagnifyingGlass className="consultor-objetivos-search-icon" aria-hidden="true" />
          <input
            type="text"
            placeholder="Pesquisar por nome do badge..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            aria-label="Pesquisar badges"
          />
        </label>

        <div className="consultor-objetivos-suggestions">
          {filteredCandidates.length > 0 ? (
            filteredCandidates.map((badge) => (
              <CandidateRow
                key={badge.id}
                badge={badge}
                isSelected={selectedIds.has(badge.id)}
                onToggle={toggleSelection}
              />
            ))
          ) : (
            <div className="consultor-objetivos-empty">Nenhum badge encontrado.</div>
          )}
        </div>

        <div className="consultor-objetivos-card-footer">
          <div className="consultor-objetivos-date-field">
            <label htmlFor="consultor-objetivos-date">Data Objetivo:</label>
            <input
              id="consultor-objetivos-date"
              type="date"
              value={targetDate}
              onChange={(event) => setTargetDate(event.target.value)}
            />
          </div>

          <button
            type="button"
            className="consultor-objetivos-add-btn"
            onClick={handleAddObjetivo}
            disabled={!canSubmit}
          >
            <HiOutlinePlus className="consultor-objetivos-add-btn-icon" aria-hidden="true" />
            <span>Adicionar Objetivo</span>
          </button>
        </div>
      </article>
    </section>
  )
}

export default ConsultorObjetivosView
