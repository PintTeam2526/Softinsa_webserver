import { useEffect, useMemo, useRef, useState } from 'react'
import { FaFilter, FaSearch } from 'react-icons/fa'
import SLLPagination from '../../components/SLLPagination'
import './TalentManagerPedidosView.css'

import { getAreas } from '../../../controllers/areasController'
import { getPedidos, tmReview } from '../../../controllers/pedidosController'

function ResponseDeadlineIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M15.4853 8.72754C15.8576 8.96777 16.1894 9.24023 16.481 9.54492C16.7726 9.84961 17.0239 10.1836 17.2348 10.5469C17.4458 10.9102 17.6008 11.2939 17.7001 11.6982C17.7994 12.1025 17.8553 12.5156 17.8676 12.9375C17.8676 13.6348 17.7281 14.291 17.4489 14.9062C17.1697 15.5215 16.785 16.0576 16.2949 16.5146C15.8048 16.9717 15.2371 17.332 14.5919 17.5957C13.9467 17.8594 13.2518 17.9941 12.5074 18C11.9428 18 11.3969 17.9209 10.8695 17.7627C10.3422 17.6045 9.85818 17.376 9.41771 17.0771C8.97726 16.7783 8.5864 16.4209 8.24518 16.0049C7.90395 15.5889 7.64028 15.1289 7.45416 14.625H0V1.125H2.38235V0H3.57353V1.125H11.9118V0H13.1029V1.125H15.4853V8.72754ZM1.19118 2.25V4.5H14.2941V2.25H13.1029V3.375H11.9118V2.25H3.57353V3.375H2.38235V2.25H1.19118ZM7.17498 13.5C7.15637 13.3184 7.14706 13.1309 7.14706 12.9375C7.14706 12.4336 7.22151 11.9443 7.37041 11.4697C7.5193 10.9951 7.74575 10.5469 8.04975 10.125H7.14706V9H8.33824V9.75586C8.5926 9.45703 8.87489 9.19336 9.18508 8.96484C9.49532 8.73633 9.83033 8.54004 10.1901 8.37598C10.55 8.21191 10.9254 8.08887 11.3162 8.00684C11.707 7.9248 12.104 7.88086 12.5074 7.875C13.1277 7.875 13.7233 7.97168 14.2941 8.16504V5.625H1.19118V13.5H7.17498ZM12.5074 16.875C13.0843 16.875 13.6241 16.7725 14.1266 16.5674C14.6291 16.3623 15.0696 16.0811 15.448 15.7236C15.8266 15.3662 16.1243 14.9502 16.3415 14.4756C16.5586 14.001 16.6702 13.4883 16.6765 12.9375C16.6765 12.3926 16.5679 11.8828 16.3508 11.4082C16.1336 10.9336 15.8359 10.5176 15.4573 10.1602C15.0789 9.80273 14.6384 9.52148 14.1359 9.31641C13.6334 9.11133 13.0906 9.00586 12.5074 9C11.9304 9 11.3906 9.10254 10.8881 9.30762C10.3856 9.5127 9.94511 9.79395 9.56668 10.1514C9.18819 10.5088 8.89039 10.9248 8.67326 11.3994C8.45611 11.874 8.34444 12.3867 8.33824 12.9375C8.33824 13.4824 8.44681 13.9922 8.66395 14.4668C8.88109 14.9414 9.17889 15.3574 9.55736 15.7148C9.93579 16.0723 10.3763 16.3535 10.8788 16.5586C11.3813 16.7637 11.9242 16.8691 12.5074 16.875ZM13.1029 12.375H14.8897V13.5H11.9118V10.125H13.1029V12.375ZM2.38235 9H3.57353V10.125H2.38235V9ZM4.76471 9H5.95588V10.125H4.76471V9ZM4.76471 6.75H5.95588V7.875H4.76471V6.75ZM2.38235 11.25H3.57353V12.375H2.38235V11.25ZM4.76471 11.25H5.95588V12.375H4.76471V11.25ZM8.33824 7.875H7.14706V6.75H8.33824V7.875ZM10.7206 7.875H9.52941V6.75H10.7206V7.875ZM13.1029 7.875H11.9118V6.75H13.1029V7.875Z" fill="#8A92A6" />
    </svg>
  )
}

function EvidenceDocumentIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M10 1H4C3.46957 1 2.96086 1.21071 2.58579 1.58579C2.21071 1.96086 2 2.46957 2 3V15C2 15.5304 2.21071 16.0391 2.58579 16.4142C2.96086 16.7893 3.46957 17 4 17H14C14.5304 17 15.0391 16.7893 15.4142 16.4142C15.7893 16.0391 16 15.5304 16 15V7L10 1Z" stroke="#39639C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 1V7H16" stroke="#39639C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function EvidenceDownloadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10" stroke="#8A92A6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.66675 6.66669L8.00008 10L11.3335 6.66669" stroke="#8A92A6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 10V2" stroke="#8A92A6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const AVATAR_TONES = ['primary', 'secondary', 'dark']

function calcDeadline(createdAt, sla) {
  if (!createdAt || !sla) return 'Prazo não definido'
  const deadline = new Date(new Date(createdAt).getTime() + sla * 24 * 60 * 60 * 1000)
  const diffDays = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return 'Tempo limite ultrapassado'
  if (diffDays === 0) return 'Tempo limite termina hoje'
  return `Tempo limite de resposta termina em ${diffDays} dia${diffDays !== 1 ? 's' : ''}`
}

function getAvatarInitials(name) {
  return name.split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('')
}

function mapPedidoPendente(row, areaMap, index) {
  const badge = row.Badge ?? {}
  const consultant = row.Consultore?.Utilizadore?.nome_utilizador ?? String(row.id_consultor)
  const areaNome = areaMap[badge.id_area]?.name ?? ''

  return {
    id: row.id_pedido_badge,
    title: badge.nome_badge ?? `Pedido ${row.id_pedido_badge}`,
    consultant,
    area: areaNome,
    deadline: calcDeadline(row.createdAt, badge.sla),
    avatar: getAvatarInitials(badge.nome_badge ?? ''),
    avatarImage: badge.imagem_badge ?? null,
    avatarTone: AVATAR_TONES[index % AVATAR_TONES.length],
    requirements: badge.descricao_badge ? [badge.descricao_badge] : [],
    documents: [],
  }
}


function RequestBadge({ tone, children, image }) {
  if (image) {
    return (
      <div className={`sll-pending-request-avatar is-${tone}`}>
        <img
          src={`data:image/png;base64,${image}`}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }}
        />
      </div>
    )
  }

  return <div className={`sll-pending-request-avatar is-${tone}`}>{children}</div>
}

const ALERT_COPY = {
  accept: {
    title: 'Aceitar Pedido de Badge',
    subtitle: 'Deseja mesmo realizar esta ação?',
    withReason: false,
  },
  reject: {
    title: 'Rejeitar Pedido de Badge',
    subtitle: 'Deseja mesmo realizar esta ação?',
    withReason: true,
  },
}

function ConfirmActionDialog({ action, onConfirm, onCancel }) {
  const [reason, setReason] = useState('')
  const dialogRef = useRef(null)
  const copy = ALERT_COPY[action]

  useEffect(() => {
    function handleKey(event) {
      if (event.key === 'Escape') {
        onCancel()
      }
    }

    document.addEventListener('keydown', handleKey)

    return () => document.removeEventListener('keydown', handleKey)
  }, [onCancel])

  function handleBackdropClick(event) {
    if (dialogRef.current && !dialogRef.current.contains(event.target)) {
      onCancel()
    }
  }

  function handleConfirm() {
    onConfirm(copy.withReason ? reason.trim() : undefined)
  }

  return (
    <div className="sll-pending-alert-backdrop" onMouseDown={handleBackdropClick}>
      <div
        className="sll-pending-alert-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tm-pending-alert-title"
        ref={dialogRef}
      >
        <div className="sll-pending-alert-header">
          <span className="sll-pending-alert-eyebrow" id="tm-pending-alert-title">Alerta</span>
          <button
            type="button"
            className="sll-pending-alert-close"
            onClick={onCancel}
            aria-label="Fechar"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="sll-pending-alert-body">
          <h2 className="sll-pending-alert-title">{copy.title}</h2>
          <p className="sll-pending-alert-subtitle">{copy.subtitle}</p>

          {copy.withReason ? (
            <textarea
              className="sll-pending-alert-textarea"
              placeholder="Insira o motivo"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
          ) : null}
        </div>

        <div className="sll-pending-alert-actions">
          <button type="button" className="sll-pending-alert-btn is-secondary" onClick={onCancel}>
            Não
          </button>
          <button type="button" className="sll-pending-alert-btn is-primary" onClick={handleConfirm}>
            Sim
          </button>
        </div>
      </div>
    </div>
  )
}

function RequirementStarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 2L19.5 12H30L21.5 18.5L25 28.5L16 22L7 28.5L10.5 18.5L2 12H12.5L16 2Z" fill="#8A92A6" />
    </svg>
  )
}

function PendingRequestCard({ request }) {
  return (
    <article className="sll-pending-card">
      <div className="sll-pending-card-head">
        <RequestBadge tone={request.avatarTone} image={request.avatarImage}>{request.avatar}</RequestBadge>

        <div className="sll-pending-card-head-copy">
          <h3>{request.title}</h3>
          <p>{request.consultant}</p>
          <div className="sll-pending-deadline">
            <ResponseDeadlineIcon />
            <span>{request.deadline}</span>
          </div>
        </div>
      </div>

      <div className="sll-pending-card-body">
        <div className="sll-pending-requirements">
          {request.requirements.map((requirement, index) => (
            <div className="sll-pending-requirement-row" key={`${request.title}-${index}`}>
              <div className="sll-pending-requirement-copy">
                <strong>Requisito {index + 1}</strong>
                <span>{requirement}</span>
              </div>
              <div className="sll-pending-requirement-star" aria-hidden="true">
                <RequirementStarIcon />
              </div>
            </div>
          ))}
        </div>

        <div className="sll-pending-documents">
          <h4>Documentos Anexados</h4>

          <div className="sll-pending-documents-list">
            {request.documents.map((documentName) => (
              <div className="sll-pending-document-item" key={`${request.title}-${documentName}`}>
                <div className="sll-pending-document-main">
                  <div className="sll-pending-document-icon" aria-hidden="true">
                    <EvidenceDocumentIcon />
                  </div>
                  <div>
                    <strong>{documentName}</strong>
                    <span>2.5 MB</span>
                  </div>
                </div>
                <button type="button" className="sll-pending-document-download" aria-label={`Descarregar ${documentName}`}>
                  <EvidenceDownloadIcon />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sll-pending-card-actions">
        <button type="button" className="sll-pending-action is-reject" onClick={() => request.onAction('reject')}>
          Rejeitar
        </button>
        <button type="button" className="sll-pending-action is-accept" onClick={() => request.onAction('accept')}>
          Aceitar
        </button>
      </div>
    </article>
  )
}

function TalentManagerPedidosView() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [draftArea, setDraftArea] = useState('')
  const [appliedArea, setAppliedArea] = useState('')
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pendingAction, setPendingAction] = useState(null)
  const filterPopoverRef = useRef(null)

  const areaOptions = useMemo(() => [...new Set(requests.map((request) => request.area))], [requests])

  const filteredRequests = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return requests.filter((request) => {
      const searchableText = [
        request.title,
        request.consultant,
        request.area,
        request.deadline,
        request.avatar,
        ...request.requirements,
        ...request.documents,
      ]
        .join(' ')
        .toLowerCase()

      const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch)
      const matchesArea = !appliedArea || request.area === appliedArea

      return matchesSearch && matchesArea
    })
  }, [appliedArea, requests, searchTerm])

  const requestsPerPage = 2
  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / requestsPerPage))

  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * requestsPerPage
    return filteredRequests.slice(startIndex, startIndex + requestsPerPage)
  }, [currentPage, filteredRequests])

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const [pedidosData, areasData] = await Promise.all([getPedidos(), getAreas()])

        const areaMap = Object.fromEntries(
          areasData.map((a) => [a.id_area, { name: a.nome_area }])
        )

        const pendentes = pedidosData
          .filter((row) => row.estado_atual === 1)
          .map((row, i) => mapPedidoPendente(row, areaMap, i))

        setRequests(pendentes)
      } catch (err) {
        console.error('Erro ao carregar pedidos pendentes TM', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])


  useEffect(() => {
    setCurrentPage(1)
  }, [appliedArea, searchTerm])

  useEffect(() => {
    setCurrentPage((previousPage) => Math.min(previousPage, totalPages))
  }, [totalPages])

  useEffect(() => {
    function handleDocumentClick(event) {
      if (filterPopoverRef.current && !filterPopoverRef.current.contains(event.target)) {
        setIsFilterOpen(false)
      }
    }

    document.addEventListener('mousedown', handleDocumentClick)
    return () => document.removeEventListener('mousedown', handleDocumentClick)
  }, [])

  useEffect(() => {
    if (isFilterOpen) {
      setDraftArea(appliedArea)
    }
  }, [appliedArea, isFilterOpen])

  function applyFilter() {
    setAppliedArea(draftArea)
    setIsFilterOpen(false)
  }

  function requestAction(requestId, action) {
    setPendingAction({ requestId, action })
  }

  async function confirmPendingAction(reason) {
    if (!pendingAction) return

    const acaoMap = { accept: 'aprovar', reject: 'devolver' }

    try {
      await tmReview(pendingAction.requestId, {
        acao: acaoMap[pendingAction.action],
        ...(reason ? { justificacao: reason } : {}),
      })
      setRequests((prev) => prev.filter((r) => r.id !== pendingAction.requestId))
    } catch (err) {
      console.error('Erro ao processar pedido TM', err)
    }

    setPendingAction(null)
  }


  function cancelPendingAction() {
    setPendingAction(null)
  }

  return (
    <div className="sll-pending-content">
      <section className="sll-pending-hero" aria-label="Pedidos pendentes">
        <div className="sll-pending-hero-copy">
          <h1>Pedidos pendentes</h1>
          <p>Dá resposta aos pedidos que aguardam resposta</p>
        </div>
      </section>

      <section className="sll-pending-toolbar" aria-label="Pesquisar pedidos">
        <label className="sll-pending-search">
          <FaSearch aria-hidden="true" />
          <input
            type="text"
            placeholder="Pesquisar por nome do consultor ou badge..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </label>

        <div className="sll-pending-filter-popover-wrap" ref={filterPopoverRef}>
          <button
            type="button"
            className="sll-pending-filter-btn"
            onClick={() => setIsFilterOpen((previousValue) => !previousValue)}
            aria-expanded={isFilterOpen}
            aria-haspopup="dialog"
          >
            <FaFilter aria-hidden="true" />
            <span>Filtro</span>
          </button>

          {isFilterOpen ? (
            <div className="sll-pending-filter-popover" role="dialog" aria-label="FiltroPedidosPendentes">
              <div className="sll-pending-filter-field">
                <label>Área</label>
                <div className="sll-pending-filter-select-wrap">
                  <select className="sll-pending-filter-select" value={draftArea} onChange={(event) => setDraftArea(event.target.value)}>
                    <option value="">Selecione a Área</option>
                    {areaOptions.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="button" className="sll-pending-filter-apply" onClick={applyFilter}>
                Filtrar
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <section className="sll-pending-list" aria-label="Lista de pedidos pendentes">
        {isLoading ? (
          <p className="sll-pending-loading">A carregar pedidos…</p>
        ) : paginatedRequests.length === 0 ? (
          <p className="sll-pending-empty">Sem pedidos pendentes.</p>
        ) : (
          paginatedRequests.map((request) => (
            <PendingRequestCard
              key={request.id}
              request={{
                ...request,
                onAction: (action) => requestAction(request.id, action),
              }}
            />
          ))
        )}
      </section>

      <SLLPagination
        className="sll-pending-pagination"
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        firstContent="«"
        previousContent="‹"
        nextContent="›"
        lastContent="»"
      />

      {pendingAction ? (
        <ConfirmActionDialog
          action={pendingAction.action}
          onConfirm={confirmPendingAction}
          onCancel={cancelPendingAction}
        />
      ) : null}
    </div>
  )
}

export default TalentManagerPedidosView