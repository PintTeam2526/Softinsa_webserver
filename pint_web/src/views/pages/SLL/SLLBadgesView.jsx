import { useMemo, useState, useEffect } from 'react'
import { FaSearch, FaUpload } from 'react-icons/fa'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import SLLSidebar from '../../components/SLLSidebar'
import SLLTopbar from '../../components/SLLTopbar'
import { getAreas } from '../../../controllers/areasController'
import { getBadges } from '../../../controllers/badgesController'
import './SLL-badges.css'

const imgBadgeFallback = 'https://www.figma.com/api/mcp/asset/886d10fd-890a-4f34-b26c-01f949cbf5a6'

// ── utilitários ───────────────────────────────────────────────────────────────

/** Extrai o payload do JWT guardado no localStorage sem biblioteca externa */
function getTokenPayload() {
  try {
    const token = localStorage.getItem('token')
    if (!token) return null
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

/** Normaliza imagens base64 vindas do backend */
function normalizeImage(raw) {
  if (!raw) return imgBadgeFallback
  if (raw.startsWith('data:')) return raw
  return `data:image/png;base64,${raw}`
}

// ── sub-componentes ───────────────────────────────────────────────────────────

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
        <img
          src={badge.image}
          alt={badge.name}
          className="sll-badges-card-image"
          onError={(e) => { e.target.src = imgBadgeFallback }}
        />
      </div>

      <div className="sll-badges-card-copy">
        <h3>{badge.name}</h3>
        <p>{badge.level}</p>
      </div>

      <div className="sll-badges-card-meta">{badge.points} Pontos</div>
    </article>
  )
}

// ── componente principal ──────────────────────────────────────────────────────

function SLLBadgesView() {
  const [badgeGroups, setBadgeGroups] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [selectedArea, setSelectedArea] = useState('')
  const [selectedExportFormat, setSelectedExportFormat] = useState('xlsx')

  // ── fetch ─────────────────────────────────────────────────────────────────

  useEffect(() => { loadData() }, [])

  async function loadData() {
    try {
      // Extrai o id da service line do utilizador autenticado a partir do JWT
      const payload = getTokenPayload()
      const idServiceLine = payload?.id_service_line_lider
      if (!idServiceLine) {
        console.error('Não foi possível determinar a service line do utilizador.')
        return
      }

      const [areasData, badgesData] = await Promise.all([
        getAreas(),
        getBadges(),
      ])

      // Filtra apenas as áreas da service line do utilizador
      const areasDaSL = areasData.filter((a) => a.id_service_line === idServiceLine)

      // Mapeia badges por área
      const badgesByArea = {}
      badgesData.forEach((b) => {
        if (!badgesByArea[b.id_area]) badgesByArea[b.id_area] = []
        badgesByArea[b.id_area].push({
          name: b.nome_badge,
          level: b.nivel_badge,
          image: normalizeImage(b.imagem_badge),
          points: b.pontos_badge ?? 0,
        })
      })

      // Constrói os grupos (uma entrada por área)
      const groups = areasDaSL.map((area) => ({
        id: area.id_area,
        title: area.nome_area,
        badges: badgesByArea[area.id_area] || [],
      }))

      setBadgeGroups(groups)
    } catch (error) {
      console.error('Erro ao carregar badges:', error)
    }
  }

  // ── filtragem por pesquisa ────────────────────────────────────────────────

  const filteredBadgeGroups = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return badgeGroups

    return badgeGroups
      .map((group) => ({
        ...group,
        badges: group.badges.filter((badge) =>
          [group.title, badge.name, badge.level].join(' ').toLowerCase().includes(term)
        ),
      }))
      .filter((group) => group.badges.length > 0)
  }, [searchTerm, badgeGroups])

  const filteredBadgeCount = useMemo(
    () => filteredBadgeGroups.reduce((sum, group) => sum + group.badges.length, 0),
    [filteredBadgeGroups]
  )

  // ── export ────────────────────────────────────────────────────────────────

  const areaOptions = badgeGroups.map((g) => g.title)

  const groupsToExport = selectedArea
    ? badgeGroups.filter((g) => g.title === selectedArea)
    : badgeGroups

  function exportBadges() {
    const rows = groupsToExport.flatMap((group) =>
      group.badges.map((badge) => ({
        Área: group.title,
        Badge: badge.name,
        Nível: badge.level,
        Pontos: badge.points,
      }))
    )

    if (selectedExportFormat === 'pdf') {
      const doc = new jsPDF({ orientation: 'landscape' })
      doc.setFontSize(16)
      doc.text('Badges', 14, 16)
      autoTable(doc, {
        startY: 24,
        head: [['Área', 'Badge', 'Nível', 'Pontos']],
        body: rows.map((r) => [r['Área'], r['Badge'], r['Nível'], String(r['Pontos'])]),
        styles: { fontSize: 10 },
      })
      doc.save('sll-badges.pdf')
    } else {
      const ws = XLSX.utils.json_to_sheet(rows)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Badges')
      XLSX.writeFile(wb, 'sll-badges.xlsx')
    }

    setShowExportDialog(false)
  }

  function ExportFormatOption({ label, value }) {
    return (
      <button
        type="button"
        className={`sll-badges-export-option${selectedExportFormat === value ? ' is-selected' : ''}`}
        onClick={() => setSelectedExportFormat(value)}
        aria-pressed={selectedExportFormat === value}
      >
        <span
          className={`sll-badges-export-option-toggle${selectedExportFormat === value ? ' is-selected' : ''}`}
          aria-hidden="true"
        >
          {selectedExportFormat === value ? <span className="sll-badges-export-option-dot" /> : null}
        </span>
        <span>{label}</span>
      </button>
    )
  }

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="sll-badges-page">
      <SLLSidebar />

      <main className="sll-badges-main">
        <SLLTopbar />

        <div className="sll-badges-content">
          <section className="sll-badges-hero" aria-label="Badges">
            <div className="sll-badges-hero-copy">
              <h1>Badges</h1>
              <p>{filteredBadgeCount} badge{filteredBadgeCount !== 1 ? 's' : ''} disponíve{filteredBadgeCount !== 1 ? 'is' : 'l'}</p>
            </div>
          </section>

          <section className="sll-badges-toolbar" aria-label="Pesquisa e exportação de badges">
            <label className="sll-badges-search">
              <FaSearch aria-hidden="true" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </label>

            <button type="button" className="sll-badges-export-btn" onClick={() => setShowExportDialog(true)}>
              <FaUpload aria-hidden="true" />
              <span>Exportar</span>
            </button>
          </section>

          <section className="sll-badges-groups" aria-label="Lista de badges">
            {filteredBadgeGroups.length === 0 ? (
              <p style={{ padding: '1rem', opacity: 0.6 }}>Sem badges disponíveis.</p>
            ) : (
              filteredBadgeGroups.map((group) => (
                <div key={group.id} className="sll-badges-group">
                  <h2>{group.title} - {group.badges.length} badge{group.badges.length !== 1 ? 's' : ''}</h2>

                  <div className="sll-badges-grid">
                    {group.badges.map((badge) => (
                      <BadgeCard key={`${group.id}-${badge.name}-${badge.level}`} badge={badge} />
                    ))}
                  </div>
                </div>
              ))
            )}
          </section>

          {showExportDialog ? (
            <div className="sll-badges-export-backdrop" role="presentation" onClick={() => setShowExportDialog(false)}>
              <div
                className="sll-badges-export-modal"
                role="dialog"
                aria-modal="true"
                aria-label="Filtro de exportação"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sll-badges-export-field">
                  <label>Área</label>
                  <div className="sll-badges-export-select-wrap">
                    <select value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)}>
                      <option value="">Todas as áreas</option>
                      {areaOptions.map((area) => (
                        <option key={area} value={area}>{area}</option>
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