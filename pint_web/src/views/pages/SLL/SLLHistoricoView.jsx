import { useEffect, useMemo, useRef, useState } from 'react'
import { FaFilter, FaSearch, FaTimes, FaUpload } from 'react-icons/fa'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import SLLSidebar from '../../components/SLLSidebar'
import SLLPagination from '../../components/SLLPagination'
import SLLTopbar from '../../components/SLLTopbar'
import './SLL-historico.css'

const heroCircle1 = 'https://www.figma.com/api/mcp/asset/d52bcef6-8633-4aef-a46d-620628b11422'
const heroCircle2 = 'https://www.figma.com/api/mcp/asset/015d6486-d269-4542-b2af-cbffe841b87a'
const heroCircle3 = 'https://www.figma.com/api/mcp/asset/a95d40bd-58a1-4651-b2be-51b95d3ff5d3'
const heroCircle4 = 'https://www.figma.com/api/mcp/asset/c31d8d2e-032c-42c1-90ad-576563f8c6c7'
const heroCircle5 = 'https://www.figma.com/api/mcp/asset/83a3d8e4-0fed-4f71-a3dc-985cb88a65cc'
const requestAvatar = 'https://www.figma.com/api/mcp/asset/cf64d835-06cf-435b-8bfd-8b387bf43fa7'
const statusIcon = 'https://www.figma.com/api/mcp/asset/50899ec1-1a34-4798-a970-e0d95a6b293d'
const arrowLeft = 'https://www.figma.com/api/mcp/asset/7315348a-d9ea-4bf2-b35d-9f82401ef90d'
const arrowDown = 'https://www.figma.com/api/mcp/asset/0b7d86ac-4082-4a48-b7b4-c5180e2aea0a'
const arrowRight = 'https://www.figma.com/api/mcp/asset/0559697f-9730-4978-b1a5-9ef225585149'

function getStatusClass(status) {
  return status.toLowerCase().replaceAll(' ', '-')
}

const filterOptions = {
  areas: ['Tecnologia', 'Consultoria', 'Operações'],
  serviceLines: ['Advisory', 'Delivery', 'Managed Services'],
  learningPaths: ['Agile Leadership', 'Cloud Fundamentals', 'Data Strategy'],
}

const historyRequests = [
  {
    title: 'Agile Leadership - Júnior',
    consultant: 'Pedro Costa',
    approvedAt: 'Aprovado em 22 Nov 2024',
    status: 'Aprovado',
    approvedDate: '2024-11-22',
    area: 'Consultoria',
    serviceLine: 'Advisory',
    learningPath: 'Agile Leadership',
  },
  {
    title: 'Leadership Essentials - Pleno',
    consultant: 'Inês Rocha',
    approvedAt: 'Aprovado em 10 Nov 2024',
    status: 'Aprovado',
    approvedDate: '2024-11-10',
    area: 'Consultoria',
    serviceLine: 'Advisory',
    learningPath: 'Agile Leadership',
  },
  {
    title: 'Operations Coaching - Sénior',
    consultant: 'Tiago Mendes',
    approvedAt: 'Aprovado em 01 Out 2024',
    status: 'Aprovado',
    approvedDate: '2024-10-01',
    area: 'Operações',
    serviceLine: 'Managed Services',
    learningPath: 'Data Strategy',
  },
  {
    title: 'Cloud Fundamentals - Intermédio',
    consultant: 'Ana Martins',
    approvedAt: 'Rejeitado em 14 Out 2024',
    status: 'Rejeitado',
    approvedDate: '2024-10-14',
    area: 'Tecnologia',
    serviceLine: 'Delivery',
    learningPath: 'Cloud Fundamentals',
  },
  {
    title: 'Cyber Security - Sénior',
    consultant: 'Carla Gomes',
    approvedAt: 'Rejeitado em 05 Nov 2024',
    status: 'Rejeitado',
    approvedDate: '2024-11-05',
    area: 'Tecnologia',
    serviceLine: 'Delivery',
    learningPath: 'Cloud Fundamentals',
  },
  {
    title: 'Architecture Review - Júnior',
    consultant: 'Bruno Pinto',
    approvedAt: 'Rejeitado em 19 Dez 2024',
    status: 'Rejeitado',
    approvedDate: '2024-12-19',
    area: 'Consultoria',
    serviceLine: 'Advisory',
    learningPath: 'Agile Leadership',
  },
  {
    title: 'Data Strategy - Sénior',
    consultant: 'Rui Silva',
    approvedAt: 'Em progresso desde 03 Dez 2024',
    status: 'Em progresso',
    approvedDate: '2024-12-03',
    area: 'Operações',
    serviceLine: 'Managed Services',
    learningPath: 'Data Strategy',
  },
  {
    title: 'Digital Transformation - Pleno',
    consultant: 'Marta Lopes',
    approvedAt: 'Em progresso desde 11 Nov 2024',
    status: 'Em progresso',
    approvedDate: '2024-11-11',
    area: 'Consultoria',
    serviceLine: 'Advisory',
    learningPath: 'Agile Leadership',
  },
  {
    title: 'Data Governance - Sénior',
    consultant: 'Nuno Costa',
    approvedAt: 'Em progresso desde 27 Dez 2024',
    status: 'Em progresso',
    approvedDate: '2024-12-27',
    area: 'Operações',
    serviceLine: 'Managed Services',
    learningPath: 'Data Strategy',
  },
]

function HistoryBadge({ status }) {
  return <span className={`sll-history-status-badge is-${getStatusClass(status)}`}>{status}</span>
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

function buildHistorySteps(request) {
  if (request.status === 'Em progresso') {
    return [
      {
        responsible: 'António Portugal / Talent Manager',
        state: 'Em Andamento',
        stateClass: 'is-progress',
        icon: <HistoryClockIcon />,
        date: '2023/06/23',
      },
    ]
  }

  if (request.status === 'Rejeitado') {
    return [
      {
        responsible: 'António Portugal / Talent Manager',
        state: 'Em Andamento',
        stateClass: 'is-progress',
        icon: <HistoryClockIcon />,
        date: '2023/06/23',
      },
      {
        responsible: 'João Silva / Service Line Lider',
        state: 'Rejeitado',
        stateClass: 'is-rejected',
        icon: <HistoryRejectIcon />,
        date: '2023/06/23',
      },
    ]
  }

  return [
    {
      responsible: 'António Portugal / Talent Manager',
      state: 'Em Andamento',
      stateClass: 'is-progress',
      icon: <HistoryClockIcon />,
      date: '2023/06/23',
    },
    {
      responsible: 'João Silva / Service Line Lider',
      state: 'Concluído',
      stateClass: 'is-approved',
      icon: <HistoryCheckIcon />,
      date: '2023/06/23',
    },
  ]
}

function HistoryRequestCard({ request, isExpanded, onToggle }) {
  const steps = buildHistorySteps(request)

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
          <div className="sll-history-card-approved">
            <img src={statusIcon} alt="" aria-hidden="true" />
            <span>{request.approvedAt}</span>
          </div>
        </div>

        <div className={`sll-history-card-status is-${getStatusClass(request.status)}`}>
          <HistoryBadge status={request.status} />
          <div className="sll-history-progress">
            <span className="is-track" />
            <span className="is-fill" />
          </div>
        </div>
      </button>

      {isExpanded ? (
        <div className="sll-history-detail">
          <h4 className="sll-history-detail-title">Historico:</h4>
          <div className="sll-history-detail-table" role="table">
            <div className="sll-history-detail-row sll-history-detail-head" role="row">
              <span role="columnheader">RESPONSÁVEL/CARGO</span>
              <span role="columnheader">ESTADO</span>
              <span role="columnheader">DATA</span>
            </div>
            {steps.map((step, index) => (
              <div className="sll-history-detail-row" role="row" key={`${request.title}-${index}`}>
                <span role="cell">{step.responsible}</span>
                <span role="cell" className={`sll-history-detail-state ${step.stateClass}`}>
                  <span>{step.state}</span>
                  {step.icon}
                </span>
                <span role="cell">{step.date}</span>
              </div>
            ))}
          </div>
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

  const filterRef = useRef(null)

  const filteredRequests = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return historyRequests.filter((request) => {
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
            <div className="sll-history-hero-art" aria-hidden="true">
              <img className="sll-history-hero-circle sll-history-hero-circle-5" src={heroCircle5} alt="" />
              <img className="sll-history-hero-circle sll-history-hero-circle-4" src={heroCircle4} alt="" />
              <img className="sll-history-hero-circle sll-history-hero-circle-3" src={heroCircle3} alt="" />
              <img className="sll-history-hero-circle sll-history-hero-circle-2" src={heroCircle2} alt="" />
              <img className="sll-history-hero-circle sll-history-hero-circle-1" src={heroCircle1} alt="" />
            </div>

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
            {paginatedRequests.map((request) => {
              const key = `${request.title}-${request.consultant}`

              return (
                <HistoryRequestCard
                  key={key}
                  request={request}
                  isExpanded={expandedKey === key}
                  onToggle={() => setExpandedKey((current) => (current === key ? null : key))}
                />
              )
            })}
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
            firstContent={<img src={arrowLeft} alt="" aria-hidden="true" />}
            previousContent={<img src={arrowDown} alt="" aria-hidden="true" />}
            nextContent={<img src={arrowDown} alt="" aria-hidden="true" />}
            lastContent={<img src={arrowRight} alt="" aria-hidden="true" />}
          />
        </div>
      </main>
    </div>
  )
}

export default SLLHistoricoView
