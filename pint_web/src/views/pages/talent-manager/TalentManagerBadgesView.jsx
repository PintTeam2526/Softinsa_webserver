import { FaTimes, FaUpload } from 'react-icons/fa'
import { useState } from 'react'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import './TalentManagerBadgesView.css'

const badgeJuniorCitizenDeveloper = 'https://www.figma.com/api/mcp/asset/fe31d5ae-9470-42b7-8700-e51e15feb53f'
const badgeIntermedioLowCodeBuilder = 'https://www.figma.com/api/mcp/asset/36d8a1c8-b264-42e2-93d1-2ea65b258326'
const badgeSeniorApplicationCreator = 'https://www.figma.com/api/mcp/asset/0392c8ce-5868-4fad-b9c3-b0606588109d'
const badgeEspecialistaFullStackLowCodeDev = 'https://www.figma.com/api/mcp/asset/dab477cd-00d4-42c0-8f58-2105e5b0d3fc'
const badgeLiderDeConhecimentoEliteOutSystemsArchitect = 'https://www.figma.com/api/mcp/asset/e7e007cb-5ff0-4028-b924-11d6dcf1d1c2'
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
    {
      title: 'LowCode (Outsystems)',
      badges: [
        { title: 'Citizen developer', level: 'Nível Junior', icon: badgeJuniorCitizenDeveloper },
        { title: 'Low-Code Builder', level: 'Nível Intermédio', icon: badgeIntermedioLowCodeBuilder },
        { title: 'Application Creator', level: 'Nível Sénior', icon: badgeSeniorApplicationCreator },
        { title: 'Full-Stack Low-Code', level: 'Nível Especialista', icon: badgeEspecialistaFullStackLowCodeDev },
        { title: 'Elite OutSystems', level: 'Líder de conhecimento', icon: badgeLiderDeConhecimentoEliteOutSystemsArchitect },
      ],
    },
    {
      title: 'Área 2',
      badges: [
        { title: 'Low-Code Builder', level: 'Nível Junior', icon: badgeJuniorCitizenDeveloper },
        { title: 'Low-Code Builder', level: 'Nível Intermédio', icon: badgeIntermedioLowCodeBuilder },
        { title: 'Application Creator', level: 'Nível Sénior', icon: badgeSeniorApplicationCreator },
        { title: 'Full-Stack Low-Code', level: 'Nível Especialista', icon: badgeEspecialistaFullStackLowCodeDev },
        { title: 'Elite OutSystems', level: 'Líder de conhecimento', icon: badgeLiderDeConhecimentoEliteOutSystemsArchitect },
      ],
    },
    {
      title: 'Área 3',
      badges: [
        { title: 'Low-Code Builder', level: 'Nível Junior', icon: badgeJuniorCitizenDeveloper },
        { title: 'Low-Code Builder', level: 'Nível Intermédio', icon: badgeIntermedioLowCodeBuilder },
        { title: 'Application Creator', level: 'Nível Sénior', icon: badgeSeniorApplicationCreator },
        { title: 'Full-Stack Low-Code', level: 'Nível Especialista', icon: badgeEspecialistaFullStackLowCodeDev },
        { title: 'Elite OutSystems', level: 'Líder de conhecimento', icon: badgeLiderDeConhecimentoEliteOutSystemsArchitect },
      ],
    },
  ],
  applicationOps: [
    {
      title: 'Application Ops Core',
      badges: [
        { title: 'Citizen developer', level: 'Nível Junior', icon: badgeJuniorCitizenDeveloper },
        { title: 'Low-Code Builder', level: 'Nível Intermédio', icon: badgeIntermedioLowCodeBuilder },
        { title: 'Application Creator', level: 'Nível Sénior', icon: badgeSeniorApplicationCreator },
        { title: 'Full-Stack Low-Code', level: 'Nível Especialista', icon: badgeEspecialistaFullStackLowCodeDev },
        { title: 'Elite OutSystems', level: 'Líder de conhecimento', icon: badgeLiderDeConhecimentoEliteOutSystemsArchitect },
      ],
    },
  ],
  sourcTalentManag: [
    {
      title: 'Sourc. & Talent',
      badges: [
        { title: 'Citizen developer', level: 'Nível Junior', icon: badgeJuniorCitizenDeveloper },
        { title: 'Low-Code Builder', level: 'Nível Intermédio', icon: badgeIntermedioLowCodeBuilder },
        { title: 'Application Creator', level: 'Nível Sénior', icon: badgeSeniorApplicationCreator },
        { title: 'Full-Stack Low-Code', level: 'Nível Especialista', icon: badgeEspecialistaFullStackLowCodeDev },
        { title: 'Elite OutSystems', level: 'Líder de conhecimento', icon: badgeLiderDeConhecimentoEliteOutSystemsArchitect },
      ],
    },
  ],
}

function BadgeCard({ icon, title, level, onClick }) {
  return (
    <button type="button" className="tm-badges-card" onClick={onClick}>
      <div className="tm-badges-card-icon">
        <img alt="" src={icon} />
      </div>

      <div className="tm-badges-card-copy">
        <div className="tm-badges-card-title">{title}</div>
        <div className="tm-badges-card-level">{level}</div>
        <div className="tm-badges-card-points">
          <span className="tm-badges-card-points-icon" aria-hidden="true" />
          <span>550 Pontos</span>
        </div>
      </div>
    </button>
  )
}

function BadgeMenuItem({ title, detail, icon, active = false, onClick }) {
  return (
    <button type="button" className={`tm-badges-menu-item${active ? ' is-active' : ''}`} onClick={onClick}>
      <div className="tm-badges-menu-item-main">
        <div className="tm-badges-menu-icon">
          <img alt="" src={icon} />
        </div>

        <div className="tm-badges-menu-copy">
          <div className="tm-badges-menu-title">{title}</div>
          <div className="tm-badges-menu-detail">{detail}</div>
        </div>
      </div>

      <div className={`tm-badges-menu-chevron${active ? ' is-open' : ''}`} aria-hidden="true">
        <img alt="" src={imgChevron} />
      </div>
    </button>
  )
}

function ExportFormatOption({ label, value, selected, onSelect }) {
  return (
    <button type="button" className="tm-badges-export-option" onClick={() => onSelect(value)} aria-pressed={selected}>
      <span className={`tm-badges-export-option-toggle${selected ? ' is-selected' : ''}`} aria-hidden="true">
        {selected ? <span className="tm-badges-export-option-dot" /> : null}
      </span>
      <span>{label}</span>
    </button>
  )
}

function TalentManagerBadgesView() {
  const [showExport, setShowExport] = useState(false)
  const [selectedBadge, setSelectedBadge] = useState(null)
  const [selectedExportFormat, setSelectedExportFormat] = useState('xlsx')
  const [activeTab, setActiveTab] = useState('Jornada Técnica')
  const [openSection, setOpenSection] = useState('hybrid')

  const tabs = ['Jornada Técnica', 'Power Skills']

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
    <div className="tm-badges-page">
      <section className="tm-badges-banner">
        <div className="tm-badges-banner-art" aria-hidden="true">
          <img className="tm-badges-banner-circle tm-badges-banner-circle-5" src={imgEllipse5} alt="" />
          <img className="tm-badges-banner-circle tm-badges-banner-circle-4" src={imgEllipse4} alt="" />
          <img className="tm-badges-banner-circle tm-badges-banner-circle-3" src={imgEllipse3} alt="" />
          <img className="tm-badges-banner-circle tm-badges-banner-circle-2" src={imgEllipse2} alt="" />
          <img className="tm-badges-banner-circle tm-badges-banner-circle-1" src={imgEllipse1} alt="" />
        </div>

        <div className="tm-badges-banner-copy">
          <h1>Badges</h1>
          <p>80 badges disponíveis</p>
        </div>
      </section>

      <section className="tm-badges-content" aria-label="Badges">
        <div className="tm-badges-toolbar">
          <div className="tm-badges-tabs" role="tablist" aria-label="Categorias de badges">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`tm-badges-tab${activeTab === tab ? ' is-active' : ''}`}
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <button type="button" className="tm-badges-export-btn" onClick={() => setShowExport(true)}>
            <FaUpload aria-hidden="true" className="tm-badges-export-icon" />
            <span>Exportar</span>
          </button>
        </div>

        {showExport ? (
          <div className="tm-badges-export-backdrop" role="presentation" onClick={closeExportModal}>
            <div className="tm-badges-export-modal" role="dialog" aria-modal="true" aria-label="Exportar badges" onClick={(event) => event.stopPropagation()}>
              <div className="tm-badges-export-header">
                <h2>Exportar</h2>
                <button type="button" className="tm-badges-export-close" onClick={closeExportModal} aria-label="Fechar exportação">
                  <FaTimes aria-hidden="true" />
                </button>
              </div>

              <div className="tm-badges-export-body">
                <h3>Formato de exportação</h3>
                <p>Escolha o formato que pretende descarregar.</p>

                <div className="tm-badges-export-options">
                  <ExportFormatOption label="Excel (.xlsx)" value="xlsx" selected={selectedExportFormat === 'xlsx'} onSelect={setSelectedExportFormat} />
                  <ExportFormatOption label="PDF (.pdf)" value="pdf" selected={selectedExportFormat === 'pdf'} onSelect={setSelectedExportFormat} />
                </div>
              </div>

              <div className="tm-badges-export-actions">
                <button type="button" className="tm-badges-export-cancel" onClick={closeExportModal}>
                  Cancelar
                </button>
                <button type="button" className="tm-badges-export-confirm" onClick={handleExport}>
                  Exportar
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <div className="tm-badges-areas-card">
          <div className="tm-badges-area-section is-open">
            <button type="button" className="tm-badges-area-trigger" onClick={() => toggleSection('hybrid')} aria-expanded={openSection === 'hybrid'}>
              <div className="tm-badges-area-trigger-main">
                <div className="tm-badges-area-icon">
                  <img alt="" src={imgIcon} />
                </div>

                <div className="tm-badges-area-trigger-copy">
                  <strong>Hybrid Cloud</strong>
                  <span>3 áreas • 15 badges</span>
                </div>
              </div>

              <div className={`tm-badges-area-chevron${openSection === 'hybrid' ? ' is-open' : ''}`} aria-hidden="true">
                <img alt="" src={imgChevron} />
              </div>
            </button>

            {openSection === 'hybrid' ? (
              <div className="tm-badges-area-body">
                {badgeSets.hybrid.map((section) => (
                  <div key={section.title} className="tm-badges-badge-group">
                    <div className="tm-badges-badge-group-title">{section.title}</div>
                    <div className="tm-badges-badge-grid">
                      {section.badges.map((badge) => (
                        <BadgeCard
                          key={`${section.title}-${badge.title}-${badge.level}`}
                          icon={badge.icon}
                          title={badge.title}
                          level={badge.level}
                          onClick={() => setSelectedBadge(badge)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="tm-badges-divider" aria-hidden="true" />

          <div className="tm-badges-area-section">
            <BadgeMenuItem
              title="Application Ops."
              detail="2 áreas • 12 badges"
              icon={imgCategory}
              active={openSection === 'applicationOps'}
              onClick={() => toggleSection('applicationOps')}
            />

            {openSection === 'applicationOps' ? (
              <div className="tm-badges-area-body">
                {badgeSets.applicationOps.map((section) => (
                  <div key={section.title} className="tm-badges-badge-group">
                    <div className="tm-badges-badge-group-title">{section.title}</div>
                    <div className="tm-badges-badge-grid">
                      {section.badges.map((badge) => (
                        <BadgeCard
                          key={`${section.title}-${badge.title}-${badge.level}`}
                          icon={badge.icon}
                          title={badge.title}
                          level={badge.level}
                          onClick={() => setSelectedBadge(badge)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="tm-badges-divider" aria-hidden="true" />

          <div className="tm-badges-area-section">
            <BadgeMenuItem
              title="Sourc. & Talent Manag."
              detail="1 áreas • 6 badges"
              icon={imgGroup2}
              active={openSection === 'sourcTalentManag'}
              onClick={() => toggleSection('sourcTalentManag')}
            />

            {openSection === 'sourcTalentManag' ? (
              <div className="tm-badges-area-body">
                {badgeSets.sourcTalentManag.map((section) => (
                  <div key={section.title} className="tm-badges-badge-group">
                    <div className="tm-badges-badge-group-title">{section.title}</div>
                    <div className="tm-badges-badge-grid">
                      {section.badges.map((badge) => (
                        <BadgeCard
                          key={`${section.title}-${badge.title}-${badge.level}`}
                          icon={badge.icon}
                          title={badge.title}
                          level={badge.level}
                          onClick={() => setSelectedBadge(badge)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {selectedBadge ? (
            <div className="tm-badges-detail-backdrop" role="presentation" onClick={closeBadgeModal}>
              <div className="tm-badges-detail-modal" role="dialog" aria-modal="true" aria-label="Detalhes do badge" onClick={(event) => event.stopPropagation()}>
                <div className="tm-badges-detail-top">
                  <div className="tm-badges-detail-badge-wrap">
                    <img alt="" src={selectedBadge.icon || imgModalBadge} className="tm-badges-detail-badge" />
                  </div>

                  <button type="button" className="tm-badges-detail-close" onClick={closeBadgeModal} aria-label="Fechar detalhes">
                    <FaTimes aria-hidden="true" />
                  </button>
                </div>

                <div className="tm-badges-detail-copy">
                  <div className="tm-badges-detail-title">{selectedBadge.title}</div>
                  <div className="tm-badges-detail-points">
                    <img alt="" src={imgReqPoints} />
                    <span>100 Pontos</span>
                  </div>
                  <div className="tm-badges-detail-special">
                    <img alt="" src={imgReqSpecial} />
                    <span>Badge Especial</span>
                  </div>
                </div>

                <div className="tm-badges-detail-section">
                  <h3>Descrição:</h3>
                  <p>Badge de referência com os requisitos necessários para conquista.</p>
                </div>

                <div className="tm-badges-detail-section">
                  <h3>Requisitos para o conquistar:</h3>
                  <div className="tm-badges-detail-req-list">
                    <div className="tm-badges-detail-req-item">
                      <div className="tm-badges-detail-req-text">
                        <strong>Requisito 1</strong>
                        <p>Criar um relatório avançado que contenha visualizações interativas</p>
                      </div>
                    </div>
                    <div className="tm-badges-detail-req-item">
                      <div className="tm-badges-detail-req-text">
                        <strong>Requisito 2</strong>
                        <p>Criar um relatório avançado que contenha visualizações interativas</p>
                      </div>
                    </div>
                    <div className="tm-badges-detail-req-item">
                      <div className="tm-badges-detail-req-text">
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