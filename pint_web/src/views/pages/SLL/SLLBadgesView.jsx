import { useMemo, useState } from 'react'
import { FaSearch, FaUpload } from 'react-icons/fa'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import SLLSidebar from '../../components/SLLSidebar'
import SLLTopbar from '../../components/SLLTopbar'
import badgeEntryLevel from '../../../assets/images/badges/outsystems_1.png'
import badgeTeamLeader from '../../../assets/images/badges/tm_1.png'
import badgeDevOps from '../../../assets/images/badges/devops_2.png'
import './SLL-badges.css'

const badgeGroups = [
  {
    title: 'Área: LowCode (Outsystems)',
    badges: [
      { name: 'Low-Code (Outsystems)', level: 'Junior', image: badgeEntryLevel },
      { name: 'Low-Code (Outsystems)', level: 'Intermédio', image: badgeTeamLeader },
      { name: 'Low-Code (Outsystems)', level: 'Sénior', image: badgeDevOps },
      { name: 'Low-Code (Outsystems)', level: 'Especialista', image: badgeDevOps },
      { name: 'Low-Code (Outsystems)', level: 'Líder de conhecimento', image: badgeDevOps },
      { name: 'Low-Code (Outsystems)', level: 'Conquista Especial', image: badgeDevOps },
    ],
  },
  {
    title: 'Área: Automation',
    badges: [
      { name: 'Automation', level: 'Junior', image: badgeEntryLevel },
      { name: 'Automation', level: 'Intermédio', image: badgeEntryLevel },
      { name: 'Automation', level: 'Nível Sénior', image: badgeEntryLevel },
      { name: 'Automation', level: 'Especialista', image: badgeEntryLevel },
      { name: 'Automation', level: 'Líder de conhecimento', image: badgeEntryLevel },
      { name: 'Automation', level: 'Conquista Especial', image: badgeEntryLevel },
    ],
  },
  {
    title: 'Área: Cloud Architecture',
    badges: [
      { name: 'Cloud Architecture', level: 'Junior', image: badgeEntryLevel },
      { name: 'Cloud Architecture', level: 'Intermédio', image: badgeEntryLevel },
      { name: 'Cloud Architecture', level: 'Nível Sénior', image: badgeEntryLevel },
      { name: 'Cloud Architecture', level: 'Especialista', image: badgeEntryLevel },
      { name: 'Cloud Architecture', level: 'Líder de conhecimento', image: badgeEntryLevel },
      { name: 'Cloud Architecture', level: 'Conquista Especial', image: badgeEntryLevel },
    ],
  },
]

function IconPoints() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M4.76567 1.60996C5.47447 1.31826 6.23337 1.16767 6.99984 1.16663C7.76401 1.16663 8.52234 1.31829 9.23401 1.60996C9.93984 1.90163 10.5815 2.33329 11.124 2.87579C11.6665 3.41829 12.0982 4.05996 12.3898 4.76579C12.6815 5.47746 12.8332 6.23579 12.8332 6.99996C12.8332 8.54579 12.2207 10.0333 11.124 11.1241C10.583 11.6666 9.9402 12.0969 9.23245 12.3902C8.5247 12.6835 7.76596 12.8341 6.99984 12.8333C6.23337 12.8322 5.47447 12.6817 4.76567 12.39C4.05871 12.0961 3.4165 11.666 2.87567 11.1241C2.33318 10.5832 1.90293 9.94032 1.60961 9.23257C1.3163 8.52482 1.16572 7.76608 1.16651 6.99996C1.16651 5.45413 1.77901 3.96663 2.87567 2.87579C3.41817 2.33329 4.05984 1.90163 4.76567 1.60996ZM6.99984 9.91663L7.90984 7.92163L9.91651 6.99996L7.90984 6.08996L6.99984 4.08329L6.08401 6.08996L4.08317 6.99996L6.08401 7.92163L6.99984 9.91663Z" fill="#8A92A6" />
    </svg>
  )
}

function BadgeCard({ badge }) {
  return (
    <article className="sll-badges-card">
      <div className="sll-badges-card-image-wrap">
        <img src={badge.image} alt={badge.name} className="sll-badges-card-image" />
      </div>

      <div className="sll-badges-card-copy">
        <h3>{badge.name}</h3>
        <p>{badge.level}</p>
      </div>

      <div className="sll-badges-card-meta"><IconPoints /> 550 Pontos</div>
    </article>
  )
}

function SLLBadgesView() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [selectedArea, setSelectedArea] = useState('')
  const [selectedExportFormat, setSelectedExportFormat] = useState('xlsx')

  const areaOptions = badgeGroups.map((group) => group.title.replace('Área: ', ''))

  const filteredBadgeGroups = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return badgeGroups
      .map((group) => ({
        ...group,
        badges: group.badges.filter((badge) => {
          const searchableText = [group.title, badge.name, badge.level].join(' ').toLowerCase()
          return !normalizedSearch || searchableText.includes(normalizedSearch)
        }),
      }))
      .filter((group) => group.badges.length > 0)
  }, [searchTerm])

  const filteredBadgeCount = useMemo(
    () => filteredBadgeGroups.reduce((sum, group) => sum + group.badges.length, 0),
    [filteredBadgeGroups]
  )

  const selectedGroup = badgeGroups.find((group) => group.title.replace('Área: ', '') === selectedArea)
  const badgesToExport = selectedGroup ? [selectedGroup] : badgeGroups

  function openExportDialog() {
    setShowExportDialog(true)
  }

  function closeExportDialog() {
    setShowExportDialog(false)
  }

  function exportBadges() {
    const rows = badgesToExport.flatMap((group) =>
      group.badges.map((badge) => ({
        Area: group.title.replace('Área: ', ''),
        Badge: badge.name,
        Level: badge.level,
        Points: 550,
      }))
    )

    if (selectedExportFormat === 'pdf') {
      const documentPdf = new jsPDF({ orientation: 'landscape' })

      documentPdf.setFontSize(16)
      documentPdf.text('Badges', 14, 16)

      autoTable(documentPdf, {
        startY: 24,
        head: [['Área', 'Badge', 'Level', 'Points']],
        body: rows.map((row) => [row.Area, row.Badge, row.Level, row.Points]),
        styles: { fontSize: 10 },
      })

      documentPdf.save('sll-badges.pdf')
      closeExportDialog()
      return
    }

    const worksheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Badges')
    XLSX.writeFile(workbook, 'sll-badges.xlsx')
    closeExportDialog()
  }

  function ExportFormatOption({ label, value }) {
    return (
      <button
        type="button"
        className={`sll-badges-export-option${selectedExportFormat === value ? ' is-selected' : ''}`}
        onClick={() => setSelectedExportFormat(value)}
        aria-pressed={selectedExportFormat === value}
      >
        <span className={`sll-badges-export-option-toggle${selectedExportFormat === value ? ' is-selected' : ''}`} aria-hidden="true">
          {selectedExportFormat === value ? <span className="sll-badges-export-option-dot" /> : null}
        </span>
        <span>{label}</span>
      </button>
    )
  }

  return (
    <div className="sll-badges-page">
      <SLLSidebar />

      <main className="sll-badges-main">
        <SLLTopbar />

        <div className="sll-badges-content">
          <section className="sll-badges-hero" aria-label="Badges">
            <div className="sll-badges-hero-copy">
              <h1>Badges</h1>
              <p>{filteredBadgeCount} badges disponíveis</p>
            </div>
          </section>

          <section className="sll-badges-toolbar" aria-label="Pesquisa e exportação de badges">
            <label className="sll-badges-search">
              <FaSearch aria-hidden="true" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>

            <button type="button" className="sll-badges-export-btn" onClick={openExportDialog}>
              <FaUpload aria-hidden="true" />
              <span>Exportar</span>
            </button>
          </section>

          <section className="sll-badges-groups" aria-label="Lista de badges">
            {filteredBadgeGroups.map((group) => (
              <div key={group.title} className="sll-badges-group">
                <h2>{group.title}</h2>

                <div className="sll-badges-grid">
                  {group.badges.map((badge) => (
                    <BadgeCard key={`${group.title}-${badge.name}-${badge.level}`} badge={badge} />
                  ))}
                </div>
              </div>
            ))}
          </section>

          {showExportDialog ? (
            <div className="sll-badges-export-backdrop" role="presentation" onClick={closeExportDialog}>
              <div
                className="sll-badges-export-modal"
                role="dialog"
                aria-modal="true"
                aria-label="Filtro de exportação"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="sll-badges-export-field">
                  <label>Área</label>
                  <div className="sll-badges-export-select-wrap">
                    <select value={selectedArea} onChange={(event) => setSelectedArea(event.target.value)}>
                      <option value="">Selecione a Área</option>
                      {areaOptions.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="sll-badges-export-field">
                  <label>Formato</label>
                  <div className="sll-badges-export-options">
                    <ExportFormatOption label="Excel (.xlsx)" value="xlsx" />
                    <ExportFormatOption label="PDF (.pdf)" value="pdf" />
                  </div>
                </div>

                <button type="button" className="sll-badges-export-confirm" onClick={exportBadges}>
                  Exportar
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  )
}

export default SLLBadgesView