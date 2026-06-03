import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaTimes } from 'react-icons/fa'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import './TalentManagerConsultoresView.css'

import { getRanking } from '../../../controllers/gestaoController'


function ExportIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="16" height="16" aria-hidden="true" style={{ strokeWidth: 2, stroke: 'currentColor' }}>
      <path d="M19 14v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="17 10 12 5 7 10" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="5" x2="12" y2="16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function getRankingTone(ranking) {
  if (ranking === '1º') return 'is-gold'
  if (ranking === '2º') return 'is-silver'
  if (ranking === '3º') return 'is-bronze'
  return ''
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

function mapConsultor(consultor, index) {
  console.log('consultor raw:', consultor)
  return {
    id: consultor.id_consultor,
    name: consultor.nome,
    area: consultor.area,
    points: consultor.total_pontos,
    badges: consultor.badges_obtidos,
    progresso: consultor.progresso_area,
    ranking: `${index + 1}º`,
  }
}

function TalentManagerConsultoresView() {
  const navigate = useNavigate()

  const [consultantRows, setConsultantRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showFilter, setShowFilter] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [selectedExportFormat, setSelectedExportFormat] = useState('xlsx')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [draftFilters, setDraftFilters] = useState({ area: '' })
  const [appliedFilters, setAppliedFilters] = useState({ area: '' })

  const filterRef = useRef(null)

  useEffect(() => {
    getRanking()
      .then((data) => setConsultantRows(data.map(mapConsultor)))
      .catch(() => setError('Erro ao carregar o ranking. Tente novamente.'))
      .finally(() => setLoading(false))
  }, [])

  const filterOptions = useMemo(() => ({
    areas: Array.from(new Set(consultantRows.map((c) => c.area))),
  }), [consultantRows])

  const filteredConsultants = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()
    return consultantRows.filter((consultant) => {
      const matchesSearch = !normalizedSearch || consultant.name.toLowerCase().includes(normalizedSearch)
      const matchesArea = !appliedFilters.area || consultant.area === appliedFilters.area
      return matchesSearch && matchesArea
    })
  }, [consultantRows, searchTerm, appliedFilters.area])

  const consultantsPerPage = 10
  const totalPages = Math.max(1, Math.ceil(filteredConsultants.length / consultantsPerPage))

  const paginatedConsultants = useMemo(() => {
    const startIndex = (currentPage - 1) * consultantsPerPage
    return filteredConsultants.slice(startIndex, startIndex + consultantsPerPage)
  }, [currentPage, filteredConsultants])

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
    if (showFilter) setDraftFilters(appliedFilters)
  }, [showFilter, appliedFilters])

  useEffect(() => { setCurrentPage(1) }, [searchTerm, appliedFilters.area])

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages))
  }, [totalPages])

  function updateDraftFilter(field, value) {
    setDraftFilters((prev) => ({ ...prev, [field]: value }))
  }

  function applyFilters() {
    setAppliedFilters(draftFilters)
    setShowFilter(false)
  }

  function goToPage(pageNumber) { setCurrentPage(pageNumber) }
  function goToPreviousPage() { setCurrentPage((prev) => Math.max(1, prev - 1)) }
  function goToNextPage() { setCurrentPage((prev) => Math.min(totalPages, prev + 1)) }
  function closeExportModal() { setShowExport(false) }

  // Navega para o perfil público do consultor selecionado
  function handleRowClick(consultant) {
    navigate(`/talent-manager/perfil-publico/${consultant.id}`)
  }

  function handleExport() {
    if (selectedExportFormat === 'pdf') {
      const documentPdf = new jsPDF()
      documentPdf.setFontSize(16)
      documentPdf.text('Consultores', 14, 16)
      autoTable(documentPdf, {
        startY: 24,
        head: [['Ranking', 'Consultor', 'Área', 'Badges', 'Pontos', 'Progresso na Área']],
        body: filteredConsultants.map((c) => [c.ranking, c.name, c.area, c.badges, c.points, `${c.progresso}%`]),
        styles: { fontSize: 10 },
      })
      documentPdf.save('consultores_export.pdf')
      closeExportModal()
      return
    }

    const worksheet = XLSX.utils.json_to_sheet(filteredConsultants.map((c) => ({
      Ranking: c.ranking,
      Consultor: c.name,
      Área: c.area,
      Badges: c.badges,
      Pontos: c.points,
      'Progresso na Área (%)': c.progresso,
    })))
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Consultores')
    XLSX.writeFile(workbook, 'consultores_export.xlsx')
    closeExportModal()
  }

  if (loading) return <div className="tm-consultores-page"><p>A carregar...</p></div>
  if (error) return <div className="tm-consultores-page"><p>{error}</p></div>

  return (
    <div className="tm-consultores-page">
      <section className="tm-consultores-hero" aria-label="Consultores">
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
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="tm-consultores-actions">
          <button type="button" className="tm-consultores-export-btn" onClick={() => setShowExport(true)}>
            <ExportIcon />
            <span>Exportar</span>
          </button>

          <div className="tm-consultores-filter-popover-wrap" ref={filterRef}>
            <button
              type="button"
              className="tm-consultores-filter-btn"
              onClick={() => setShowFilter((prev) => !prev)}
              aria-expanded={showFilter}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 5H20L14 12V18L10 20V12L4 5Z" />
              </svg>
              <span>Filtro</span>
            </button>

            {showFilter && (
              <div className="tm-consultores-filter-popover">
                <div className="tm-consultores-filter-field">
                  <label htmlFor="consultor-filter-area">Área</label>
                  <div className="tm-consultores-filter-select-wrap">
                    <select
                      id="consultor-filter-area"
                      value={draftFilters.area}
                      onChange={(e) => updateDraftFilter('area', e.target.value)}
                    >
                      <option value="">Todas as áreas</option>
                      {filterOptions.areas.map((area) => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button type="button" className="tm-consultores-filter-apply" onClick={applyFilters}>
                  Filtrar
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {showExport && (
        <div className="tm-consultores-export-backdrop" role="presentation" onClick={closeExportModal}>
          <div className="tm-consultores-export-modal" role="dialog" aria-modal="true" aria-label="Exportar consultores" onClick={(e) => e.stopPropagation()}>
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
                    {selectedExportFormat === 'xlsx' && <span className="tm-consultores-export-option-dot" />}
                  </span>
                  <span>Excel (.xlsx)</span>
                </button>
                <button type="button" className="tm-consultores-export-option" onClick={() => setSelectedExportFormat('pdf')} aria-pressed={selectedExportFormat === 'pdf'}>
                  <span className={`tm-consultores-export-option-toggle${selectedExportFormat === 'pdf' ? ' is-selected' : ''}`} aria-hidden="true">
                    {selectedExportFormat === 'pdf' && <span className="tm-consultores-export-option-dot" />}
                  </span>
                  <span>PDF (.pdf)</span>
                </button>
              </div>
            </div>

            <div className="tm-consultores-export-actions">
              <button type="button" className="tm-consultores-export-cancel" onClick={closeExportModal}>Cancelar</button>
              <button type="button" className="tm-consultores-export-confirm" onClick={handleExport}>Exportar</button>
            </div>
          </div>
        </div>
      )}

      <section className="tm-consultores-table-card" aria-label="Lista de consultores">
        <div className="tm-consultores-table-wrap">
          <table className="tm-consultores-table">
            <thead>
              <tr>
                <th>Ranking</th>
                <th>Consultor</th>
                <th>Badges</th>
                <th>Pontos</th>
                <th>Progresso na Área</th>
              </tr>
            </thead>
            <tbody>
              {paginatedConsultants.map((consultant) => (
                <tr
                  key={`${consultant.name}-${consultant.ranking}`}
                  className="tm-consultores-row-clickable"
                  onClick={() => handleRowClick(consultant)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleRowClick(consultant)}
                  aria-label={`Ver perfil de ${consultant.name}`}
                >
                  <td>
                    <span className={`tm-consultores-ranking ${getRankingTone(consultant.ranking)}`}>
                      {consultant.ranking}
                    </span>
                  </td>
                  <td>
                    <div className="tm-consultores-name-cell">
                      <span>{consultant.name}</span>
                    </div>
                  </td>
                  <td>{consultant.badges}</td>
                  <td>
                    <span className="tm-consultores-points">
                      {consultant.points}
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="tm-consultores-point-icon">
                        <path d="M3.702 0.456C4.43105 0.155969 5.21163 0.00107491 6 0C6.786 0 7.566 0.156 8.298 0.456C9.024 0.756 9.684 1.2 10.242 1.758C10.8 2.316 11.244 2.976 11.544 3.702C11.844 4.434 12 5.214 12 6C12 7.59 11.37 9.12 10.242 10.242C9.68557 10.8 9.02438 11.2425 8.2964 11.5442C7.56843 11.8459 6.78802 12.0008 6 12C5.21163 11.9989 4.43105 11.844 3.702 11.544C2.97484 11.2418 2.31428 10.7994 1.758 10.242C1.20001 9.68557 0.757463 9.02437 0.45577 8.2964C0.154077 7.56842 -0.000810844 6.78801 3.1921e-06 6C3.1921e-06 4.41 0.630003 2.88 1.758 1.758C2.316 1.2 2.976 0.756 3.702 0.456ZM6 9L6.936 6.948L9 6L6.936 5.064L6 3L5.058 5.064L3 6L5.058 6.948L6 9Z" fill="#232D42" />
                      </svg>
                    </span>
                  </td>
                  <td>
                    <div className="tm-consultores-progress-wrap" title={`${consultant.progresso}%`}>
                      <div className="tm-consultores-progress-bar">
                        <div className="tm-consultores-progress-fill" style={{ width: `${consultant.progresso}%` }} />
                      </div>
                      <span className="tm-consultores-progress-label">{consultant.progresso}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

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
    </div>
  )
}

export default TalentManagerConsultoresView