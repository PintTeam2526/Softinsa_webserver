import { useEffect, useRef, useState } from 'react'
import { FaFilter, FaInfoCircle, FaSearch, FaTimes, FaUpload } from 'react-icons/fa'
import SLLSidebar from '../../components/SLLSidebar'
import SLLTopbar from '../../components/SLLTopbar'
import './SLL-historico.css'

const heroCircle1 = 'https://www.figma.com/api/mcp/asset/288fce76-e128-4294-99a0-2da910fa598e'
const heroCircle2 = 'https://www.figma.com/api/mcp/asset/72189645-88a7-49c5-9d57-6e68bd098b5b'
const heroCircle3 = 'https://www.figma.com/api/mcp/asset/cdd091b5-b5e5-4ef4-8207-d871d25984d9'
const heroCircle4 = 'https://www.figma.com/api/mcp/asset/95830a8c-9cec-42b8-9e1c-40587c2a28eb'
const heroCircle5 = 'https://www.figma.com/api/mcp/asset/5736997c-a9f9-48f5-b679-0a4d5b6a8abc'
const requestAvatar = 'https://www.figma.com/api/mcp/asset/cf64d835-06cf-435b-8bfd-8b387bf43fa7'
const statusIcon = 'https://www.figma.com/api/mcp/asset/50899ec1-1a34-4798-a970-e0d95a6b293d'
const arrowLeft = 'https://www.figma.com/api/mcp/asset/7315348a-d9ea-4bf2-b35d-9f82401ef90d'
const arrowDown = 'https://www.figma.com/api/mcp/asset/0b7d86ac-4082-4a48-b7b4-c5180e2aea0a'
const arrowRight = 'https://www.figma.com/api/mcp/asset/0559697f-9730-4978-b1a5-9ef225585149'

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
    title: 'Cloud Fundamentals - Intermédio',
    consultant: 'Ana Martins',
    approvedAt: 'Aprovado em 14 Out 2024',
    status: 'Aprovado',
    approvedDate: '2024-10-14',
    area: 'Tecnologia',
    serviceLine: 'Delivery',
    learningPath: 'Cloud Fundamentals',
  },
  {
    title: 'Data Strategy - Sénior',
    consultant: 'Rui Silva',
    approvedAt: 'Aprovado em 03 Dez 2024',
    status: 'Aprovado',
    approvedDate: '2024-12-03',
    area: 'Operações',
    serviceLine: 'Managed Services',
    learningPath: 'Data Strategy',
  },
]

function HistoryBadge({ status }) {
  return <span className={`sll-history-status-badge is-${status.toLowerCase()}`}>{status}</span>
}

function HistoryRequestCard({ request }) {
  return (
    <article className="sll-history-card">
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

      <div className="sll-history-card-status">
        <HistoryBadge status={request.status} />
        <div className="sll-history-progress">
          <span className="is-track" />
          <span className="is-fill" />
        </div>
      </div>
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
  const [filteredRequests, setFilteredRequests] = useState(historyRequests)
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

  useEffect(() => {
    const out = historyRequests.filter((request) => {
      const matchesDateFrom = !appliedFilters.dateFrom || request.approvedDate >= appliedFilters.dateFrom
      const matchesDateTo = !appliedFilters.dateTo || request.approvedDate <= appliedFilters.dateTo
      const matchesArea = !appliedFilters.area || request.area === appliedFilters.area
      const matchesServiceLine = !appliedFilters.serviceLine || request.serviceLine === appliedFilters.serviceLine
      const matchesLearningPath = !appliedFilters.learningPath || request.learningPath === appliedFilters.learningPath

      return matchesDateFrom && matchesDateTo && matchesArea && matchesServiceLine && matchesLearningPath
    })

    setFilteredRequests(out)
  }, [appliedFilters])

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
    const rows = filteredRequests.map((r) => ({ title: r.title, consultant: r.consultant, status: r.status, approvedAt: r.approvedAt }))
    const headers = ['title', 'consultant', 'status', 'approvedAt']
    const csv = [headers.join(',')].concat(rows.map((r) => headers.map((h) => `"${(r[h]||'').replace(/"/g,'""')}"`).join(','))).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = selectedExportFormat === 'pdf' ? 'historico_export.pdf' : 'historico_export.xlsx'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
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
              <button type="button" className="is-active">Aprovados</button>
              <button type="button">Rejeitados</button>
              <button type="button">Em progresso</button>
              <button type="button" className="sll-history-info-btn" aria-label="Mais informação">
                <FaInfoCircle aria-hidden="true" />
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
              <input type="text" placeholder="Pesquisar por nome do consultor ou badge..." />
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
            {filteredRequests.map((request) => (
              <HistoryRequestCard key={`${request.title}-${request.consultant}`} request={request} />
            ))}
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

          <div className="sll-history-pagination" aria-label="Paginação">
            <button type="button">
              <img src={arrowLeft} alt="" aria-hidden="true" />
            </button>
            <button type="button">
              <img src={arrowDown} alt="" aria-hidden="true" />
            </button>
            <button type="button" className="is-active">1</button>
            <button type="button">2</button>
            <button type="button">3</button>
            <button type="button">
              <img src={arrowDown} alt="" aria-hidden="true" />
            </button>
            <button type="button">
              <img src={arrowRight} alt="" aria-hidden="true" />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SLLHistoricoView
