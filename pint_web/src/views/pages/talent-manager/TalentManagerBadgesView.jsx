import { FaTimes, FaUpload } from 'react-icons/fa'
import { HiOutlineStar } from 'react-icons/hi2'
import { useState, useEffect } from 'react'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import axios from 'axios'
import './TalentManagerBadgesView.css'

const BASE_URL = 'http://localhost:3000/api'

// Imagens decorativas (sem alterações)
const imgChevron    = 'https://www.figma.com/api/mcp/asset/848d08f5-8f59-4d13-afe5-f69bf9c9060b'
const imgEllipse5   = 'https://www.figma.com/api/mcp/asset/f69dab14-0120-404d-b38a-c3716974273d'
const imgEllipse4   = 'https://www.figma.com/api/mcp/asset/b09d6b9d-08a5-4acb-8d54-c13928775d60'
const imgEllipse3   = 'https://www.figma.com/api/mcp/asset/8afce139-66a4-4e0f-8a2a-dbfea84cefad'
const imgEllipse2   = 'https://www.figma.com/api/mcp/asset/8cbf430c-6968-487b-bd47-da4fe592bb73'
const imgEllipse1   = 'https://www.figma.com/api/mcp/asset/a62526d5-25ef-4809-a07d-a1dc9c9d4492'
const imgReqPoints  = 'https://www.figma.com/api/mcp/asset/b7777185-c1de-4b26-b019-6b2d0147dd6c'
const imgReqSpecial = 'https://www.figma.com/api/mcp/asset/e3c31530-d63f-438b-90ea-6b99c6fcc7ed'
const imgModalBadge = 'https://www.figma.com/api/mcp/asset/886d10fd-890a-4f34-b26c-01f949cbf5a6'

// ── sub-componentes (sem alterações) ─────────────────────────────────────────

function IconAreaMenu({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M5 7h14M5 12h14M5 17h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function BadgeCard({ icon, title, level, points, onClick, cp }) {
  return (
    <button type="button" className={`${cp}-card`} onClick={onClick}>
      <div className={`${cp}-card-icon`}>
        <img alt="" src={icon || imgModalBadge} onError={(e) => { e.target.src = imgModalBadge }} />
      </div>
      <div className={`${cp}-card-copy`}>
        <div className={`${cp}-card-title`}>{title}</div>
        <div className={`${cp}-card-level`}>{level}</div>
        <div className={`${cp}-card-points`}>
          <HiOutlineStar className={`${cp}-card-points-icon`} aria-hidden="true" />
          <span>{points} Pontos</span>
        </div>
      </div>
    </button>
  )
}

function ExportFormatOption({ label, value, selected, onSelect, cp }) {
  return (
    <button type="button" className={`${cp}-export-option`} onClick={() => onSelect(value)} aria-pressed={selected}>
      <span className={`${cp}-export-option-toggle${selected ? ' is-selected' : ''}`} aria-hidden="true">
        {selected ? <span className={`${cp}-export-option-dot`} /> : null}
      </span>
      <span>{label}</span>
    </button>
  )
}

// ── componente principal ──────────────────────────────────────────────────────

function TalentManagerBadgesView({
  heroTitle = 'Badges',
  heroSubtitle = null,         // null → calculado automaticamente
  showExportButton = true,
  classPrefix = 'tm-badges',
  onBadgeClick = null,
} = {}) {
  const [learningPaths, setLearningPaths] = useState([])  // [{ id, title, serviceLines }]
  const [activeTabId, setActiveTabId]     = useState(null)
  const [openSection, setOpenSection]     = useState(null) // id da SL aberta
  const [showExport, setShowExport]       = useState(false)
  const [selectedBadge, setSelectedBadge] = useState(null)
  const [selectedExportFormat, setSelectedExportFormat] = useState('xlsx')

  const cp = classPrefix

  // ── fetch ─────────────────────────────────────────────────────────────────

  useEffect(() => { loadData() }, [])

  async function loadData() {
    try {
      const [lpRes, slRes, areasRes, badgesRes] = await Promise.all([
        axios.get(`${BASE_URL}/learningPaths/get`),
        axios.get(`${BASE_URL}/serviceLines/get`),
        axios.get(`${BASE_URL}/areas/get`),
        axios.get(`${BASE_URL}/badges/get`),
      ])

      // badges por área: { id_area: [badge, …] }
      const badgesByArea = {}
      badgesRes.data.forEach((b) => {
        if (!badgesByArea[b.id_area]) badgesByArea[b.id_area] = []
        badgesByArea[b.id_area].push({
          id:          b.id_badge,
          title:       b.nome_badge,
          level:       b.nivel_badge,
          icon:        b.imagem_badge || imgModalBadge,
          points:      b.pontos_badge ?? 0,
          isSpecial:   b.pago ?? false,
          description: b.descricao_badge ?? '',
        })
      })

      // áreas por service line: { id_service_line: [area, …] }
      const areasBySL = {}
      areasRes.data.forEach((a) => {
        if (!areasBySL[a.id_service_line]) areasBySL[a.id_service_line] = []
        areasBySL[a.id_service_line].push({
          id:     a.id_area,
          title:  a.nome_area,
          badges: badgesByArea[a.id_area] || [],
        })
      })

      // service lines por learning path: { id_learning_path: [sl, …] }
      const slByLP = {}
      slRes.data.forEach((sl) => {
        if (!slByLP[sl.id_learning_path]) slByLP[sl.id_learning_path] = []
        slByLP[sl.id_learning_path].push({
          id:    sl.id_service_line,
          title: sl.nome_service_line,
          areas: areasBySL[sl.id_service_line] || [],
        })
      })

      // learning paths completas
      const lps = lpRes.data.map((lp) => ({
        id:           lp.id_learning_path,
        title:        lp.nome_learning_path,
        serviceLines: slByLP[lp.id_learning_path] || [],
      }))

      setLearningPaths(lps)

      if (lps.length > 0) {
        setActiveTabId(lps[0].id)
        // Abre a primeira service line automaticamente
        const firstSL = lps[0].serviceLines[0]
        if (firstSL) setOpenSection(firstSL.id)
      }
    } catch (error) {
      console.error(error)
    }
  }

  // ── estado derivado ───────────────────────────────────────────────────────

  const activeLearningPath = learningPaths.find((lp) => lp.id === activeTabId) ?? null
  const serviceLines       = activeLearningPath?.serviceLines ?? []

  const totalBadges = learningPaths.reduce((sum, lp) =>
    sum + lp.serviceLines.reduce((s2, sl) =>
      s2 + sl.areas.reduce((s3, a) => s3 + a.badges.length, 0), 0), 0)

  const computedSubtitle = heroSubtitle ?? `${totalBadges} badge${totalBadges !== 1 ? 's' : ''} disponíve${totalBadges !== 1 ? 'is' : 'l'}`

  // ── export ────────────────────────────────────────────────────────────────

  const exportRows = serviceLines.flatMap((sl) =>
    sl.areas.flatMap((area) =>
      area.badges.map((badge) => ({
        'Learning Path': activeLearningPath?.title ?? '',
        'Service Line':  sl.title,
        'Área':          area.title,
        'Badge':         badge.title,
        'Nível':         badge.level,
        'Pontos':        badge.points,
      }))
    )
  )

  function closeExportModal() { setShowExport(false) }

  function handleExport() {
    if (selectedExportFormat === 'pdf') {
      const doc = new jsPDF()
      doc.setFontSize(16)
      doc.text('Badges', 14, 16)
      autoTable(doc, {
        startY: 24,
        head: [['Learning Path', 'Service Line', 'Área', 'Badge', 'Nível', 'Pontos']],
        body: exportRows.map((r) => [r['Learning Path'], r['Service Line'], r['Área'], r['Badge'], r['Nível'], String(r['Pontos'])]),
        styles: { fontSize: 10 },
      })
      doc.save('badges_export.pdf')
    } else {
      const ws = XLSX.utils.json_to_sheet(exportRows)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Badges')
      XLSX.writeFile(wb, 'badges_export.xlsx')
    }
    closeExportModal()
  }

  // ── handlers ──────────────────────────────────────────────────────────────

  function handleBadgeClick(badge) {
    if (onBadgeClick) { onBadgeClick(badge); return }
    setSelectedBadge(badge)
  }

  function toggleSection(slId) {
    setOpenSection((current) => (current === slId ? null : slId))
  }

  function closeBadgeModal() { setSelectedBadge(null) }

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className={`${cp}-page`}>
      <section className={`${cp}-banner`}>
        <div className={`${cp}-banner-art`} aria-hidden="true">
          <img className={`${cp}-banner-circle ${cp}-banner-circle-5`} src={imgEllipse5} alt="" />
          <img className={`${cp}-banner-circle ${cp}-banner-circle-4`} src={imgEllipse4} alt="" />
          <img className={`${cp}-banner-circle ${cp}-banner-circle-3`} src={imgEllipse3} alt="" />
          <img className={`${cp}-banner-circle ${cp}-banner-circle-2`} src={imgEllipse2} alt="" />
          <img className={`${cp}-banner-circle ${cp}-banner-circle-1`} src={imgEllipse1} alt="" />
        </div>
        <div className={`${cp}-banner-copy`}>
          <h1>{heroTitle}</h1>
          <p>{computedSubtitle}</p>
        </div>
      </section>

      <section className={`${cp}-content`} aria-label="Badges">
        <div className={`${cp}-toolbar`}>
          {/* Tabs = Learning Paths */}
          <div className={`${cp}-tabs`} role="tablist" aria-label="Categorias de badges">
            {learningPaths.map((lp) => (
              <button
                key={lp.id}
                type="button"
                className={`${cp}-tab${activeTabId === lp.id ? ' is-active' : ''}`}
                role="tab"
                aria-selected={activeTabId === lp.id}
                onClick={() => {
                  setActiveTabId(lp.id)
                  const firstSL = lp.serviceLines[0]
                  setOpenSection(firstSL ? firstSL.id : null)
                }}
              >
                {lp.title}
              </button>
            ))}
          </div>

          {showExportButton ? (
            <button type="button" className={`${cp}-export-btn`} onClick={() => setShowExport(true)}>
              <FaUpload aria-hidden="true" className={`${cp}-export-icon`} />
              <span>Exportar</span>
            </button>
          ) : null}
        </div>

        {/* Modal exportar */}
        {showExport ? (
          <div className={`${cp}-export-backdrop`} role="presentation" onClick={closeExportModal}>
            <div className={`${cp}-export-modal`} role="dialog" aria-modal="true" aria-label="Exportar badges" onClick={(e) => e.stopPropagation()}>
              <div className={`${cp}-export-header`}>
                <h2>Exportar</h2>
                <button type="button" className={`${cp}-export-close`} onClick={closeExportModal} aria-label="Fechar exportação">
                  <FaTimes aria-hidden="true" />
                </button>
              </div>
              <div className={`${cp}-export-body`}>
                <h3>Formato de exportação</h3>
                <p>Escolha o formato que pretende descarregar.</p>
                <div className={`${cp}-export-options`}>
                  <ExportFormatOption cp={cp} label="Excel (.xlsx)" value="xlsx" selected={selectedExportFormat === 'xlsx'} onSelect={setSelectedExportFormat} />
                  <ExportFormatOption cp={cp} label="PDF (.pdf)"   value="pdf"  selected={selectedExportFormat === 'pdf'}  onSelect={setSelectedExportFormat} />
                </div>
              </div>
              <div className={`${cp}-export-actions`}>
                <button type="button" className={`${cp}-export-cancel`}  onClick={closeExportModal}>Cancelar</button>
                <button type="button" className={`${cp}-export-confirm`} onClick={handleExport}>Exportar</button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Acordeão: Service Lines → Áreas → Badges */}
        <div className={`${cp}-areas-card`}>
          {serviceLines.length === 0 ? (
            <p style={{ padding: '1rem' }}>Sem dados disponíveis.</p>
          ) : (
            serviceLines.map((sl, index) => {
              const isOpen    = openSection === sl.id
              const areaCount = sl.areas.length
              const badgeCount= sl.areas.reduce((sum, a) => sum + a.badges.length, 0)
              const detail    = `${areaCount} área${areaCount !== 1 ? 's' : ''} • ${badgeCount} badge${badgeCount !== 1 ? 's' : ''}`

              return (
                <div key={sl.id}>
                  {/* Separador entre secções */}
                  {index > 0 ? <div className={`${cp}-divider`} aria-hidden="true" /> : null}

                  <div className={`${cp}-area-section${isOpen ? ' is-open' : ''}`}>
                    {/* Trigger do acordeão */}
                    <button
                      type="button"
                      className={`${cp}-area-trigger`}
                      onClick={() => toggleSection(sl.id)}
                      aria-expanded={isOpen}
                    >
                      <div className={`${cp}-area-trigger-main`}>
                        <div className={`${cp}-area-icon`}>
                          <IconAreaMenu className={`${cp}-area-icon-svg`} />
                        </div>
                        <div className={`${cp}-area-trigger-copy`}>
                          <strong>{sl.title}</strong>
                          <span>{detail}</span>
                        </div>
                      </div>
                      <div className={`${cp}-area-chevron${isOpen ? ' is-open' : ''}`} aria-hidden="true">
                        <img alt="" src={imgChevron} />
                      </div>
                    </button>

                    {/* Corpo: áreas e badges */}
                    {isOpen ? (
                      <div className={`${cp}-area-body`}>
                        {sl.areas.length === 0 ? (
                          <p style={{ padding: '0.5rem 1rem', opacity: 0.6 }}>Sem áreas definidas.</p>
                        ) : (
                          sl.areas.map((area) => (
                            <div key={area.id} className={`${cp}-badge-group`}>
                              <div className={`${cp}-badge-group-title`}>
                                <span>{area.title}</span>
                                <span className={`${cp}-badge-group-progress`}>
                                  {area.badges.length} badge{area.badges.length !== 1 ? 's' : ''}
                                </span>
                              </div>

                              {area.badges.length === 0 ? (
                                <p style={{ padding: '0.5rem', opacity: 0.6 }}>Sem badges definidos.</p>
                              ) : (
                                <div className={`${cp}-badge-grid`}>
                                  {area.badges.map((badge) => (
                                    <BadgeCard
                                      key={badge.id}
                                      cp={cp}
                                      icon={badge.icon}
                                      title={badge.title}
                                      level={badge.level}
                                      points={badge.points}
                                      onClick={() => handleBadgeClick(badge)}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              )
            })
          )}

          {/* Modal detalhe do badge */}
          {selectedBadge ? (
            <div className={`${cp}-detail-backdrop`} role="presentation" onClick={closeBadgeModal}>
              <div className={`${cp}-detail-modal`} role="dialog" aria-modal="true" aria-label="Detalhes do badge" onClick={(e) => e.stopPropagation()}>
                <div className={`${cp}-detail-top`}>
                  <div className={`${cp}-detail-badge-wrap`}>
                    <img alt="" src={selectedBadge.icon || imgModalBadge} className={`${cp}-detail-badge`} onError={(e) => { e.target.src = imgModalBadge }} />
                  </div>
                  <button type="button" className={`${cp}-detail-close`} onClick={closeBadgeModal} aria-label="Fechar detalhes">
                    <FaTimes aria-hidden="true" />
                  </button>
                </div>

                <div className={`${cp}-detail-copy`}>
                  <div className={`${cp}-detail-title`}>{selectedBadge.title}</div>
                  <div className={`${cp}-detail-points`}>
                    <img alt="" src={imgReqPoints} />
                    <span>{selectedBadge.points} Pontos</span>
                  </div>
                  {selectedBadge.isSpecial ? (
                    <div className={`${cp}-detail-special`}>
                      <img alt="" src={imgReqSpecial} />
                      <span>Badge Especial</span>
                    </div>
                  ) : null}
                </div>

                <div className={`${cp}-detail-section`}>
                  <h3>Descrição:</h3>
                  <p>{selectedBadge.description || 'Sem descrição disponível.'}</p>
                </div>

                <div className={`${cp}-detail-section`}>
                  <h3>Nível:</h3>
                  <p>{selectedBadge.level}</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  )
}

export default TalentManagerBadgesView