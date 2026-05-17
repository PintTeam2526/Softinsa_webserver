import { FaTimes, FaUpload } from 'react-icons/fa'
import { useState } from 'react'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import './TalentManagerBadgesView.css'
import outsystems1 from '../../../assets/images/badges/outsystems_1.png'
import outsystems2 from '../../../assets/images/badges/outsystems_2.png'
import outsystems3 from '../../../assets/images/badges/outsystems_3.png'
import outsystems4 from '../../../assets/images/badges/outsystems_4.png'
import outsystems5 from '../../../assets/images/badges/outsystems_5.png'
import outsystemsSpecial from '../../../assets/images/badges/outsystems_special.png'
import devops1 from '../../../assets/images/badges/devops_1.png'
import devops2 from '../../../assets/images/badges/devops_2.png'
import devops3 from '../../../assets/images/badges/devops_3.png'
import devops4 from '../../../assets/images/badges/devops_4.png'
import devops5 from '../../../assets/images/badges/devops_5.png'
import devopsSpecial from '../../../assets/images/badges/devops_special.png'
import tm1 from '../../../assets/images/badges/tm_1.png'
import tm2 from '../../../assets/images/badges/tm_2.png'
import tm3 from '../../../assets/images/badges/tm_3.png'
import tm4 from '../../../assets/images/badges/tm_4.png'
import tm5 from '../../../assets/images/badges/tm_5.png'
import tmSpecial from '../../../assets/images/badges/tm_special.png'

function IconPoints({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path d="M4.76567 1.60996C5.47447 1.31826 6.23337 1.16767 6.99984 1.16663C7.76401 1.16663 8.52234 1.31829 9.23401 1.60996C9.93984 1.90163 10.5815 2.33329 11.124 2.87579C11.6665 3.41829 12.0982 4.05996 12.3898 4.76579C12.6815 5.47746 12.8332 6.23579 12.8332 6.99996C12.8332 8.54579 12.2207 10.0333 11.124 11.1241C10.583 11.6666 9.9402 12.0969 9.23245 12.3902C8.5247 12.6835 7.76596 12.8341 6.99984 12.8333C6.23337 12.8322 5.47447 12.6817 4.76567 12.39C4.05871 12.0961 3.4165 11.666 2.87567 11.1241C2.33318 10.5832 1.90293 9.94032 1.60961 9.23257C1.3163 8.52482 1.16572 7.76608 1.16651 6.99996C1.16651 5.45413 1.77901 3.96663 2.87567 2.87579C3.41817 2.33329 4.05984 1.90163 4.76567 1.60996ZM6.99984 9.91663L7.90984 7.92163L9.91651 6.99996L7.90984 6.08996L6.99984 4.08329L6.08401 6.08996L4.08317 6.99996L6.08401 7.92163L6.99984 9.91663Z" fill="#8A92A6" />
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

const outsystemsBadges = [
  { title: 'Citizen developer',    level: 'Nível Junior',          icon: outsystems1 },
  { title: 'Low-Code Builder',     level: 'Nível Intermédio',      icon: outsystems2 },
  { title: 'Application Creator',  level: 'Nível Sénior',          icon: outsystems3 },
  { title: 'Full-Stack Low-Code',  level: 'Nível Especialista',    icon: outsystems4 },
  { title: 'Elite OutSystems',     level: 'Líder de conhecimento', icon: outsystems5 },
]

const devopsBadges = [
  { title: 'DevOps Beginner',      level: 'Nível Junior',          icon: devops1 },
  { title: 'DevOps Intermediate',  level: 'Nível Intermédio',      icon: devops2 },
  { title: 'DevOps Specialist',    level: 'Nível Sénior',          icon: devops3 },
  { title: 'DevOps Expert',        level: 'Nível Especialista',    icon: devops4 },
  { title: 'DevOps Architect',     level: 'Líder de conhecimento', icon: devops5 },
]

const tmBadges = [
  { title: 'Talent Beginner',      level: 'Nível Junior',          icon: tm1 },
  { title: 'Talent Sourcer',       level: 'Nível Intermédio',      icon: tm2 },
  { title: 'Talent Manager',       level: 'Nível Sénior',          icon: tm3 },
  { title: 'Talent Strategist',    level: 'Nível Especialista',    icon: tm4 },
  { title: 'Talent Leader',        level: 'Líder de conhecimento', icon: tm5 },
]
const imgSearch = 'https://www.figma.com/api/mcp/asset/492718ad-8b3c-4cb1-b75f-311c93119dfd'
const imgChevron = 'https://www.figma.com/api/mcp/asset/848d08f5-8f59-4d13-afe5-f69bf9c9060b'
const imgCategory = 'https://www.figma.com/api/mcp/asset/2cafddfc-7f04-4b81-8834-ad8a1afc8516'
const imgGroup = 'https://www.figma.com/api/mcp/asset/1c980bb1-36ba-41dc-aba9-5103d40d9b22'
const imgGroup2 = 'https://www.figma.com/api/mcp/asset/600f9d59-70de-4501-a6e9-fabfcea5222f'
const imgEllipse5 = 'https://www.figma.com/api/mcp/asset/f69dab14-0120-404d-b38a-c3716974273d'
const imgEllipse4 = 'https://www.figma.com/api/mcp/asset/b09d6b9d-08a5-4acb-8d54-c13928775d60'
const imgEllipse3 = 'https://www.figma.com/api/mcp/asset/8afce139-66a4-4e0f-8a2a-dbfea84cefad'
const imgEllipse2 = 'https://www.figma.com/api/mcp/asset/8cbf430c-6968-487b-bd47-da4fe592bb73'
const imgEllipse1 = 'https://www.figma.com/api/mcp/asset/a62526d5-25ef-4809-a07d-a1dc9c9d4492'
const imgIcon = 'https://www.figma.com/api/mcp/asset/3290a61a-5e79-4419-9017-ca9cfaa42001'
const imgReqPoints = 'https://www.figma.com/api/mcp/asset/b7777185-c1de-4b26-b019-6b2d0147dd6c'
const imgReqSpecial = 'https://www.figma.com/api/mcp/asset/e3c31530-d63f-438b-90ea-6b99c6fcc7ed'
const imgModalBadge = 'https://www.figma.com/api/mcp/asset/886d10fd-890a-4f34-b26c-01f949cbf5a6'

const badgeSets = {
  hybrid: [
    { title: 'LowCode (Outsystems)', obtained: 2, badges: outsystemsBadges },
    { title: 'Área 2',               obtained: 1, badges: outsystemsBadges },
    { title: 'Área 3',               obtained: 0, badges: outsystemsBadges },
  ],
  applicationOps: [
    { title: 'Application Ops Core', obtained: 3, badges: devopsBadges },
  ],
  sourcTalentManag: [
    { title: 'Sourc. & Talent',      obtained: 4, badges: tmBadges },
  ],
}

function BadgeCard({ icon, title, level, onClick, cp }) {
  return (
    <button type="button" className={`${cp}-card`} onClick={onClick}>
      <div className={`${cp}-card-icon`}>
        <img alt="" src={icon} />
      </div>

      <div className={`${cp}-card-copy`}>
        <div className={`${cp}-card-title`}>{title}</div>
        <div className={`${cp}-card-level`}>{level}</div>
        <div className={`${cp}-card-points`}>
          <IconPoints className={`${cp}-card-points-icon`} />
          <span>550 Pontos</span>
        </div>
      </div>
    </button>
  )
}

function BadgeMenuItem({ title, detail, active = false, onClick, cp }) {
  return (
    <button type="button" className={`${cp}-menu-item${active ? ' is-active' : ''}`} onClick={onClick}>
      <div className={`${cp}-menu-item-main`}>
        <div className={`${cp}-menu-icon`}>
          <IconAreaMenu className={`${cp}-menu-icon-svg`} />
        </div>

        <div className={`${cp}-menu-copy`}>
          <div className={`${cp}-menu-title`}>{title}</div>
          <div className={`${cp}-menu-detail`}>{detail}</div>
        </div>
      </div>

      <div className={`${cp}-menu-chevron${active ? ' is-open' : ''}`} aria-hidden="true">
        <img alt="" src={imgChevron} />
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

function TalentManagerBadgesView({
  heroTitle = 'Badges',
  heroSubtitle = '80 badges disponíveis',
  showExportButton = true,
  classPrefix = 'tm-badges',
  onBadgeClick = null,
  showTabProgress = false,
} = {}) {
  const [showExport, setShowExport] = useState(false)
  const [selectedBadge, setSelectedBadge] = useState(null)
  const [selectedExportFormat, setSelectedExportFormat] = useState('xlsx')
  const [activeTab, setActiveTab] = useState('Jornada Técnica')
  const [openSection, setOpenSection] = useState('hybrid')

  function handleBadgeClick(badge) {
    if (onBadgeClick) {
      onBadgeClick(badge)
      return
    }
    setSelectedBadge(badge)
  }

  const cp = classPrefix

  const jornadaTotals = Object.values(badgeSets).reduce(
    (acc, sections) => {
      sections.forEach((section) => {
        acc.obtained += section.obtained ?? 0
        acc.total += section.badges.length
      })
      return acc
    },
    { obtained: 0, total: 0 }
  )

  const tabs = [
    {
      label: 'Jornada Técnica',
      progress: jornadaTotals.total ? Math.round((jornadaTotals.obtained / jornadaTotals.total) * 100) : 0,
    },
    {
      label: 'Power Skills',
      progress: 0,
    },
  ]

  const exportRows = Object.entries(badgeSets).flatMap(([areaName, groups]) =>
    groups.flatMap((group) =>
      group.badges.map((badge) => ({
        area: areaName,
        group: group.title,
        badge: badge.title,
        level: badge.level,
        points: '550 Pontos',
      }))
    )
  )

  function closeExportModal() {
    setShowExport(false)
  }

  function handleExport() {
    if (selectedExportFormat === 'pdf') {
      const documentPdf = new jsPDF()
      documentPdf.setFontSize(16)
      documentPdf.text('Badges', 14, 16)

      autoTable(documentPdf, {
        startY: 24,
        head: [['Área', 'Grupo', 'Badge', 'Level', 'Pontos']],
        body: exportRows.map((row) => [row.area, row.group, row.badge, row.level, row.points]),
        styles: { fontSize: 10 },
      })

      documentPdf.save('badges_export.pdf')
      closeExportModal()
      return
    }

    const worksheet = XLSX.utils.json_to_sheet(exportRows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Badges')
    XLSX.writeFile(workbook, 'badges_export.xlsx')
    closeExportModal()
  }

  function toggleSection(sectionKey) {
    setOpenSection((current) => (current === sectionKey ? '' : sectionKey))
  }

  function closeBadgeModal() {
    setSelectedBadge(null)
  }

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
          <p>{heroSubtitle}</p>
        </div>
      </section>

      <section className={`${cp}-content`} aria-label="Badges">
        <div className={`${cp}-toolbar`}>
          <div className={`${cp}-tabs`} role="tablist" aria-label="Categorias de badges">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                type="button"
                className={`${cp}-tab${activeTab === tab.label ? ' is-active' : ''}`}
                role="tab"
                aria-selected={activeTab === tab.label}
                onClick={() => setActiveTab(tab.label)}
              >
                <span className={`${cp}-tab-label`}>{tab.label}</span>
                {showTabProgress ? (
                  <span className={`${cp}-tab-progress`}>Progresso: {tab.progress}%</span>
                ) : null}
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

        {showExport ? (
          <div className={`${cp}-export-backdrop`} role="presentation" onClick={closeExportModal}>
            <div className={`${cp}-export-modal`} role="dialog" aria-modal="true" aria-label="Exportar badges" onClick={(event) => event.stopPropagation()}>
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
                <button type="button" className={`${cp}-export-cancel`} onClick={closeExportModal}>
                  Cancelar
                </button>
                <button type="button" className={`${cp}-export-confirm`} onClick={handleExport}>
                  Exportar
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <div className={`${cp}-areas-card`}>
          <div className={`${cp}-area-section is-open`}>
            <button type="button" className={`${cp}-area-trigger`} onClick={() => toggleSection('hybrid')} aria-expanded={openSection === 'hybrid'}>
              <div className={`${cp}-area-trigger-main`}>
                <div className={`${cp}-area-icon`}>
                  <IconAreaMenu className={`${cp}-area-icon-svg`} />
                </div>

                <div className={`${cp}-area-trigger-copy`}>
                  <strong>Hybrid Cloud</strong>
                  <span>3 áreas • 15 badges</span>
                </div>
              </div>

              <div className={`${cp}-area-chevron${openSection === 'hybrid' ? ' is-open' : ''}`} aria-hidden="true">
                <img alt="" src={imgChevron} />
              </div>
            </button>

            {openSection === 'hybrid' ? (
              <div className={`${cp}-area-body`}>
                {badgeSets.hybrid.map((section) => (
                  <div key={section.title} className={`${cp}-badge-group`}>
                    <div className={`${cp}-badge-group-title`}>{section.title}</div>
                    <div className={`${cp}-badge-grid`}>
                      {section.badges.map((badge) => (
                        <BadgeCard
                          key={`${section.title}-${badge.title}-${badge.level}`}
                          cp={cp}
                          icon={badge.icon}
                          title={badge.title}
                          level={badge.level}
                          onClick={() => handleBadgeClick(badge)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className={`${cp}-divider`} aria-hidden="true" />

          <div className={`${cp}-area-section`}>
            <BadgeMenuItem
              cp={cp}
              title="Application Ops."
              detail="2 áreas • 12 badges"
              active={openSection === 'applicationOps'}
              onClick={() => toggleSection('applicationOps')}
            />

            {openSection === 'applicationOps' ? (
              <div className={`${cp}-area-body`}>
                {badgeSets.applicationOps.map((section) => (
                  <div key={section.title} className={`${cp}-badge-group`}>
                    <div className={`${cp}-badge-group-title`}>{section.title}</div>
                    <div className={`${cp}-badge-grid`}>
                      {section.badges.map((badge) => (
                        <BadgeCard
                          key={`${section.title}-${badge.title}-${badge.level}`}
                          cp={cp}
                          icon={badge.icon}
                          title={badge.title}
                          level={badge.level}
                          onClick={() => handleBadgeClick(badge)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className={`${cp}-divider`} aria-hidden="true" />

          <div className={`${cp}-area-section`}>
            <BadgeMenuItem
              cp={cp}
              title="Sourc. & Talent Manag."
              detail="1 áreas • 6 badges"
              active={openSection === 'sourcTalentManag'}
              onClick={() => toggleSection('sourcTalentManag')}
            />

            {openSection === 'sourcTalentManag' ? (
              <div className={`${cp}-area-body`}>
                {badgeSets.sourcTalentManag.map((section) => (
                  <div key={section.title} className={`${cp}-badge-group`}>
                    <div className={`${cp}-badge-group-title`}>{section.title}</div>
                    <div className={`${cp}-badge-grid`}>
                      {section.badges.map((badge) => (
                        <BadgeCard
                          key={`${section.title}-${badge.title}-${badge.level}`}
                          cp={cp}
                          icon={badge.icon}
                          title={badge.title}
                          level={badge.level}
                          onClick={() => handleBadgeClick(badge)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {selectedBadge ? (
            <div className={`${cp}-detail-backdrop`} role="presentation" onClick={closeBadgeModal}>
              <div className={`${cp}-detail-modal`} role="dialog" aria-modal="true" aria-label="Detalhes do badge" onClick={(event) => event.stopPropagation()}>
                <div className={`${cp}-detail-top`}>
                  <div className={`${cp}-detail-badge-wrap`}>
                    <img alt="" src={selectedBadge.icon || imgModalBadge} className={`${cp}-detail-badge`} />
                  </div>

                  <button type="button" className={`${cp}-detail-close`} onClick={closeBadgeModal} aria-label="Fechar detalhes">
                    <FaTimes aria-hidden="true" />
                  </button>
                </div>

                <div className={`${cp}-detail-copy`}>
                  <div className={`${cp}-detail-title`}>{selectedBadge.title}</div>
                  <div className={`${cp}-detail-points`}>
                    <img alt="" src={imgReqPoints} />
                    <span>100 Pontos</span>
                  </div>
                  <div className={`${cp}-detail-special`}>
                    <img alt="" src={imgReqSpecial} />
                    <span>Badge Especial</span>
                  </div>
                </div>

                <div className={`${cp}-detail-section`}>
                  <h3>Descrição:</h3>
                  <p>Badge de referência com os requisitos necessários para conquista.</p>
                </div>

                <div className={`${cp}-detail-section`}>
                  <h3>Requisitos para o conquistar:</h3>
                  <div className={`${cp}-detail-req-list`}>
                    <div className={`${cp}-detail-req-item`}>
                      <div className={`${cp}-detail-req-text`}>
                        <strong>Requisito 1</strong>
                        <p>Criar um relatório avançado que contenha visualizações interativas</p>
                      </div>
                    </div>
                    <div className={`${cp}-detail-req-item`}>
                      <div className={`${cp}-detail-req-text`}>
                        <strong>Requisito 2</strong>
                        <p>Criar um relatório avançado que contenha visualizações interativas</p>
                      </div>
                    </div>
                    <div className={`${cp}-detail-req-item`}>
                      <div className={`${cp}-detail-req-text`}>
                        <strong>Requisito 3</strong>
                        <p>Criar um relatório avançado que contenha visualizações interativas</p>
                      </div>
                    </div>
                  </div>
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
