import { useEffect, useMemo, useRef, useState } from 'react'
import { FaFilter, FaTimes, FaUpload } from 'react-icons/fa'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import SLLSidebar from '../../components/SLLSidebar'
import SLLPagination from '../../components/SLLPagination'
import SLLTopbar from '../../components/SLLTopbar'
import './SLL-minha-equipa.css'

import { getRanking } from '../../../controllers/gestaoController'


function getProgressTone(progress) {
  if (progress >= 70) return 'green'
  if (progress >= 40) return 'yellow'
  return 'red'
}

function mapMember(consultor, index) {
  return {
    rank: `${index + 1}º`,
    name: consultor.nome,
    area: consultor.area,
    badges: consultor.badges_obtidos,
    points: consultor.total_pontos,
    progress: consultor.progresso_area,
    tone: getProgressTone(consultor.progresso_area),
  }
}

function TeamProgressBar({ value, tone }) {
  return (
    <div className="sll-team-progress" aria-hidden="true">
      <div className="sll-team-progress-track-wrap">
        <span className={`sll-team-progress-fill is-${tone}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function getRankClass(rank) {
  const numericRank = Number.parseInt(rank, 10)
  if (numericRank === 1) return 'is-gold'
  if (numericRank === 2) return 'is-silver'
  if (numericRank === 3) return 'is-bronze'
  return 'is-default'
}

function ExportFormatOption({ label, selected, onClick }) {
  return (
    <button type="button" className="sll-team-export-option" onClick={onClick} aria-pressed={selected}>
      <span className={`sll-team-export-option-toggle${selected ? ' is-selected' : ''}`} aria-hidden="true">
        {selected ? <span className="sll-team-export-option-dot" /> : null}
      </span>
      <span>{label}</span>
    </button>
  )
}

function SLLMinhaEquipaView() {
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showFilter, setShowFilter] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedExportFormat, setSelectedExportFormat] = useState('excel')
  const [draftFilters, setDraftFilters] = useState({ area: '' })
  const [appliedFilters, setAppliedFilters] = useState({ area: '' })

  const filterRef = useRef(null)

  useEffect(() => {
    getRanking()
      .then((data) => setTeamMembers(data.map(mapMember)))
      .catch(() => setError('Erro ao carregar a equipa. Tente novamente.'))
      .finally(() => setLoading(false))
  }, [])

  const filterOptions = useMemo(() => ({
    areas: Array.from(new Set(teamMembers.map((m) => m.area))),
  }), [teamMembers])

  const filteredMembers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()
    return teamMembers.filter((member) => {
      const matchesSearch = !normalizedSearch ||
        [member.rank, member.name, member.area, String(member.badges), String(member.points), String(member.progress)]
          .join(' ').toLowerCase().includes(normalizedSearch)
      const matchesArea = !appliedFilters.area || member.area === appliedFilters.area
      return matchesSearch && matchesArea
    })
  }, [teamMembers, searchTerm, appliedFilters.area])

  const membersPerPage = 6
  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / membersPerPage))

  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * membersPerPage
    return filteredMembers.slice(startIndex, startIndex + membersPerPage)
  }, [currentPage, filteredMembers])

  useEffect(() => { setCurrentPage(1) }, [appliedFilters.area, searchTerm])

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages))
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
    if (showFilter) setDraftFilters(appliedFilters)
  }, [showFilter, appliedFilters])

  function updateDraftFilter(field, value) {
    setDraftFilters((prev) => ({ ...prev, [field]: value }))
  }

  function applyFilters() {
    setAppliedFilters(draftFilters)
    setShowFilter(false)
  }

  function closeExportModal() { setShowExport(false) }

  function handleExport() {
    if (selectedExportFormat === 'pdf') {
      const documentPdf = new jsPDF({ orientation: 'landscape' })
      documentPdf.setFontSize(16)
      documentPdf.text('A minha equipa', 14, 16)
      autoTable(documentPdf, {
        startY: 24,
        head: [['Ranking', 'Nome', 'Área', 'Badges', 'Pontos', 'Progresso']],
        body: filteredMembers.map((m) => [m.rank, m.name, m.area, m.badges, m.points, `${m.progress}%`]),
        styles: { fontSize: 10 },
      })
      documentPdf.save('minha-equipa.pdf')
      closeExportModal()
      return
    }

    const headers = ['Ranking', 'Nome', 'Área', 'Badges', 'Pontos', 'Progresso']
    const rows = filteredMembers.map((m) => [m.rank, m.name, m.area, m.badges, m.points, `${m.progress}%`])
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows])
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Equipa')
    XLSX.writeFile(workbook, 'minha-equipa.xlsx')
    closeExportModal()
  }

  if (loading) {
    return (
      <div className="sll-team-page">
        <main className="sll-team-main">
          <div className="sll-team-content"><p>A carregar...</p></div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="sll-team-page">
        <main className="sll-team-main">
          <div className="sll-team-content"><p>{error}</p></div>
        </main>
      </div>
    )
  }

  return (
    <div className="sll-team-page">
      <main className="sll-team-main">
        <div className="sll-team-content">
          <section className="sll-team-hero" aria-label="A minha equipa">
            <div className="sll-team-hero-copy">
              <h1>A minha equipa</h1>
              <p>Consulta aqui a informação sobre todos os consultores da tua equipa</p>
            </div>
          </section>

          <section className="sll-team-toolbar" aria-label="Ações da equipa">
            <label className="sll-team-search">
              <span className="sll-team-search-icon" aria-hidden="true">⌕</span>
              <input
                type="text"
                placeholder="Pesquisar por nome do consultor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </label>

            <div className="sll-team-toolbar-actions">
              <button type="button" className="sll-team-export-btn" onClick={() => setShowExport(true)}>
                <FaUpload aria-hidden="true" />
                <span>Exportar</span>
              </button>

              <div className="sll-team-filter-popover-wrap" ref={filterRef}>
                <button
                  type="button"
                  className="sll-team-filter-btn"
                  onClick={() => setShowFilter((prev) => !prev)}
                  aria-expanded={showFilter}
                  aria-haspopup="dialog"
                >
                  <FaFilter aria-hidden="true" />
                  <span>Filtro</span>
                </button>

                {showFilter && (
                  <div className="sll-team-filter-popover" role="dialog" aria-label="Filtro da equipa">
                    <div className="sll-team-filter-field">
                      <label>Área</label>
                      <div className="sll-team-filter-select-wrap">
                        <select value={draftFilters.area} onChange={(e) => updateDraftFilter('area', e.target.value)}>
                          <option value="">Todas as áreas</option>
                          {filterOptions.areas.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button type="button" className="sll-team-filter-apply" onClick={applyFilters}>
                      Filtrar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="sll-team-table-card" aria-label="Lista de consultores da Service Line">
            <h2>Lista de consultores da Service Line</h2>

            <div className="sll-team-table-wrap">
              <table className="sll-team-table">
                <thead>
                  <tr>
                    <th>Ranking</th>
                    <th>Nome</th>
                    <th>Área</th>
                    <th>Badges</th>
                    <th>Pontos</th>
                    <th>Progresso</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedMembers.map((member) => (
                    <tr key={`${member.rank}-${member.name}`}>
                      <td className={`sll-team-rank ${getRankClass(member.rank)}`}>{member.rank}</td>
                      <td className="sll-team-name">{member.name}</td>
                      <td>{member.area}</td>
                      <td>{member.badges}</td>
                      <td>{member.points}</td>
                      <td>
                        <TeamProgressBar value={member.progress} tone={member.tone} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <SLLPagination
              className="sll-team-pagination"
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              firstContent="«"
              previousContent="‹"
              nextContent="›"
              lastContent="»"
            />
          </section>

          {showExport && (
            <div className="sll-team-export-backdrop" role="presentation" onClick={closeExportModal}>
              <div className="sll-team-export-modal" role="dialog" aria-modal="true" aria-label="Alerta Exportar" onClick={(e) => e.stopPropagation()}>
                <div className="sll-team-export-header">
                  <h2>Alerta</h2>
                  <button type="button" className="sll-team-export-close" onClick={closeExportModal} aria-label="Fechar">
                    <FaTimes aria-hidden="true" />
                  </button>
                </div>

                <div className="sll-team-export-body">
                  <h3>Exportar Listagem</h3>
                  <p>Qual é o Formato que pretende Exportar?</p>

                  <div className="sll-team-export-options">
                    <ExportFormatOption
                      label="Excel (.xlsx)"
                      selected={selectedExportFormat === 'excel'}
                      onClick={() => setSelectedExportFormat('excel')}
                    />
                    <ExportFormatOption
                      label="PDF (.pdf)"
                      selected={selectedExportFormat === 'pdf'}
                      onClick={() => setSelectedExportFormat('pdf')}
                    />
                  </div>
                </div>

                <div className="sll-team-export-actions">
                  <button type="button" className="sll-team-export-cancel" onClick={closeExportModal}>Cancelar</button>
                  <button type="button" className="sll-team-export-confirm" onClick={handleExport}>Exportar</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default SLLMinhaEquipaView