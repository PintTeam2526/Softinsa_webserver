import { useMemo, useState } from 'react'
import { FaSearch, FaUpload } from 'react-icons/fa'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import SLLSidebar from '../../components/SLLSidebar'
import SLLTopbar from '../../components/SLLTopbar'
import './SLL-badges.css'

const profileBadgeEntryLevel = 'https://www.figma.com/api/mcp/asset/41229589-8f50-47c3-8553-3b4939eafc0c'
const profileBadgeTeamLeader = 'https://www.figma.com/api/mcp/asset/b4a91d17-1fb7-4a47-bc42-d9284b60851f'
const profileBadgeDevOps = 'https://www.figma.com/api/mcp/asset/b1a47080-ecc6-400f-b8f3-775875949b31'
const heroCircle1 = 'https://www.figma.com/api/mcp/asset/b98ac891-52b5-4f87-9c29-5a058ffc308e'
const heroCircle2 = 'https://www.figma.com/api/mcp/asset/231bc4b5-58b9-4c12-a9e6-ebef268288bf'
const heroCircle3 = 'https://www.figma.com/api/mcp/asset/660eaa88-89e1-4d74-a182-154bda36148d'
const heroCircle4 = 'https://www.figma.com/api/mcp/asset/c3ff47c5-98fe-4ec6-98c9-aebd9afb0845'
const heroCircle5 = 'https://www.figma.com/api/mcp/asset/6b88aaa6-d112-4bef-b80f-69e6c4a821bb'

const badgeGroups = [
  {
    title: 'Área: LowCode (Outsystems)',
    badges: [
      { name: 'Low-Code (Outsystems)', level: 'Junior', image: profileBadgeEntryLevel },
      { name: 'Low-Code (Outsystems)', level: 'Intermédio', image: profileBadgeTeamLeader },
      { name: 'Low-Code (Outsystems)', level: 'Sénior', image: profileBadgeDevOps },
      { name: 'Low-Code (Outsystems)', level: 'Especialista', image: profileBadgeDevOps },
      { name: 'Low-Code (Outsystems)', level: 'Líder de conhecimento', image: profileBadgeDevOps },
      { name: 'Low-Code (Outsystems)', level: 'Conquista Especial', image: profileBadgeDevOps },
    ],
  },
  {
    title: 'Área: Automation',
    badges: [
      { name: 'Automation', level: 'Junior', image: profileBadgeEntryLevel },
      { name: 'Automation', level: 'Intermédio', image: profileBadgeEntryLevel },
      { name: 'Automation', level: 'Nível Sénior', image: profileBadgeEntryLevel },
      { name: 'Automation', level: 'Especialista', image: profileBadgeEntryLevel },
      { name: 'Automation', level: 'Líder de conhecimento', image: profileBadgeEntryLevel },
      { name: 'Automation', level: 'Conquista Especial', image: profileBadgeEntryLevel },
    ],
  },
  {
    title: 'Área: Cloud Architecture',
    badges: [
      { name: 'Cloud Architecture', level: 'Junior', image: profileBadgeEntryLevel },
      { name: 'Cloud Architecture', level: 'Intermédio', image: profileBadgeEntryLevel },
      { name: 'Cloud Architecture', level: 'Nível Sénior', image: profileBadgeEntryLevel },
      { name: 'Cloud Architecture', level: 'Especialista', image: profileBadgeEntryLevel },
      { name: 'Cloud Architecture', level: 'Líder de conhecimento', image: profileBadgeEntryLevel },
      { name: 'Cloud Architecture', level: 'Conquista Especial', image: profileBadgeEntryLevel },
    ],
  },
]

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

      <div className="sll-badges-card-meta">550 Pontos</div>
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
            <div className="sll-badges-hero-art" aria-hidden="true">
              <img className="sll-badges-hero-circle sll-badges-hero-circle-5" src={heroCircle5} alt="" />
              <img className="sll-badges-hero-circle sll-badges-hero-circle-4" src={heroCircle4} alt="" />
              <img className="sll-badges-hero-circle sll-badges-hero-circle-3" src={heroCircle3} alt="" />
              <img className="sll-badges-hero-circle sll-badges-hero-circle-2" src={heroCircle2} alt="" />
              <img className="sll-badges-hero-circle sll-badges-hero-circle-1" src={heroCircle1} alt="" />
            </div>

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