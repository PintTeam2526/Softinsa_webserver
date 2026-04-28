import { useMemo, useState } from 'react'
import { FaSearch, FaUpload } from 'react-icons/fa'
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
  const badgeCount = useMemo(() => badgeGroups.reduce((sum, group) => sum + group.badges.length, 0), [])
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [selectedArea, setSelectedArea] = useState('')

  const areaOptions = badgeGroups.map((group) => group.title.replace('Área: ', ''))

  const selectedGroup = badgeGroups.find((group) => group.title.replace('Área: ', '') === selectedArea)
  const badgesToExport = selectedGroup ? [selectedGroup] : badgeGroups

  function openExportDialog() {
    setShowExportDialog(true)
  }

  function closeExportDialog() {
    setShowExportDialog(false)
  }

  function exportBadges() {
    const headers = ['Area', 'Badge', 'Level', 'Points']
    const rows = badgesToExport.flatMap((group) =>
      group.badges.map((badge) => [group.title.replace('Área: ', ''), badge.name, badge.level, '550'])
    )
    const csv = [headers.join(',')]
      .concat(rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'sll-badges.csv'
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
    closeExportDialog()
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
              <p>{badgeCount} badges disponíveis</p>
            </div>
          </section>

          <section className="sll-badges-toolbar" aria-label="Pesquisa e exportação de badges">
            <label className="sll-badges-search">
              <FaSearch aria-hidden="true" />
              <input type="text" placeholder="Search..." />
            </label>

            <button type="button" className="sll-badges-export-btn" onClick={openExportDialog}>
              <FaUpload aria-hidden="true" />
              <span>Exportar</span>
            </button>
          </section>

          <section className="sll-badges-groups" aria-label="Lista de badges">
            {badgeGroups.map((group) => (
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