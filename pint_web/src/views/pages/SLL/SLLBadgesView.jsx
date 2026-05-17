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

const heroCircle1 = 'https://www.figma.com/api/mcp/asset/d52bcef6-8633-4aef-a46d-620628b11422'
const heroCircle2 = 'https://www.figma.com/api/mcp/asset/015d6486-d269-4542-b2af-cbffe841b87a'
const heroCircle3 = 'https://www.figma.com/api/mcp/asset/a95d40bd-58a1-4651-b2be-51b95d3ff5d3'
const heroCircle4 = 'https://www.figma.com/api/mcp/asset/c31d8d2e-032c-42c1-90ad-576563f8c6c7'
const heroCircle5 = 'https://www.figma.com/api/mcp/asset/83a3d8e4-0fed-4f71-a3dc-985cb88a65cc'

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
            <div className="sll-badges-hero-art" aria-hidden="true">
              <img className="sll-badges-hero-circle sll-badges-hero-circle-5" src={heroCircle5} alt="" />
              <img className="sll-badges-hero-circle sll-badges-hero-circle-4" src={heroCircle4} alt="" />
              <img className="sll-badges-hero-circle sll-badges-hero-circle-3" src={heroCircle3} alt="" />
              <img className="sll-badges-hero-circle sll-badges-hero-circle-2" src={heroCircle2} alt="" />
              <img className="sll-badges-hero-circle sll-badges-hero-circle-1" src={heroCircle1} alt="" />
            </div>

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