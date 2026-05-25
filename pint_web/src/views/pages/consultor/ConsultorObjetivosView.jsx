import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HiOutlineMagnifyingGlass,
  HiOutlinePlus,
  HiOutlineCalendarDays,
  HiOutlineCheck,
  HiOutlineExclamationTriangle,
  HiOutlineArrowPath,
} from 'react-icons/hi2'
import { getMeusObjetivos, getBadgesDisponiveisObjetivos, criarObjetivo } from '../../../controllers/objetivosController'
import './ConsultorObjetivosView.css'

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatDateForInput(date) {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function minDate() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return formatDateForInput(d)
}

// estado_objetivo: 'Por Concluir' | 'Concluido'
function deriveStatus(obj) {
  if (obj.estado_objetivo === 'Concluido') return 'done'
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const deadline = new Date(obj.data_limite_conclusao)
  return deadline < today ? 'expired' : 'progress'
}

function formatDate(raw) {
  if (!raw) return '—'
  const d = new Date(raw)
  return isNaN(d) ? raw : d.toLocaleDateString('pt-PT')
}

// ─── constantes de estado ─────────────────────────────────────────────────────

const STATUS_CONFIG = {
  progress: { label: 'Por Concluir', Icon: HiOutlineCalendarDays, cls: 'is-progress' },
  done: { label: 'Concluido', Icon: HiOutlineCheck, cls: 'is-done' },
  expired: { label: 'Expirado', Icon: HiOutlineExclamationTriangle, cls: 'is-expired' },
}

// ─── ícone personalizado ──────────────────────────────────────────────────────

function IconObjetivos({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M19.5554 0.0854812C19.761 0.170636 19.9367 0.314849 20.0603 0.499882C20.184 0.684914 20.2499 0.902452 20.2499 1.12498V3.74998H22.8749C23.0973 3.75018 23.3146 3.81626 23.4994 3.93989C23.6842 4.06352 23.8283 4.23915 23.9133 4.4446C23.9984 4.65004 24.0207 4.87609 23.9773 5.09419C23.934 5.31228 23.827 5.51265 23.6699 5.66998L19.1699 10.17C18.9591 10.381 18.6732 10.4997 18.3749 10.5H17.8094C18.1073 11.6538 18.0548 12.8703 17.6587 13.9942C17.2625 15.1181 16.5407 16.0986 15.5852 16.8107C14.6297 17.5228 13.4837 17.9342 12.2935 17.9925C11.1032 18.0508 9.92258 17.7534 8.90202 17.1381C7.88146 16.5229 7.06723 15.6176 6.56313 14.5378C6.05903 13.458 5.88789 12.2526 6.07153 11.0751C6.25516 9.89767 6.78526 8.80157 7.59425 7.92656C8.40323 7.05155 9.45445 6.43725 10.6139 6.16198C10.9043 6.09296 11.2102 6.14213 11.4644 6.29868C11.7186 6.45522 11.9001 6.70632 11.9692 6.99673C12.0382 7.28714 11.989 7.59308 11.8325 7.84724C11.6759 8.1014 11.4248 8.28296 11.1344 8.35198C10.3848 8.52948 9.70802 8.93353 9.19613 9.50919C8.68423 10.0849 8.36205 10.8042 8.27337 11.5694C8.1847 12.3346 8.33385 13.1086 8.70053 13.7861C9.06721 14.4636 9.63364 15.0117 10.3228 15.3559C11.012 15.7001 11.7904 15.8237 12.5523 15.71C13.3142 15.5962 14.0226 15.2505 14.5811 14.72C15.1396 14.1894 15.5212 13.4998 15.674 12.7447C15.8267 11.9897 15.7433 11.2059 15.4349 10.5H15.0899L12.7949 12.795C12.6919 12.9055 12.5677 12.9942 12.4297 13.0557C12.2917 13.1171 12.1427 13.1502 11.9917 13.1529C11.8406 13.1555 11.6906 13.1277 11.5505 13.0712C11.4104 13.0146 11.2832 12.9304 11.1763 12.8235C11.0695 12.7167 10.9853 12.5895 10.9287 12.4494C10.8721 12.3093 10.8443 12.1593 10.847 12.0082C10.8497 11.8571 10.8827 11.7082 10.9442 11.5702C11.0057 11.4322 11.0944 11.308 11.2049 11.205L13.4999 8.90998V5.62498C13.5002 5.32671 13.6189 5.04076 13.8299 4.82998L18.3299 0.329981C18.4871 0.172644 18.6875 0.0654423 18.9056 0.0219237C19.1237 -0.021595 19.3498 0.000522556 19.5554 0.0854812ZM15.7499 6.09148V8.24998H17.9099L20.1599 5.99998H17.9999V3.83998L15.7499 6.09148ZM7.2299 3.49498C8.9868 2.5095 11.0058 2.09238 13.0094 2.30098C13.1564 2.31625 13.3049 2.30242 13.4465 2.26029C13.5881 2.21816 13.72 2.14855 13.8347 2.05543C13.9494 1.96232 14.0446 1.84753 14.115 1.7176C14.1853 1.58768 14.2294 1.44518 14.2447 1.29823C14.2599 1.15128 14.2461 1.00276 14.204 0.861159C14.1618 0.719554 14.0922 0.587633 13.9991 0.47293C13.906 0.358226 13.7912 0.262986 13.6613 0.192647C13.5314 0.122308 13.3889 0.0782474 13.2419 0.0629812C10.7757 -0.193625 8.29057 0.320017 6.12818 1.53329C3.96579 2.74656 2.23232 4.59988 1.16611 6.83844C0.0999025 9.07701 -0.246695 11.5909 0.173975 14.0344C0.594644 16.478 1.76192 18.7313 3.51532 20.4844C5.26872 22.2376 7.52215 23.4045 9.96577 23.8249C12.4094 24.2452 14.9232 23.8982 17.1616 22.8317C19.4 21.7652 21.2531 20.0315 22.4661 17.8689C23.6791 15.7063 24.1924 13.2211 23.9354 10.755C23.9201 10.608 23.8761 10.4655 23.8057 10.3356C23.7354 10.2057 23.6402 10.0909 23.5255 9.99778C23.4107 9.90466 23.2788 9.83505 23.1372 9.79292C22.9956 9.75079 22.8471 9.73697 22.7002 9.75223C22.5532 9.7675 22.4107 9.81156 22.2808 9.8819C22.1509 9.95224 22.0361 10.0475 21.9429 10.1622C21.8498 10.2769 21.7802 10.4088 21.7381 10.5504C21.696 10.692 21.6821 10.8405 21.6974 10.9875C21.8801 12.7376 21.5858 14.5045 20.8457 16.1009C20.1056 17.6973 18.9472 19.0636 17.4935 20.055C16.0398 21.0464 14.3448 21.6259 12.5884 21.7321C10.832 21.8383 9.07961 21.4672 7.51704 20.6581C5.95447 19.849 4.63998 18.6322 3.71295 17.1366C2.78591 15.641 2.28091 13.9223 2.25147 12.163C2.22203 10.4036 2.66926 8.66908 3.54574 7.1433C4.42222 5.61752 5.69527 4.35737 7.2299 3.49648V3.49498Z" fill="currentColor" />
    </svg>
  )
}

// ─── sub-componentes ──────────────────────────────────────────────────────────

function BadgeThumb({ src, alt }) {
  const [errored, setErrored] = useState(false)
  if (!src || errored) {
    return <span className="consultor-objetivos-thumb consultor-objetivos-thumb--placeholder" aria-hidden="true">🏅</span>
  }
  return <img src={src} alt={alt || ''} className="consultor-objetivos-thumb" onError={() => setErrored(true)} />
}

function ObjetivoRow({ row, onOpen }) {
  const status = STATUS_CONFIG[row.status]
  const StatusIcon = status.Icon

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen() }
  }

  return (
    <tr
      className="consultor-objetivos-row is-clickable"
      onClick={onOpen}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalhes do badge ${row.badgeName}`}
    >
      <td>
        <div className="consultor-objetivos-description-cell">
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
      <div className="consultor-objetivos-suggestion-copy">
        <h4>{badge.nome_badge}</h4>
        <p>{badge.nome_area ?? 'N/A'}</p>
      </div>
      <input
        type="checkbox"
        className="consultor-objetivos-checkbox"
        checked={isSelected}
        onChange={() => onToggle(badge.id_badge)}
        aria-label={`Selecionar ${badge.nome_badge}`}
      />
    </label>
  )
}

function FeedbackBanner({ type, message, onDismiss }) {
  if (!message) return null
  return (
    <div className={`consultor-objetivos-feedback consultor-objetivos-feedback--${type}`} role="alert">
      <span>{message}</span>
      <button type="button" onClick={onDismiss} aria-label="Fechar aviso">✕</button>
    </div>
  )
}

// ─── view principal ───────────────────────────────────────────────────────────

function ConsultorObjetivosView() {
  const navigate = useNavigate()

  // ── dados (formato raw do back) ──
  const [objetivos, setObjetivos] = useState([])
  const [badges, setBadges] = useState([])
  const [loadingObjetivos, setLoadingObjetivos] = useState(true)
  const [loadingBadges, setLoadingBadges] = useState(true)

  // ── formulário ──
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIds, setSelectedIds] = useState(() => new Set())
  const [targetDate, setTargetDate] = useState(() => minDate())
  const [submitting, setSubmitting] = useState(false)

  // ── feedback ──
  const [feedback, setFeedback] = useState(null) // { type: 'success'|'error', message: string }

  const fetchedRef = useRef(false)

  // ── fetch ─────────────────────────────────────────────────────────────────

  const fetchObjetivos = useCallback(async () => {
    setLoadingObjetivos(true)
    try {
      const data = await getMeusObjetivos()
      setObjetivos(data)
    } catch (err) {
      console.error('Erro ao carregar objetivos:', err)
    } finally {
      setLoadingObjetivos(false)
    }
  }, [])

  const fetchBadges = useCallback(async () => {
    setLoadingBadges(true)
    try {
      const data = await getBadgesDisponiveisObjetivos()
      setBadges(data)
    } catch (err) {
      console.error('Erro ao carregar badges disponíveis:', err)
    } finally {
      setLoadingBadges(false)
    }
  }, [])

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true
    fetchObjetivos()
    fetchBadges()
  }, [fetchObjetivos, fetchBadges])

  // ── pesquisa ──────────────────────────────────────────────────────────────

  const filteredCandidates = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return badges
    return badges.filter((b) =>
      `${b.nome_badge} ${b.nome_area ?? ''}`.toLowerCase().includes(term)
    )
  }, [searchTerm, badges])

  // ── seleção ───────────────────────────────────────────────────────────────

  function toggleSelection(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // ── submissão ─────────────────────────────────────────────────────────────

  async function handleAddObjetivo() {
    if (!canSubmit) return
    setSubmitting(true)
    setFeedback(null)

    const selectedBadges = badges.filter((b) => selectedIds.has(b.id_badge))

    try {
      // O back aceita um objetivo por chamada — dispara em paralelo
      const results = await Promise.allSettled(
        selectedBadges.map((badge) =>
          criarObjetivo({
            idBadge: badge.id_badge,
            dataLimiteConclusao: targetDate,
            nomeBadge: badge.nome_badge,
          })
        )
      )

      const errors = results
        .filter((r) => r.status === 'rejected')
        .map((r) => r.reason?.response?.data?.mensagem ?? r.reason?.message ?? 'Erro desconhecido')

      if (errors.length === 0) {
        setFeedback({
          type: 'success',
          message: `${selectedBadges.length === 1 ? 'Objetivo criado' : `${selectedBadges.length} objetivos criados`} com sucesso!`,
        })
        setSelectedIds(new Set())
        await Promise.all([fetchObjetivos(), fetchBadges()])
      } else {
        setFeedback({ type: 'error', message: `Erro: ${errors.join(' | ')}` })
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message ?? 'Erro inesperado.' })
    } finally {
      setSubmitting(false)
    }
  }

  const canSubmit = selectedIds.size > 0 && Boolean(targetDate) && !submitting

  // ── navegação ─────────────────────────────────────────────────────────────

  function openBadge(id) {
    navigate(`/consultor/badge/${id}`)
  }

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <section className="consultor-objetivos-page">
      <header className="consultor-objetivos-hero">
        <div className="consultor-objetivos-hero-copy">
          <h1>Objetivos</h1>
          <p>Define objetivos para melhorar a tua organização</p>
        </div>
      </header>

      <FeedbackBanner
        type={feedback?.type}
        message={feedback?.message}
        onDismiss={() => setFeedback(null)}
      />

      {/* ── Tabela de objetivos ── */}
      <article className="consultor-objetivos-card" aria-label="Objetivos">
        <header className="consultor-objetivos-card-header">
          <IconObjetivos className="consultor-objetivos-card-header-icon" />
          <h2>Objetivos</h2>
        </header>

        {loadingObjetivos ? (
          <div className="consultor-objetivos-loading" aria-live="polite">
            <HiOutlineArrowPath className="consultor-objetivos-spinner" aria-hidden="true" />
            <span>A carregar objetivos…</span>
          </div>
        ) : objetivos.length === 0 ? (
          <p className="consultor-objetivos-empty">Ainda não tens objetivos definidos.</p>
        ) : (
          <table className="consultor-objetivos-table">
            <thead>
              <tr>
                <th className="consultor-objetivos-col-description" scope="col">DESCRIÇÃO</th>
                <th className="consultor-objetivos-col-status" scope="col">ESTADO</th>
                <th className="consultor-objetivos-col-date" scope="col">DATA OBJETIVO</th>
              </tr>
            </thead>
            <tbody>
              {objetivos.map((obj) => (
                <ObjetivoRow
                  key={obj.id_objetivo}
                  row={{
                    id: obj.id_objetivo,
                    badgeName: obj.badge?.nome_badge ?? obj.nome_objetivo,
                    description: `Completar Badge: ${obj.badge?.nome_badge ?? obj.nome_objetivo}`,
                    thumb: obj.badge?.imagem_badge ?? null,
                    status: deriveStatus(obj),
                    date: formatDate(obj.data_limite_conclusao),
                  }}
                  onOpen={() => openBadge(obj.id_badge)}
                />
              ))}
            </tbody>
          </table>
        )}
      </article>

      {/* ── Adicionar objetivo ── */}
      <article className="consultor-objetivos-card" aria-label="Adicionar Objetivo">
        <header className="consultor-objetivos-card-header">
          <h2>Adicionar Objetivo</h2>
        </header>

        <label className="consultor-objetivos-search">
          <HiOutlineMagnifyingGlass className="consultor-objetivos-search-icon" aria-hidden="true" />
          <input
            type="text"
            placeholder="Pesquisar por nome do badge…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Pesquisar badges"
          />
        </label>

        <div className="consultor-objetivos-suggestions">
          {filteredCandidates.length > 0 ? (
            (searchTerm.trim() ? filteredCandidates : filteredCandidates.slice(0, 5)).map((badge) => (
              <CandidateRow
                key={badge.id_badge}
                badge={badge}
                isSelected={selectedIds.has(badge.id_badge)}
                onToggle={toggleSelection}
              />
            ))
          ) : (
            <p className="consultor-objetivos-empty">Nenhum badge encontrado.</p>
          )}
        </div>

        <div className="consultor-objetivos-card-footer">
          <div className="consultor-objetivos-date-field">
            <label htmlFor="consultor-objetivos-date">Data Objetivo:</label>
            <input
              id="consultor-objetivos-date"
              type="date"
              value={targetDate}
              min={minDate()}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="consultor-objetivos-add-btn"
            onClick={handleAddObjetivo}
            disabled={!canSubmit}
            aria-busy={submitting}
          >
            {submitting
              ? <HiOutlineArrowPath className="consultor-objetivos-spinner consultor-objetivos-add-btn-icon" aria-hidden="true" />
              : <HiOutlinePlus className="consultor-objetivos-add-btn-icon" aria-hidden="true" />
            }
            <span>{submitting ? 'A adicionar…' : 'Adicionar Objetivo'}</span>
          </button>
        </div>
      </article>
    </section>
  )
}

export default ConsultorObjetivosView