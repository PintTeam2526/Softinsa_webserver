import { useEffect, useMemo, useRef, useState } from 'react'
import { FaFilter, FaTimes, FaUpload } from 'react-icons/fa'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import SLLSidebar from '../../components/SLLSidebar'
import SLLPagination from '../../components/SLLPagination'
import SLLTopbar from '../../components/SLLTopbar'
import './SLL-minha-equipa.css'

const heroCircle1 = 'https://www.figma.com/api/mcp/asset/ab6de3d1-1dec-4e65-9f70-f570146f6bfe'
const heroCircle2 = 'https://www.figma.com/api/mcp/asset/3a3993a6-61c7-4ac4-a799-e406a5adfc72'
const heroCircle3 = 'https://www.figma.com/api/mcp/asset/2e4079e6-0254-4d38-b3f4-0516979e370f'
const heroCircle4 = 'https://www.figma.com/api/mcp/asset/d7448094-dd4e-4577-bbd2-3d2c97e79027'
const heroCircle5 = 'https://www.figma.com/api/mcp/asset/af057a0a-5f36-4ba7-9024-f71677cacaa0'

const filterOptions = {
  areas: ['Outsystems', 'Data', 'Cloud'],
}

const teamMembers = [
  { rank: '1º', name: 'João Silva', area: 'Outsystems', joinedDate: '2024-12-01', badges: 25, points: 550, progress: 92, tone: 'green' },
  { rank: '2º', name: 'Daniela Almeida', area: 'Outsystems', joinedDate: '2024-11-18', badges: 21, points: 530, progress: 88, tone: 'green' },
  { rank: '3º', name: 'Vasco Ferreira', area: 'Data', joinedDate: '2024-10-29', badges: 19, points: 470, progress: 82, tone: 'green' },
  { rank: '4º', name: 'Rafael Carvalho', area: 'Cloud', joinedDate: '2024-10-03', badges: 17, points: 430, progress: 74, tone: 'yellow' },
  { rank: '5º', name: 'Vasco Lima', area: 'Outsystems', joinedDate: '2024-09-15', badges: 16, points: 410, progress: 69, tone: 'yellow' },
  { rank: '6º', name: 'Marco Alves', area: 'Data', joinedDate: '2024-08-22', badges: 14, points: 370, progress: 61, tone: 'yellow' },
  { rank: '7º', name: 'Ana Pereira', area: 'Cloud', joinedDate: '2024-07-10', badges: 7, points: 150, progress: 33, tone: 'red' },
  { rank: '8º', name: 'Miguel Lopes', area: 'Outsystems', joinedDate: '2024-06-25', badges: 6, points: 120, progress: 26, tone: 'red' },
  { rank: '9º', name: 'Pedro Almeida', area: 'Data', joinedDate: '2024-06-02', badges: 5, points: 100, progress: 22, tone: 'red' },
  { rank: '10º', name: 'Carlos Oliveira', area: 'Cloud', joinedDate: '2024-05-17', badges: 3, points: 60, progress: 14, tone: 'red' },
  { rank: '11º', name: 'Joana Santos', area: 'Outsystems', joinedDate: '2024-04-30', badges: 2, points: 30, progress: 9, tone: 'red' },
  { rank: '12º', name: 'Catarina Marques', area: 'Data', joinedDate: '2024-04-05', badges: 1, points: 20, progress: 5, tone: 'red' },
]

function TeamProgressBar({ value, tone }) {
  return (
    <div className="sll-team-progress" aria-hidden="true">
      <span className="sll-team-progress-track" />
      <span className={`sll-team-progress-fill is-${tone}`} style={{ width: `${value}%` }} />
    </div>
  )
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
  const [showFilter, setShowFilter] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedExportFormat, setSelectedExportFormat] = useState('excel')
  const [draftFilters, setDraftFilters] = useState({
    dateFrom: '',
    dateTo: '',
    area: '',
  })
  const [appliedFilters, setAppliedFilters] = useState({
    dateFrom: '',
    dateTo: '',
    area: '',
  })
  const filterRef = useRef(null)

  const filteredMembers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return teamMembers.filter((member) => {
      const matchesSearch =
        !normalizedSearch ||
        [member.rank, member.name, member.area, String(member.badges), String(member.points), String(member.progress)]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch)

      const matchesDateFrom = !appliedFilters.dateFrom || member.joinedDate >= appliedFilters.dateFrom
      const matchesDateTo = !appliedFilters.dateTo || member.joinedDate <= appliedFilters.dateTo
      const matchesArea = !appliedFilters.area || member.area === appliedFilters.area

      return matchesSearch && matchesDateFrom && matchesDateTo && matchesArea
    })
  }, [appliedFilters.area, appliedFilters.dateFrom, appliedFilters.dateTo, searchTerm])

  const membersPerPage = 6

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / membersPerPage))

  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * membersPerPage

    return filteredMembers.slice(startIndex, startIndex + membersPerPage)
  }, [currentPage, filteredMembers])

  useEffect(() => {
    setCurrentPage(1)
  }, [appliedFilters.area, appliedFilters.dateFrom, appliedFilters.dateTo, searchTerm])

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
      const documentPdf = new jsPDF({ orientation: 'landscape' })

      documentPdf.setFontSize(16)
      documentPdf.text('A minha equipa', 14, 16)

      autoTable(documentPdf, {
        startY: 24,
        head: [['Ranking', 'Nome', 'Área', 'Badges', 'Pontos', 'Progresso']],
        body: filteredMembers.map((member) => [
          member.rank,
          member.name,
          member.area,
          member.badges,
          member.points,
          `${member.progress}%`,
        ]),
        styles: { fontSize: 10 },
      })

      documentPdf.save('minha-equipa.pdf')
      closeExportModal()
      return
    }

    const headers = ['Ranking', 'Nome', 'Área', 'Badges', 'Pontos', 'Progresso']
    const rows = filteredMembers.map((member) => [member.rank, member.name, member.area, member.badges, member.points, `${member.progress}%`])
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows])
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Equipa')
    XLSX.writeFile(workbook, 'minha-equipa.xlsx')
    closeExportModal()
  }

  return (
    <div className="sll-team-page">
      <SLLSidebar />

      <main className="sll-team-main">
        <SLLTopbar />

        <div className="sll-team-content">
          <section className="sll-team-hero" aria-label="A minha equipa">
            <div className="sll-team-hero-art" aria-hidden="true">
              <img className="sll-team-hero-circle sll-team-hero-circle-5" src={heroCircle5} alt="" />
              <img className="sll-team-hero-circle sll-team-hero-circle-4" src={heroCircle4} alt="" />
              <img className="sll-team-hero-circle sll-team-hero-circle-3" src={heroCircle3} alt="" />
              <img className="sll-team-hero-circle sll-team-hero-circle-2" src={heroCircle2} alt="" />
              <img className="sll-team-hero-circle sll-team-hero-circle-1" src={heroCircle1} alt="" />
            </div>

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
                onChange={(event) => setSearchTerm(event.target.value)}
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
                  onClick={() => setShowFilter((previousValue) => !previousValue)}
                  aria-expanded={showFilter}
                  aria-haspopup="dialog"
                >
                  <FaFilter aria-hidden="true" />
                  <span>Filtro</span>
                </button>

                {showFilter ? (
                  <div className="sll-team-filter-popover" role="dialog" aria-label="Filtro da equipa">
                    <div className="sll-team-filter-field">
                      <label>Área</label>
                      <div className="sll-team-filter-select-wrap">
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

                    <div className="sll-team-filter-field">
                      <label>Data</label>
                      <div className="sll-team-filter-date-grid">
                        <div className="sll-team-filter-select-wrap is-date">
                          <input
                            type="date"
                            value={draftFilters.dateFrom}
                            onChange={(event) => updateDraftFilter('dateFrom', event.target.value)}
                            aria-label="Data inicial"
                          />
                        </div>
                        <div className="sll-team-filter-select-wrap is-date">
                          <input
                            type="date"
                            value={draftFilters.dateTo}
                            onChange={(event) => updateDraftFilter('dateTo', event.target.value)}
                            aria-label="Data final"
                          />
                        </div>
                      </div>
                    </div>

                    <button type="button" className="sll-team-filter-apply" onClick={applyFilters}>
                      Filtrar
                    </button>
                  </div>
                ) : null}
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
                      <td className="sll-team-rank">{member.rank}</td>
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

          {showExport ? (
            <div className="sll-team-export-backdrop" role="presentation" onClick={closeExportModal}>
              <div
                className="sll-team-export-modal"
                role="dialog"
                aria-modal="true"
                aria-label="Alerta Exportar"
                onClick={(event) => event.stopPropagation()}
              >
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
                  <button type="button" className="sll-team-export-cancel" onClick={closeExportModal}>
                    Cancelar
                  </button>
                  <button type="button" className="sll-team-export-confirm" onClick={handleExport}>
                    Exportar
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  )
}

export default SLLMinhaEquipaView