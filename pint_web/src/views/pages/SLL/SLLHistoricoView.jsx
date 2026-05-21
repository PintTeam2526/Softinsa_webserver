import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { FaFilter, FaSearch, FaTimes, FaUpload } from 'react-icons/fa'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import SLLSidebar from '../../components/SLLSidebar'
import SLLPagination from '../../components/SLLPagination'
import SLLTopbar from '../../components/SLLTopbar'
import './SLL-historico.css'


import { getLearningPaths } from '../../../controllers/learningPathsController'
import { getServiceLines } from '../../../controllers/serviceLinesController'
import { getAreas } from '../../../controllers/areasController'
import { getPedidos, getPedidoHistorico } from '../../../controllers/pedidosController'

const requestAvatar = 'https://www.figma.com/api/mcp/asset/cf64d835-06cf-435b-8bfd-8b387bf43fa7'

function PaginationArrow({ direction = 'left', double = false }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      {double ? (
        direction === 'left' ? (
          <>
            <path d="M7.75 2.25L4.25 6L7.75 9.75L8.75 8.75L6.25 6L8.75 3.25L7.75 2.25Z" fill="currentColor" />
            <path d="M4.75 2.25L1.25 6L4.75 9.75L5.75 8.75L3.25 6L5.75 3.25L4.75 2.25Z" fill="currentColor" />
          </>
        ) : (
          <>
            <path d="M4.25 2.25L7.75 6L4.25 9.75L3.25 8.75L5.75 6L3.25 3.25L4.25 2.25Z" fill="currentColor" />
            <path d="M7.25 2.25L10.75 6L7.25 9.75L6.25 8.75L8.75 6L6.25 3.25L7.25 2.25Z" fill="currentColor" />
          </>
        )
      ) : direction === 'left' ? (
        <path d="M7.75 2.25L4.25 6L7.75 9.75L8.75 8.75L6.25 6L8.75 3.25L7.75 2.25Z" fill="currentColor" />
      ) : (
        <path d="M4.25 2.25L7.75 6L4.25 9.75L3.25 8.75L5.75 6L3.25 3.25L4.25 2.25Z" fill="currentColor" />
      )}
    </svg>
  )
}

function getStatusClass(status) {
  return status.toLowerCase().replaceAll(' ', '-')
}

const STATUS_MAP = {
  1: 'Em progresso',
  2: 'Em progresso',
  3: 'Em progresso',
  4: 'Aprovado',
  5: 'Rejeitado',
  6: 'Em progresso',
}

const RESPONSIBLE_MAP = {
  1: 'Consultor',
  2: 'Talent Manager',
  3: 'Talent Manager',
  4: 'Service Line Líder',
  5: 'Service Line Líder',
  6: 'Service Line Líder',
}

const PT_MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function formatApprovedAt(status, dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const formatted = `${d.getDate()} ${PT_MONTHS[d.getMonth()]} ${d.getFullYear()}`
  if (status === 'Aprovado') return `Aprovado em ${formatted}`
  if (status === 'Rejeitado') return `Rejeitado em ${formatted}`
  return `Em progresso desde ${formatted}`
}

function mapPedido(row, areaMap, slMap, lpMap) {
  const status = STATUS_MAP[row.estado_atual] ?? 'Em progresso'
  const dateStr = row.createdAt ?? row.updatedAt ?? null
  const badge = row.Badge ?? {}

  const consultant = row.Consultore?.Utilizadore?.nome_utilizador ?? String(row.id_consultor)

  const areaObj = areaMap[badge.id_area]
  const areaNome = areaObj?.name ?? ''
  const slObj = slMap[areaObj?.id_service_line]
  const slNome = slObj?.name ?? ''
  const lpNome = lpMap[slObj?.id_learning_path] ?? ''

  return {
    id: row.id_pedido_badge,
    title: badge.nome_badge ?? `Pedido ${row.id_pedido_badge}`,
    consultant,
    status,
    approvedDate: dateStr ? String(dateStr).slice(0, 10) : '',
    approvedAt: formatApprovedAt(status, dateStr),
    area: areaNome,
    serviceLine: slNome,
    learningPath: lpNome,
  }
}

function HistoryBadge({ status }) {
  const label = status === 'Em progresso' ? 'Estado atualizado' : status

  return <span className={`sll-history-status-badge is-${getStatusClass(status)}`}>{label}</span>
}

const HISTORY_MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function formatHistoryDate(dateString) {
  const [year, month, day] = dateString.split('-')
  return `${day} ${HISTORY_MONTHS[Number(month) - 1]} ${year}`
}

function HistoryClockIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="sll-history-step-icon">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 4.5V8L10.4 9.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function HistoryCheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="sll-history-step-icon">
      <path d="M3.5 8.5L6.5 11.5L12.5 4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function HistoryRejectIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="sll-history-step-icon">
      <path d="M4 4L12 12M4 12L12 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function HistoryTimestampIcon({ status }) {
  const clipId = useId()
  const color = status === 'Rejeitado' ? '#dc3545' : status === 'Em progresso' ? '#8a92a6' : '#1aa053'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" style={{ color }}>
      <g clipPath={`url(#${clipId})`}>
        <path d="M15.4853 8.72754C15.8576 8.96777 16.1894 9.24023 16.481 9.54492C16.7726 9.84961 17.0239 10.1836 17.2348 10.5469C17.4458 10.9102 17.6008 11.2939 17.7001 11.6982C17.7994 12.1025 17.8553 12.5156 17.8676 12.9375C17.8676 13.6348 17.7281 14.291 17.4489 14.9062C17.1697 15.5215 16.785 16.0576 16.2949 16.5146C15.8048 16.9717 15.2371 17.332 14.5919 17.5957C13.9467 17.8594 13.2518 17.9941 12.5074 18C11.9428 18 11.3969 17.9209 10.8695 17.7627C10.3422 17.6045 9.85818 17.376 9.41771 17.0771C8.97726 16.7783 8.5864 16.4209 8.24518 16.0049C7.90395 15.5889 7.64028 15.1289 7.45416 14.625H0V1.125H2.38235V0H3.57353V1.125H11.9118V0H13.1029V1.125H15.4853V8.72754ZM1.19118 2.25V4.5H14.2941V2.25H13.1029V3.375H11.9118V2.25H3.57353V3.375H2.38235V2.25H1.19118ZM7.17498 13.5C7.15637 13.3184 7.14706 13.1309 7.14706 12.9375C7.14706 12.4336 7.22151 11.9443 7.37041 11.4697C7.5193 10.9951 7.74575 10.5469 8.04975 10.125H7.14706V9H8.33824V9.75586C8.5926 9.45703 8.87489 9.19336 9.18508 8.96484C9.49532 8.73633 9.83033 8.54004 10.1901 8.37598C10.55 8.21191 10.9254 8.08887 11.3162 8.00684C11.707 7.9248 12.104 7.88086 12.5074 7.875C13.1277 7.875 13.7233 7.97168 14.2941 8.16504V5.625H1.19118V13.5H7.17498ZM12.5074 16.875C13.0843 16.875 13.6241 16.7725 14.1266 16.5674C14.6291 16.3623 15.0696 16.0811 15.448 15.7236C15.8266 15.3662 16.1243 14.9502 16.3415 14.4756C16.5586 14.001 16.6702 13.4883 16.6765 12.9375C16.6765 12.3926 16.5679 11.8828 16.3508 11.4082C16.1336 10.9336 15.8359 10.5176 15.4573 10.1602C15.0789 9.80273 14.6384 9.52148 14.1359 9.31641C13.6334 9.11133 13.0906 9.00586 12.5074 9C11.9304 9 11.3906 9.10254 10.8881 9.30762C10.3856 9.5127 9.94511 9.79395 9.56668 10.1514C9.18819 10.5088 8.89039 10.9248 8.67326 11.3994C8.45611 11.874 8.34444 12.3867 8.33824 12.9375C8.33824 13.4824 8.44681 13.9922 8.66395 14.4668C8.88109 14.9414 9.17889 15.3574 9.55736 15.7148C9.93579 16.0723 10.3763 16.3535 10.8788 16.5586C11.3813 16.7637 11.9242 16.8691 12.5074 16.875ZM13.1029 12.375H14.8897V13.5H11.9118V10.125H13.1029V12.375ZM2.38235 9H3.57353V10.125H2.38235V9ZM4.76471 9H5.95588V10.125H4.76471V9ZM4.76471 6.75H5.95588V7.875H4.76471V6.75ZM2.38235 11.25H3.57353V12.375H2.38235V11.25ZM4.76471 11.25H5.95588V12.375H4.76471V11.25ZM8.33824 7.875H7.14706V6.75H8.33824V7.875ZM10.7206 7.875H9.52941V6.75H10.7206V7.875ZM13.1029 7.875H11.9118V6.75H13.1029V7.875Z" fill="currentColor" />
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width="18" height="18" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

function buildHistorySteps(historico) {
  const CARGO_MAP = {
    1: 'Consultor',
    2: 'Talent Manager',
    3: 'Talent Manager',
    4: 'Service Line Líder',
    5: 'Service Line Líder',
    6: 'Service Line Líder',
  }

  return historico.map((entry) => {
    const estado = entry.id_estado
    const isAprovado = estado === 2 || estado === 4
    const isRejeitado = estado === 5

    const cargo = CARGO_MAP[estado] ?? 'Sistema'
    const responsible = entry.nome_avaliador
      ? `${entry.nome_avaliador} / ${cargo}`
      : cargo

    return {
      responsible,
      state: entry.motivo ?? entry.estado_objetivo ?? '',
      stateClass: isRejeitado ? 'is-rejected' : isAprovado ? 'is-approved' : 'is-progress',
      icon: isRejeitado ? <HistoryRejectIcon /> : isAprovado ? <HistoryCheckIcon /> : <HistoryClockIcon />,
      date: entry.data ? formatHistoryDate(String(entry.data).slice(0, 10)) : '—',
    }
  })
}

function HistoryRequestCard({ request, isExpanded, onToggle, steps }) {
  return (
    <article className={`sll-history-card-wrap${isExpanded ? ' is-expanded' : ''}`}>
      <button type="button" className="sll-history-card" onClick={onToggle} aria-expanded={isExpanded}>
        <div className="sll-history-card-avatar" aria-hidden="true">
          <img src={requestAvatar} alt="" />
          <span className="sll-history-card-avatar-ring" />
        </div>

        <div className="sll-history-card-copy">
          <h3>{request.title}</h3>
          <p>{request.consultant}</p>
          <div className={`sll-history-card-approved${request.status === 'Rejeitado' ? ' is-rejeitado' : ''}`}>
            <HistoryTimestampIcon status={request.status} />
            <span className={request.status === 'Em progresso' ? 'is-progress' : ''}>
              {request.status === 'Em progresso'
                ? `Submetido em ${formatHistoryDate(request.approvedDate)}`
                : request.approvedAt}
            </span>
          </div>
        </div>

        <div className={`sll-history-card-status is-${getStatusClass(request.status)}`}>
          <HistoryBadge status={request.status} />
          <div className="sll-history-progress">
            <span className="is-track" />
            <span className={`is-fill${request.status === 'Em progresso' ? ' is-partial' : ''}`} />
          </div>
        </div>
      </button>

      {isExpanded ? (
        <div className="sll-history-detail">
        </div>
      ) : null}
    </article>
  )
}

function ExportFormatOption({ label, value, selected, onClick }) {
  return (
    <button type="button" className="sll-history-export-option" onClick={onClick} aria-pressed={selected}>
      <span className={`sll-history-export-option-toggle${selected ? ' is-selected' : ''}`} aria-hidden="true">
        {selected ? <span className="sll-history-export-option-dot" /> : null}
      </span>
      <span>{label}</span>
    </button>
  )
}

function SLLHistoricoView() {
  const [showExport, setShowExport] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('Aprovado')
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedKey, setExpandedKey] = useState(null)
  const [selectedExportFormat, setSelectedExportFormat] = useState('excel')
  const [draftFilters, setDraftFilters] = useState({
    dateFrom: '',
    dateTo: '',
    area: '',
    serviceLine: '',
    learningPath: '',
  })
  const [appliedFilters, setAppliedFilters] = useState({
    dateFrom: '',
    dateTo: '',
    area: '',
    serviceLine: '',
    learningPath: '',
  })
  const [pedidos, setPedidos] = useState([])
  const [filterOptions, setFilterOptions] = useState({ areas: [], serviceLines: [], learningPaths: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [historicoCache, setHistoricoCache] = useState({})

  const filterRef = useRef(null)

  const filteredRequests = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return pedidos.filter((request) => {
      const searchableText = [
        request.title,
        request.consultant,
        request.approvedAt,
        request.area,
        request.serviceLine,
        request.learningPath,
      ]
        .join(' ')
        .toLowerCase()

      const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch)
      const matchesTab = request.status === activeTab
      const matchesDateFrom = !appliedFilters.dateFrom || request.approvedDate >= appliedFilters.dateFrom
      const matchesDateTo = !appliedFilters.dateTo || request.approvedDate <= appliedFilters.dateTo
      const matchesArea = !appliedFilters.area || request.area === appliedFilters.area
      const matchesServiceLine = !appliedFilters.serviceLine || request.serviceLine === appliedFilters.serviceLine
      const matchesLearningPath = !appliedFilters.learningPath || request.learningPath === appliedFilters.learningPath

      return matchesSearch && matchesTab && matchesDateFrom && matchesDateTo && matchesArea && matchesServiceLine && matchesLearningPath
    })
  }, [activeTab, appliedFilters.area, appliedFilters.dateFrom, appliedFilters.dateTo, appliedFilters.learningPath, appliedFilters.serviceLine, searchTerm])

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
        const [pedidosData, areasData, slData, lpData] = await Promise.all([
          getPedidos(),
          getAreas(),
          getServiceLines(),
          getLearningPaths(),
        ])

        const areaMap = Object.fromEntries(
          areasData.map((a) => [a.id_area, { name: a.nome_area, id_service_line: a.id_service_line }])
        )
        const slMap = Object.fromEntries(
          slData.map((sl) => [sl.id_service_line, { name: sl.nome_service_line, id_learning_path: sl.id_learning_path }])
        )
        const lpMap = Object.fromEntries(
          lpData.map((lp) => [lp.id_learning_path, lp.nome_learning_path])
        )

        setPedidos(pedidosData.map((row) => mapPedido(row, areaMap, slMap, lpMap)))
        setFilterOptions({
          areas: areasData.map((a) => a.nome_area),
          serviceLines: slData.map((sl) => sl.nome_service_line),
          learningPaths: lpData.map((lp) => lp.nome_learning_path),
        })
      } catch (err) {
        console.error('Erro ao carregar histórico SL', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  async function handleToggle(requestId) {
    // fechar se já estava aberto
    if (expandedKey === requestId) {
      setExpandedKey(null)
      return
    }

    setExpandedKey(requestId)

    // só faz fetch se ainda não estiver em cache
    if (historicoCache[requestId] !== undefined) return

    try {
      const data = await getPedidoHistorico(requestId)
      setHistoricoCache((prev) => ({ ...prev, [requestId]: buildHistorySteps(data) }))
    } catch (err) {
      console.error('Erro ao carregar histórico do pedido', err)
      setHistoricoCache((prev) => ({ ...prev, [requestId]: [] }))
    }
  }



  useEffect(() => {
    setCurrentPage(1)
    setExpandedKey(null)
  }, [activeTab, appliedFilters.area, appliedFilters.dateFrom, appliedFilters.dateTo, appliedFilters.learningPath, appliedFilters.serviceLine, searchTerm])

  useEffect(() => {
    setCurrentPage((previousPage) => Math.min(previousPage, totalPages))
  }, [totalPages])
  useEffect(() => {
    function onDoc(e) {
      if (showFilter && filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilter(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [showFilter])

  useEffect(() => {
    if (showFilter) {
      setDraftFilters(appliedFilters)
    }
  }, [showFilter, appliedFilters])

  function updateDraftFilter(field, value) {
    setDraftFilters((previousFilters) => ({
      ...previousFilters,
      [field]: value,
    }))
  }

  function applyFilters() {
    setAppliedFilters(draftFilters)
    setShowFilter(false)
  }

  function closeExportModal() {
    setShowExport(false)
  }

  function handleExport() {
    if (selectedExportFormat === 'pdf') {
      const documentPdf = new jsPDF()

      documentPdf.setFontSize(16)
      documentPdf.text('Histórico de pedidos', 14, 16)

      autoTable(documentPdf, {
        startY: 24,
        head: [['Título', 'Consultor', 'Estado', 'Aprovado em']],
        body: filteredRequests.map((request) => [
          request.title,
          request.consultant,
          request.status,
          request.approvedAt,
        ]),
        styles: { fontSize: 10 },
      })

      documentPdf.save('historico_export.pdf')
      closeExportModal()
      return
    }

    const rows = filteredRequests.map((r) => ({ title: r.title, consultant: r.consultant, status: r.status, approvedAt: r.approvedAt }))
    const worksheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Historico')
    XLSX.writeFile(workbook, 'historico_export.xlsx')
    closeExportModal()
  }

  return (
    <div className="sll-history-page">
      <SLLSidebar />

      <main className="sll-history-main">
        <SLLTopbar />

        <div className="sll-history-content">
          <section className="sll-history-hero" aria-label="Histórico de pedidos">
            <div className="sll-history-hero-copy">
              <h1>Histórico de pedidos</h1>
              <p>Consulta aqui todos os pedidos já respondidos e por responder</p>
            </div>
          </section>

          <section className="sll-history-toolbar" aria-label="Filtros do histórico">
            <div className="sll-history-tabs" role="tablist" aria-label="Estado dos pedidos">
              <button type="button" className={`sll-history-tab-button ${activeTab === 'Aprovado' ? 'is-active is-approved' : ''}`} onClick={() => setActiveTab('Aprovado')}>
                Aprovados
              </button>
              <button type="button" className={`sll-history-tab-button ${activeTab === 'Rejeitado' ? 'is-active is-rejected' : ''}`} onClick={() => setActiveTab('Rejeitado')}>
                Rejeitados
              </button>
              <button type="button" className={`sll-history-tab-button ${activeTab === 'Em progresso' ? 'is-active is-progress' : ''}`} onClick={() => setActiveTab('Em progresso')}>
                Em progresso
              </button>
            </div>

            <button type="button" className="sll-history-export-btn" onClick={() => setShowExport(true)}>
              <FaUpload aria-hidden="true" />
              <span>Exportar</span>
            </button>
          </section>

          <section className="sll-history-search-row" aria-label="Pesquisar histórico">
            <label className="sll-history-search">
              <FaSearch aria-hidden="true" />
              <input
                type="text"
                placeholder="Pesquisar por nome do consultor ou badge..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>

            <div className="sll-history-filter-popover-wrap" ref={filterRef}>
              <button
                type="button"
                className="sll-history-filter-btn"
                onClick={() => setShowFilter((previousValue) => !previousValue)}
                aria-expanded={showFilter}
                aria-haspopup="dialog"
              >
                <FaFilter aria-hidden="true" />
                <span>Filtro</span>
              </button>

              {showFilter ? (
                <div className="sll-history-filter-popover" role="dialog" aria-label="Filtro de histórico">
                  <div className="sll-history-filter-field">
                    <label>Data</label>
                    <div className="sll-history-filter-date-grid">
                      <div className="sll-history-filter-select-wrap is-date">
                        <input
                          type="date"
                          value={draftFilters.dateFrom}
                          onChange={(event) => updateDraftFilter('dateFrom', event.target.value)}
                          aria-label="Data inicial"
                        />
                      </div>
                      <div className="sll-history-filter-select-wrap is-date">
                        <input
                          type="date"
                          value={draftFilters.dateTo}
                          onChange={(event) => updateDraftFilter('dateTo', event.target.value)}
                          aria-label="Data final"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="sll-history-filter-field">
                    <label>Área</label>
                    <div className="sll-history-filter-select-wrap">
                      <select value={draftFilters.area} onChange={(event) => updateDraftFilter('area', event.target.value)}>
                        <option value="">Selecione a Área</option>
                        {filterOptions.areas.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="sll-history-filter-field">
                    <label>Service Line</label>
                    <div className="sll-history-filter-select-wrap">
                      <select
                        value={draftFilters.serviceLine}
                        onChange={(event) => updateDraftFilter('serviceLine', event.target.value)}
                      >
                        <option value="">Selecione a Service Line</option>
                        {filterOptions.serviceLines.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="sll-history-filter-field">
                    <label>Learning Path</label>
                    <div className="sll-history-filter-select-wrap">
                      <select
                        value={draftFilters.learningPath}
                        onChange={(event) => updateDraftFilter('learningPath', event.target.value)}
                      >
                        <option value="">Selecione a Learning Path</option>
                        {filterOptions.learningPaths.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button type="button" className="sll-history-filter-apply" onClick={applyFilters}>
                    Filtrar
                  </button>
                </div>
              ) : null}
            </div>
          </section>

          <section className="sll-history-list" aria-label="Lista do histórico">
            {isLoading ? (
              <p className="sll-history-loading">A carregar pedidos…</p>
            ) : paginatedRequests.length === 0 ? (
              <p className="sll-history-empty">Sem resultados para o filtro aplicado.</p>
            ) : (
              paginatedRequests.map((request) => (
                <HistoryRequestCard
                  key={request.id}
                  request={request}
                  isExpanded={expandedKey === request.id}
                  onToggle={() => handleToggle(request.id)}
                  steps={expandedKey === request.id ? historicoCache[request.id] ?? null : null}
                />
              ))
            )}
          </section>

          {showExport ? (
            <div className="sll-history-export-backdrop" role="presentation" onClick={closeExportModal}>
              <div
                className="sll-history-export-modal"
                role="dialog"
                aria-modal="true"
                aria-label="Alerta Exportar"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="sll-history-export-header">
                  <h2>Alerta</h2>
                  <button type="button" className="sll-history-export-close" onClick={closeExportModal} aria-label="Fechar">
                    <FaTimes aria-hidden="true" />
                  </button>
                </div>

                <div className="sll-history-export-body">
                  <h3>Exportar Listagem</h3>
                  <p>Qual é o Formato que pretende Exportar?</p>

                  <div className="sll-history-export-options">
                    <ExportFormatOption
                      label="Excel (.xlsx)"
                      value="excel"
                      selected={selectedExportFormat === 'excel'}
                      onClick={() => setSelectedExportFormat('excel')}
                    />
                    <ExportFormatOption
                      label="PDF (.pdf)"
                      value="pdf"
                      selected={selectedExportFormat === 'pdf'}
                      onClick={() => setSelectedExportFormat('pdf')}
                    />
                  </div>
                </div>

                <div className="sll-history-export-actions">
                  <button type="button" className="sll-history-export-cancel" onClick={closeExportModal}>
                    Cancelar
                  </button>
                  <button type="button" className="sll-history-export-confirm" onClick={handleExport}>
                    Exportar
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          <SLLPagination
            className="sll-history-pagination"
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            firstContent={<PaginationArrow direction="left" double />}
            previousContent={<PaginationArrow direction="left" />}
            nextContent={<PaginationArrow direction="right" />}
            lastContent={<PaginationArrow direction="right" double />}
          />
        </div>
      </main>
    </div>
  )
}

export default SLLHistoricoView
