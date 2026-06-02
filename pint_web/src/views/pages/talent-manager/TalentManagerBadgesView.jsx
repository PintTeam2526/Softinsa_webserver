import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaTimes } from 'react-icons/fa'
import { HiOutlineStar, HiOutlineCurrencyEuro } from 'react-icons/hi2'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import './TalentManagerBadgesView.css'

import { getLearningPaths } from '../../../controllers/learningPathsController'
import { getServiceLines } from '../../../controllers/serviceLinesController'
import { getAreas } from '../../../controllers/areasController'
import { getBadges } from '../../../controllers/badgesController'
import { getRequisitosByBadge } from '../../../controllers/requisitosController'


// Imagens decorativas
const imgChevron = 'https://www.figma.com/api/mcp/asset/848d08f5-8f59-4d13-afe5-f69bf9c9060b'
const imgEllipse5 = 'https://www.figma.com/api/mcp/asset/f69dab14-0120-404d-b38a-c3716974273d'
const imgEllipse4 = 'https://www.figma.com/api/mcp/asset/b09d6b9d-08a5-4acb-8d54-c13928775d60'
const imgEllipse3 = 'https://www.figma.com/api/mcp/asset/8afce139-66a4-4e0f-8a2a-dbfea84cefad'
const imgEllipse2 = 'https://www.figma.com/api/mcp/asset/8cbf430c-6968-487b-bd47-da4fe592bb73'
const imgEllipse1 = 'https://www.figma.com/api/mcp/asset/a62526d5-25ef-4809-a07d-a1dc9c9d4492'
const imgModalBadge = 'https://www.figma.com/api/mcp/asset/886d10fd-890a-4f34-b26c-01f949cbf5a6'

// ── ícone de exportação ───────────────────────────────────────────────────────

function ExportIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="16" height="16" aria-hidden="true" style={{ strokeWidth: 2, stroke: 'currentColor' }}>
      <path d="M19 14v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="17 10 12 5 7 10" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="5" x2="12" y2="16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── utilitário base64 ─────────────────────────────────────────────────────────

function normalizeImage(raw, fallback = imgModalBadge) {
  if (!raw) return fallback
  if (raw.startsWith('data:')) return raw
  return `data:image/png;base64,${raw}`
}

// ── sub-componentes ───────────────────────────────────────────────────────────

function IconPoints({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M8.17001 2.76C9.38508 2.25995 10.6861 2.00179 12 2C13.31 2 14.61 2.26 15.83 2.76C17.04 3.26 18.14 4 19.07 4.93C20 5.86 20.74 6.96 21.24 8.17C21.74 9.39 22 10.69 22 12C22 14.65 20.95 17.2 19.07 19.07C18.1426 20 17.0406 20.7376 15.8273 21.2404C14.614 21.7432 13.3134 22.0014 12 22C10.6861 21.9982 9.38508 21.7401 8.17001 21.24C6.95807 20.7363 5.85714 19.9989 4.93001 19.07C4.00002 18.1426 3.26244 17.0406 2.75962 15.8273C2.2568 14.614 1.99865 13.3134 2.00001 12C2.00001 9.35 3.05001 6.8 4.93001 4.93C5.86001 4 6.96001 3.26 8.17001 2.76ZM12 17L13.56 13.58L17 12L13.56 10.44L12 7L10.43 10.44L7.00001 12L10.43 13.58L12 17Z" fill="currentColor" />
    </svg>
  )
}

function IconAreaMenu({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 7h14M5 12h14M5 17h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function BadgeCard({ icon, title, level, points, onClick, cp }) {
  return (
    <button type="button" className={`${cp}-card`} onClick={onClick}>
      <div className={`${cp}-card-icon`}>
        <img alt="" src={icon} onError={(e) => { e.target.src = imgModalBadge }} />
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
  isGuest = false,
  heroTitle = 'Badges',
  heroSubtitle = null,
  showExportButton = true,
  classPrefix = 'tm-badges',
  onBadgeClick = null,
} = {}) {
  const navigate = useNavigate()

  const [learningPaths, setLearningPaths] = useState([])
  const [activeTabId, setActiveTabId] = useState(null)
  const [openSection, setOpenSection] = useState(null)
  const [showExport, setShowExport] = useState(false)
  const [selectedBadge, setSelectedBadge] = useState(null)
  const [selectedBadgeRequisitos, setSelectedBadgeRequisitos] = useState([])
  const [loadingRequisitos, setLoadingRequisitos] = useState(false)
  const [selectedExportFormat, setSelectedExportFormat] = useState('xlsx')

  const cp = classPrefix

  // ── fetch ─────────────────────────────────────────────────────────────────

  useEffect(() => { loadData() }, [])

  async function loadData() {
    try {
      const [lpData, slData, areasData, badgesData] = await Promise.all([
        getLearningPaths(),
        getServiceLines(),
        getAreas(),
        getBadges(),
      ])

      const badgesByArea = {}
      badgesData.forEach((b) => {
        if (!badgesByArea[b.id_area]) badgesByArea[b.id_area] = []
        badgesByArea[b.id_area].push({
          id: b.id_badge,
          title: b.nome_badge,
          level: b.nivel_badge,
          icon: normalizeImage(b.imagem_badge),
          points: b.pontos_badge ?? 0,
          isSpecial: b.pago ?? false,
          description: b.descricao_badge ?? '',
        })
      })

      const areasBySL = {}
      areasData.forEach((a) => {
        if (!areasBySL[a.id_service_line]) areasBySL[a.id_service_line] = []
        areasBySL[a.id_service_line].push({
          id: a.id_area,
          title: a.nome_area,
          badges: badgesByArea[a.id_area] || [],
        })
      })

      const slByLP = {}
      slData.forEach((sl) => {
        if (!slByLP[sl.id_learning_path]) slByLP[sl.id_learning_path] = []
        slByLP[sl.id_learning_path].push({
          id: sl.id_service_line,
          title: sl.nome_service_line,
          areas: areasBySL[sl.id_service_line] || [],
        })
      })

      const lps = lpData.map((lp) => ({
        id: lp.id_learning_path,
        title: lp.nome_learning_path,
        serviceLines: slByLP[lp.id_learning_path] || [],
      }))

      setLearningPaths(lps)

      if (lps.length > 0) {
        setActiveTabId(lps[0].id)
        const firstSL = lps[0].serviceLines[0]
        if (firstSL) setOpenSection(firstSL.id)
      }
    } catch (error) {
      console.error('Erro ao carregar badges:', error)
    }
  }

  // ── estado derivado ───────────────────────────────────────────────────────

  const activeLearningPath = learningPaths.find((lp) => lp.id === activeTabId) ?? null
  const serviceLines = activeLearningPath?.serviceLines ?? []

  const totalBadges = learningPaths.reduce((sum, lp) =>
    sum + lp.serviceLines.reduce((s2, sl) =>
      s2 + sl.areas.reduce((s3, a) => s3 + a.badges.length, 0), 0), 0)

  const computedSubtitle = heroSubtitle ?? `${totalBadges} badge${totalBadges !== 1 ? 's' : ''} disponíve${totalBadges !== 1 ? 'is' : 'l'}`

  // ── export ────────────────────────────────────────────────────────────────

  const exportRows = serviceLines.flatMap((sl) =>
    sl.areas.flatMap((area) =>
      area.badges.map((badge) => ({
        'Learning Path': activeLearningPath?.title ?? '',
        'Service Line': sl.title,
        'Área': area.title,
        'Badge': badge.title,
        'Nível': badge.level,
        'Pontos': badge.points,
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

  async function handleBadgeClick(badge) {
    if (isGuest) {
      navigate(`/${badge.id}`)
      return
    }
    if (onBadgeClick) {
      onBadgeClick(badge);
      return
    }
    setSelectedBadge(badge)
    setSelectedBadgeRequisitos([])
    setLoadingRequisitos(true)
    try {
      const data = await getRequisitosByBadge(badge.id)
      const reqs = Array.isArray(data) ? data : (data?.requisitos ?? data?.data ?? [])
      setSelectedBadgeRequisitos(reqs.map((r, i) => ({
        id: r.id_requisito ?? i,
        title: r.nome_requisito ?? `Requisito ${i + 1}`,
        descricao: r.descricao_requisito ?? '',
        image: r.imagem_requisito ? `data:image/png;base64,${r.imagem_requisito}` : null,
      })))
    } catch (err) {
      console.error('Erro ao carregar requisitos', err)
    } finally {
      setLoadingRequisitos(false)
    }
  }


  function toggleSection(slId) {
    setOpenSection((current) => (current === slId ? null : slId))
  }

  function closeBadgeModal() {
    setSelectedBadge(null)
    setSelectedBadgeRequisitos([])
  }

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

          {!isGuest && showExportButton ? (
            <button type="button" className={`${cp}-export-btn`} onClick={() => setShowExport(true)}>
              <ExportIcon />
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
                  <ExportFormatOption cp={cp} label="PDF (.pdf)" value="pdf" selected={selectedExportFormat === 'pdf'} onSelect={setSelectedExportFormat} />
                </div>
              </div>
              <div className={`${cp}-export-actions`}>
                <button type="button" className={`${cp}-export-cancel`} onClick={closeExportModal}>Cancelar</button>
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
              const isOpen = openSection === sl.id
              const areaCount = sl.areas.length
              const badgeCount = sl.areas.reduce((sum, a) => sum + a.badges.length, 0)
              const detail = `${areaCount} área${areaCount !== 1 ? 's' : ''} • ${badgeCount} badge${badgeCount !== 1 ? 's' : ''}`

              return (
                <div key={sl.id}>
                  {index > 0 ? <div className={`${cp}-divider`} aria-hidden="true" /> : null}

                  <div className={`${cp}-area-section${isOpen ? ' is-open' : ''}`}>
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

                    {isOpen ? (
                      <div className={`${cp}-area-body`}>
                        {sl.areas.length === 0 ? (
                          <p style={{ padding: '0.5rem 1rem', opacity: 0.6 }}>Sem áreas definidas.</p>
                        ) : (
                          sl.areas.map((area) => (
                            <div key={area.id} className={`${cp}-badge-group`}>
                              <div className={`${cp}-badge-group-title`}>
                                <span>{area.title} - {area.badges.length} badge{area.badges.length !== 1 ? 's' : ''}</span>
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
                    <img
                      alt=""
                      src={selectedBadge.icon}
                      className={`${cp}-detail-badge`}
                      onError={(e) => { e.target.src = imgModalBadge }}
                    />
                  </div>
                  <button type="button" className={`${cp}-detail-close`} onClick={closeBadgeModal} aria-label="Fechar detalhes">
                    <FaTimes aria-hidden="true" />
                  </button>
                </div>

                <div className={`${cp}-detail-copy`}>
                  <div className={`${cp}-detail-title`}>{selectedBadge.title}</div>
                  <div className={`${cp}-detail-attributes`}>
                    <div className={`${cp}-detail-attribute`}>
                      <IconPoints className={`${cp}-detail-attribute-icon`} />
                      <span>{selectedBadge.points} Pontos</span>
                    </div>
                    {selectedBadge.isSpecial ? (
                      <div className={`${cp}-detail-attribute`}>
                        <HiOutlineCurrencyEuro className={`${cp}-detail-attribute-icon`} aria-hidden="true" />
                        <span>Badge Especial</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className={`${cp}-detail-section`}>
                  <h3>Descrição:</h3>
                  <p>{selectedBadge.description || 'Sem descrição disponível.'}</p>
                </div>

                <div className={`${cp}-detail-section`}>
                  <h3>Nível:</h3>
                  <p>{selectedBadge.level}</p>
                </div>

                <div className={`${cp}-detail-section`}>
                  <h3>Requisitos:</h3>
                  {loadingRequisitos ? (
                    <p className={`${cp}-detail-req-loading`}>A carregar requisitos…</p>
                  ) : selectedBadgeRequisitos.length === 0 ? (
                    <p className={`${cp}-detail-req-loading`}>Sem requisitos definidos.</p>
                  ) : (
                    <div className={`${cp}-detail-req-list`}>
                      {selectedBadgeRequisitos.map((req, index) => (
                        <div key={req.id} className={`${cp}-detail-req-item`}>
                          <div className={`${cp}-detail-req-number`}>
                            {req.image ? (
                              <img src={req.image} alt={req.title} />
                            ) : (
                              index + 1
                            )}
                          </div>
                          <div className={`${cp}-detail-req-copy`}>
                            <strong>{req.title}</strong>
                            {req.descricao && <span>{req.descricao}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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