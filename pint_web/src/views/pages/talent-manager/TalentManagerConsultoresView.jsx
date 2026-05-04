import { useEffect, useMemo, useRef, useState } from 'react'
import { FaTimes, FaUpload } from 'react-icons/fa'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import './TalentManagerConsultoresView.css'

const heroCircle1 = 'https://www.figma.com/api/mcp/asset/339fc7a8-ef40-41aa-8c54-3476bec2dcaf'
const heroCircle2 = 'https://www.figma.com/api/mcp/asset/c588a3a9-3a76-47a2-ade6-19caa82a126e'
const heroCircle3 = 'https://www.figma.com/api/mcp/asset/123ab2b1-3a8f-477c-b33f-8850bcc74e90'
const heroCircle4 = 'https://www.figma.com/api/mcp/asset/9f840511-0d20-4221-a7e1-fc730932100f'
const heroCircle5 = 'https://www.figma.com/api/mcp/asset/da377474-e3d5-46bc-8c1b-8ff2c8c59ed9'

const consultantRows = [
  { name: 'João Silva', badges: 34, points: 520, ranking: '1º', learningPath: 'Agile Leadership', serviceLine: 'Advisory', area: 'Consultoria', registrationDate: '2024-12-04' },
  { name: 'Ana Matos', badges: 37, points: 500, ranking: '2º', learningPath: 'Cloud Fundamentals', serviceLine: 'Delivery', area: 'Tecnologia', registrationDate: '2024-09-15' },
  { name: 'Miguel Cardoso', badges: 25, points: 456, ranking: '3º', learningPath: 'Data Strategy', serviceLine: 'Managed Services', area: 'Operações', registrationDate: '2024-10-01' },
  { name: 'Antonio Silva', badges: 15, points: 276, ranking: '4º', learningPath: 'Agile Leadership', serviceLine: 'Advisory', area: 'Consultoria', registrationDate: '2024-11-20' },
  { name: 'Guilherme Santos', badges: 7, points: 120, ranking: '5º', learningPath: 'Cloud Fundamentals', serviceLine: 'Delivery', area: 'Tecnologia', registrationDate: '2024-08-08' },
  { name: 'Guilherme Santos', badges: 14, points: 100, ranking: '5º', learningPath: 'Data Strategy', serviceLine: 'Managed Services', area: 'Operações', registrationDate: '2024-07-19' },
  { name: 'Guilherme Santos', badges: 6, points: 79, ranking: '5º', learningPath: 'Agile Leadership', serviceLine: 'Advisory', area: 'Consultoria', registrationDate: '2024-06-03' },
  { name: 'Guilherme Santos', badges: 4, points: 76, ranking: '5º', learningPath: 'Cloud Fundamentals', serviceLine: 'Delivery', area: 'Tecnologia', registrationDate: '2024-05-12' },
  { name: 'Guilherme Santos', badges: 3, points: 68, ranking: '5º', learningPath: 'Data Strategy', serviceLine: 'Managed Services', area: 'Operações', registrationDate: '2024-04-21' },
  { name: 'Guilherme Santos', badges: 2, points: 40, ranking: '5º', learningPath: 'Agile Leadership', serviceLine: 'Advisory', area: 'Consultoria', registrationDate: '2024-03-14' },
  { name: 'Sofia Ribeiro', badges: 18, points: 330, ranking: '6º', learningPath: 'Cloud Fundamentals', serviceLine: 'Delivery', area: 'Tecnologia', registrationDate: '2024-11-08' },
  { name: 'Carlos Pereira', badges: 22, points: 315, ranking: '7º', learningPath: 'Data Strategy', serviceLine: 'Managed Services', area: 'Operações', registrationDate: '2024-10-23' },
  { name: 'Mariana Costa', badges: 16, points: 290, ranking: '8º', learningPath: 'Agile Leadership', serviceLine: 'Advisory', area: 'Consultoria', registrationDate: '2024-09-30' },
  { name: 'Pedro Mendes', badges: 13, points: 248, ranking: '9º', learningPath: 'Cloud Fundamentals', serviceLine: 'Delivery', area: 'Tecnologia', registrationDate: '2024-09-12' },
  { name: 'Rita Alves', badges: 11, points: 230, ranking: '10º', learningPath: 'Data Strategy', serviceLine: 'Managed Services', area: 'Operações', registrationDate: '2024-08-26' },
  { name: 'Bruno Carvalho', badges: 10, points: 212, ranking: '11º', learningPath: 'Agile Leadership', serviceLine: 'Advisory', area: 'Consultoria', registrationDate: '2024-08-14' },
  { name: 'Inês Martins', badges: 9, points: 198, ranking: '12º', learningPath: 'Cloud Fundamentals', serviceLine: 'Delivery', area: 'Tecnologia', registrationDate: '2024-07-28' },
  { name: 'Tiago Nunes', badges: 8, points: 184, ranking: '13º', learningPath: 'Data Strategy', serviceLine: 'Managed Services', area: 'Operações', registrationDate: '2024-07-06' },
  { name: 'Sara Fernandes', badges: 7, points: 170, ranking: '14º', learningPath: 'Agile Leadership', serviceLine: 'Advisory', area: 'Consultoria', registrationDate: '2024-06-18' },
  { name: 'André Moreira', badges: 5, points: 155, ranking: '15º', learningPath: 'Cloud Fundamentals', serviceLine: 'Delivery', area: 'Tecnologia', registrationDate: '2024-05-30' },
]

function AvatarBadge() {
  return (
    <span className="tm-consultores-avatar" aria-hidden="true">
      <img
        alt=""
        src="https://www.figma.com/api/mcp/asset/e6f36e3b-7e8e-42a1-83bb-3de240749085"
      />
    </span>
  )
}

function PaginationButton({ children, active = false, disabled = false, narrow = false, onClick }) {
  return (
    <button
      type="button"
      className={`tm-consultores-pagination-btn${active ? ' is-active' : ''}${disabled ? ' is-disabled' : ''}${narrow ? ' is-narrow' : ''}`}
      disabled={disabled}
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function TalentManagerConsultoresView() {
  const [showFilter, setShowFilter] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [selectedExportFormat, setSelectedExportFormat] = useState('xlsx')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [draftFilters, setDraftFilters] = useState({ dateFrom: '', dateTo: '', area: '', serviceLine: '', learningPath: '' })
  const [appliedFilters, setAppliedFilters] = useState({ dateFrom: '', dateTo: '', area: '', serviceLine: '', learningPath: '' })

  const filterRef = useRef(null)

  const filterOptions = useMemo(() => ({
    learningPaths: Array.from(new Set(consultantRows.map((consultant) => consultant.learningPath))),
    serviceLines: Array.from(new Set(consultantRows.map((consultant) => consultant.serviceLine))),
    areas: Array.from(new Set(consultantRows.map((consultant) => consultant.area))),
  }), [])

  const filteredConsultants = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return consultantRows.filter((consultant) => {
      const matchesSearch = !normalizedSearch || consultant.name.toLowerCase().includes(normalizedSearch)
      const matchesDateFrom = !appliedFilters.dateFrom || consultant.registrationDate >= appliedFilters.dateFrom
      const matchesDateTo = !appliedFilters.dateTo || consultant.registrationDate <= appliedFilters.dateTo
      const matchesArea = !appliedFilters.area || consultant.area === appliedFilters.area
      const matchesServiceLine = !appliedFilters.serviceLine || consultant.serviceLine === appliedFilters.serviceLine
      const matchesLearningPath = !appliedFilters.learningPath || consultant.learningPath === appliedFilters.learningPath

      return matchesSearch && matchesDateFrom && matchesDateTo && matchesArea && matchesServiceLine && matchesLearningPath
    })
  }, [appliedFilters.area, appliedFilters.dateFrom, appliedFilters.dateTo, appliedFilters.learningPath, appliedFilters.serviceLine, searchTerm])

  const consultantsPerPage = 10
  const totalPages = Math.max(1, Math.ceil(filteredConsultants.length / consultantsPerPage))

  const paginatedConsultants = useMemo(() => {
    const startIndex = (currentPage - 1) * consultantsPerPage
    return filteredConsultants.slice(startIndex, startIndex + consultantsPerPage)
  }, [currentPage, filteredConsultants])

  function closeExportModal() {
    setShowExport(false)
  }

  useEffect(() => {
    function onDoc(event) {
      if (showFilter && filterRef.current && !filterRef.current.contains(event.target)) {
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
    setCurrentPage(1)
  }, [searchTerm, appliedFilters.area, appliedFilters.dateFrom, appliedFilters.dateTo, appliedFilters.learningPath, appliedFilters.serviceLine])

  useEffect(() => {
    setCurrentPage((previousPage) => Math.min(previousPage, totalPages))
  }, [totalPages])

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

  function goToPage(pageNumber) {
    setCurrentPage(pageNumber)
  }

  function goToPreviousPage() {
    setCurrentPage((previousPage) => Math.max(1, previousPage - 1))
  }

  function goToNextPage() {
    setCurrentPage((previousPage) => Math.min(totalPages, previousPage + 1))
  }

  function handleExport() {
    if (selectedExportFormat === 'pdf') {
      const documentPdf = new jsPDF()
      documentPdf.setFontSize(16)
      documentPdf.text('Consultores', 14, 16)

      autoTable(documentPdf, {
        startY: 24,
        head: [['Consultor', 'Badges', 'Pontos', 'Ranking']],
        body: filteredConsultants.map((consultant) => [consultant.name, consultant.badges, consultant.points, consultant.ranking]),
        styles: { fontSize: 10 },
      })

      documentPdf.save('consultores_export.pdf')
      closeExportModal()
      return
    }

    const worksheet = XLSX.utils.json_to_sheet(filteredConsultants.map((consultant) => ({
      Consultor: consultant.name,
      Badges: consultant.badges,
      Pontos: consultant.points,
      Ranking: consultant.ranking,
      'Learning Path': consultant.learningPath,
      'Service Line': consultant.serviceLine,
      Área: consultant.area,
      'Data de registo': consultant.registrationDate,
    })))
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Consultores')
    XLSX.writeFile(workbook, 'consultores_export.xlsx')
    closeExportModal()
  }

  return (
    <div className="tm-consultores-page">
      <section className="tm-consultores-hero" aria-label="Consultores">
        <div className="tm-consultores-hero-art" aria-hidden="true">
          <img className="tm-consultores-hero-circle tm-consultores-hero-circle-5" src={heroCircle5} alt="" />
          <img className="tm-consultores-hero-circle tm-consultores-hero-circle-4" src={heroCircle4} alt="" />
          <img className="tm-consultores-hero-circle tm-consultores-hero-circle-3" src={heroCircle3} alt="" />
          <img className="tm-consultores-hero-circle tm-consultores-hero-circle-2" src={heroCircle2} alt="" />
          <img className="tm-consultores-hero-circle tm-consultores-hero-circle-1" src={heroCircle1} alt="" />
        </div>

        <div className="tm-consultores-hero-copy">
          <h1>Consultores</h1>
          <p>Consulta aqui informação detalhada sobre todos os consultores</p>
        </div>
      </section>

      <section className="tm-consultores-toolbar" aria-label="Ferramentas de consultores">
        <div className="tm-consultores-search">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" />
            <path d="M21 21L16.65 16.65" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Pesquisar por nome do consultor"
            aria-label="Pesquisar por nome do consultor"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="tm-consultores-actions">
          <button type="button" className="tm-consultores-export-btn" onClick={() => setShowExport(true)}>
            <FaUpload aria-hidden="true" />
            <span>Exportar</span>
          </button>

          <div className="tm-consultores-filter-popover-wrap" ref={filterRef}>
            <button type="button" className="tm-consultores-filter-btn" onClick={() => setShowFilter((previousValue) => !previousValue)} aria-expanded={showFilter}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 5H20L14 12V18L10 20V12L4 5Z" />
              </svg>
              <span>Filtro</span>
            </button>

            {showFilter ? (
              <div className="tm-consultores-filter-popover">
                <div className="tm-consultores-filter-field">
                  <label htmlFor="consultor-filter-learning-path">Learning Path</label>
                  <div className="tm-consultores-filter-select-wrap">
                    <select id="consultor-filter-learning-path" value={draftFilters.learningPath} onChange={(event) => updateDraftFilter('learningPath', event.target.value)}>
                      <option value="">Selecione a Learning Path</option>
                      {filterOptions.learningPaths.map((learningPath) => (
                        <option key={learningPath} value={learningPath}>
                          {learningPath}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="tm-consultores-filter-field">
                  <label htmlFor="consultor-filter-service-line">Service Line</label>
                  <div className="tm-consultores-filter-select-wrap">
                    <select id="consultor-filter-service-line" value={draftFilters.serviceLine} onChange={(event) => updateDraftFilter('serviceLine', event.target.value)}>
                      <option value="">Selecione a Service Line</option>
                      {filterOptions.serviceLines.map((serviceLine) => (
                        <option key={serviceLine} value={serviceLine}>
                          {serviceLine}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="tm-consultores-filter-field">
                  <label htmlFor="consultor-filter-area">Área</label>
                  <div className="tm-consultores-filter-select-wrap">
                    <select id="consultor-filter-area" value={draftFilters.area} onChange={(event) => updateDraftFilter('area', event.target.value)}>
                      <option value="">Selecione a Área</option>
                      {filterOptions.areas.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="tm-consultores-filter-field">
                  <label>Data de registo</label>
                  <div className="tm-consultores-filter-date-grid">
                    <div className="tm-consultores-filter-select-wrap is-date">
                      <input type="date" value={draftFilters.dateFrom} onChange={(event) => updateDraftFilter('dateFrom', event.target.value)} aria-label="Data de registo inicial" />
                    </div>
                    <div className="tm-consultores-filter-date-separator">até</div>
                    <div className="tm-consultores-filter-select-wrap is-date">
                      <input type="date" value={draftFilters.dateTo} onChange={(event) => updateDraftFilter('dateTo', event.target.value)} aria-label="Data de registo final" />
                    </div>
                  </div>
                </div>

                <button type="button" className="tm-consultores-filter-apply" onClick={applyFilters}>
                  Filtrar
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {showExport ? (
        <div className="tm-consultores-export-backdrop" role="presentation" onClick={closeExportModal}>
          <div className="tm-consultores-export-modal" role="dialog" aria-modal="true" aria-label="Exportar consultores" onClick={(event) => event.stopPropagation()}>
            <div className="tm-consultores-export-header">
              <h2>Exportar</h2>
              <button type="button" className="tm-consultores-export-close" onClick={closeExportModal} aria-label="Fechar exportação">
                <FaTimes aria-hidden="true" />
              </button>
            </div>

            <div className="tm-consultores-export-body">
              <h3>Formato de exportação</h3>
              <p>Escolha o formato que pretende descarregar.</p>

              <div className="tm-consultores-export-options">
                <button type="button" className="tm-consultores-export-option" onClick={() => setSelectedExportFormat('xlsx')} aria-pressed={selectedExportFormat === 'xlsx'}>
                  <span className={`tm-consultores-export-option-toggle${selectedExportFormat === 'xlsx' ? ' is-selected' : ''}`} aria-hidden="true">
                    {selectedExportFormat === 'xlsx' ? <span className="tm-consultores-export-option-dot" /> : null}
                  </span>
                  <span>Excel (.xlsx)</span>
                </button>
                <button type="button" className="tm-consultores-export-option" onClick={() => setSelectedExportFormat('pdf')} aria-pressed={selectedExportFormat === 'pdf'}>
                  <span className={`tm-consultores-export-option-toggle${selectedExportFormat === 'pdf' ? ' is-selected' : ''}`} aria-hidden="true">
                    {selectedExportFormat === 'pdf' ? <span className="tm-consultores-export-option-dot" /> : null}
                  </span>
                  <span>PDF (.pdf)</span>
                </button>
              </div>
            </div>

            <div className="tm-consultores-export-actions">
              <button type="button" className="tm-consultores-export-cancel" onClick={closeExportModal}>
                Cancelar
              </button>
              <button type="button" className="tm-consultores-export-confirm" onClick={handleExport}>
                Exportar
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <section className="tm-consultores-table-card" aria-label="Lista de consultores">
        <div className="tm-consultores-table-wrap">
          <table className="tm-consultores-table">
            <thead>
              <tr>
                <th>Consultor</th>
                <th>Badges</th>
                <th>Pontos</th>
                <th>Ranking</th>
              </tr>
            </thead>
            <tbody>
              {paginatedConsultants.map((consultant) => (
                <tr key={`${consultant.name}-${consultant.badges}-${consultant.points}-${consultant.ranking}`}>
                  <td>
                    <div className="tm-consultores-name-cell">
                      <AvatarBadge />
                      <span>{consultant.name}</span>
                    </div>
                  </td>
                  <td>{consultant.badges}</td>
                  <td>
                    <span className="tm-consultores-points">
                      {consultant.points}
                      <span className="tm-consultores-point-dot" aria-hidden="true" />
                    </span>
                  </td>
                  <td>{consultant.ranking}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="tm-consultores-pagination" aria-label="Paginação">
          <PaginationButton narrow onClick={goToPreviousPage} disabled={currentPage === 1}>{'«'}</PaginationButton>
          <PaginationButton narrow onClick={goToPreviousPage} disabled={currentPage === 1}>{'‹'}</PaginationButton>
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1
            return (
              <PaginationButton key={pageNumber} active={pageNumber === currentPage} onClick={() => goToPage(pageNumber)}>
                {pageNumber}
              </PaginationButton>
            )
          })}
          <PaginationButton narrow onClick={goToNextPage} disabled={currentPage === totalPages}>{'›'}</PaginationButton>
          <PaginationButton narrow onClick={goToNextPage} disabled={currentPage === totalPages}>{'»'}</PaginationButton>
        </div>
      </section>
    </div>
  )
}

export default TalentManagerConsultoresView