import { useEffect, useMemo, useRef, useState } from 'react'
import { FaDownload, FaFileAlt, FaFilter, FaSearch } from 'react-icons/fa'
import SLLPagination from '../../components/SLLPagination'
import './TalentManagerPedidosView.css'

const heroCircle1 = 'https://www.figma.com/api/mcp/asset/d52bcef6-8633-4aef-a46d-620628b11422'
const heroCircle2 = 'https://www.figma.com/api/mcp/asset/015d6486-d269-4542-b2af-cbffe841b87a'
const heroCircle3 = 'https://www.figma.com/api/mcp/asset/a95d40bd-58a1-4651-b2be-51b95d3ff5d3'
const heroCircle4 = 'https://www.figma.com/api/mcp/asset/c31d8d2e-032c-42c1-90ad-576563f8c6c7'
const heroCircle5 = 'https://www.figma.com/api/mcp/asset/83a3d8e4-0fed-4f71-a3dc-985cb88a65cc'

const pendingRequests = [
  {
    title: 'Data Analytics - Sénior',
    consultant: 'Maria Santos',
    area: 'Data',
    deadline: 'Tempo limite de resposta termina em 5 dias',
    avatar: 'DA',
    avatarTone: 'primary',
    requirements: [
      'Criar um relatório avançado que contenha visualizações interativas',
      'Criar um relatório avançado que contenha visualizações interativas',
      'Criar um relatório avançado que contenha visualizações interativas',
    ],
    documents: ['Evidência 1', 'Evidência 2', 'Evidência 3'],
  },
  {
    title: 'Cloud Architecture - Intermédio',
    consultant: 'João Silva',
    area: 'Cloud',
    deadline: 'Tempo limite de resposta termina em 10 dias',
    avatar: 'CA',
    avatarTone: 'secondary',
    requirements: [
      'Criar um relatório avançado que contenha visualizações interativas',
      'Criar um relatório avançado que contenha visualizações interativas',
      'Criar um relatório avançado que contenha visualizações interativas',
    ],
    documents: ['Evidência 1', 'Evidência 2', 'Evidência 3'],
  },
  {
    title: 'Agile Leadership - Júnior',
    consultant: 'Pedro Costa',
    area: 'Agile',
    deadline: 'Tempo limite de resposta termina em 10 dias',
    avatar: 'AL',
    avatarTone: 'dark',
    requirements: [
      'Criar um relatório avançado que contenha visualizações interativas',
      'Criar um relatório avançado que contenha visualizações interativas',
      'Criar um relatório avançado que contenha visualizações interativas',
    ],
    documents: ['Evidência 1', 'Evidência 2', 'Evidência 3'],
  },
]

function RequestBadge({ tone, children }) {
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
        <RequestBadge tone={request.avatarTone}>{request.avatar}</RequestBadge>

        <div className="sll-pending-card-head-copy">
          <h3>{request.title}</h3>
          <p>{request.consultant}</p>
          <div className="sll-pending-deadline">
            <FaFileAlt aria-hidden="true" />
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
                    <FaFileAlt />
                  </div>
                  <div>
                    <strong>{documentName}</strong>
                    <span>2.5 MB</span>
                  </div>
                </div>
                <button type="button" className="sll-pending-document-download" aria-label={`Descarregar ${documentName}`}>
                  <FaDownload />
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
  const [requests, setRequests] = useState(pendingRequests)
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

  function requestAction(requestTitle, action) {
    setPendingAction({ requestTitle, action })
  }

  function confirmPendingAction() {
    if (!pendingAction) {
      return
    }

    setRequests((currentRequests) =>
      currentRequests.filter((request) => request.title !== pendingAction.requestTitle),
    )
    setPendingAction(null)
  }

  function cancelPendingAction() {
    setPendingAction(null)
  }

  return (
    <div className="sll-pending-content">
      <section className="sll-pending-hero" aria-label="Pedidos pendentes">
        <div className="sll-pending-hero-art" aria-hidden="true">
          <img className="sll-pending-hero-circle sll-pending-hero-circle-5" src={heroCircle5} alt="" />
          <img className="sll-pending-hero-circle sll-pending-hero-circle-4" src={heroCircle4} alt="" />
          <img className="sll-pending-hero-circle sll-pending-hero-circle-3" src={heroCircle3} alt="" />
          <img className="sll-pending-hero-circle sll-pending-hero-circle-2" src={heroCircle2} alt="" />
          <img className="sll-pending-hero-circle sll-pending-hero-circle-1" src={heroCircle1} alt="" />
        </div>

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
        {paginatedRequests.map((request) => (
          <PendingRequestCard
            key={request.title}
            request={{
              ...request,
              onAction: (action) => requestAction(request.title, action),
            }}
          />
        ))}
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