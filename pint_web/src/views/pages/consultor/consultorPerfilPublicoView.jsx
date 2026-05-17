import { useMemo } from 'react'
import './ConsultorPerfilPublicoView.css'

const profileAvatar = 'https://www.figma.com/api/mcp/asset/791e05ae-1993-432d-aa0a-a906a2c30856'
const badgeEntryLevel = 'https://www.figma.com/api/mcp/asset/41229589-8f50-47c3-8553-3b4939eafc0c'
const badgeTeamLeader = 'https://www.figma.com/api/mcp/asset/b4a91d17-1fb7-4a47-bc42-d9284b60851f'
const badgeDevOps = 'https://www.figma.com/api/mcp/asset/b1a47080-ecc6-400f-b8f3-775875949b31'
const pointsIcon = 'https://www.figma.com/api/mcp/asset/04bde155-b1b0-4e83-a0ac-bbe66455a2ac'
const badgesIcon = 'https://www.figma.com/api/mcp/asset/82b97222-c9bc-455b-8ec3-a10e2b83a611'
const emailIcon = 'https://www.figma.com/api/mcp/asset/f04e06a5-1254-43d1-8f09-ba10e5880272'
const badgesHeaderIcon = 'https://www.figma.com/api/mcp/asset/deafc32c-7998-4d73-9605-1647183ccd65'

const badges = [
  { image: badgeEntryLevel, name: 'Citzen Developer', date: '31/12/2025' },
  { image: badgeTeamLeader, name: 'Team Lider Beginner', date: '31/12/2025' },
  { image: badgeDevOps, name: 'DevOps Intermidiate', date: '31/12/2025' },
  { image: badgeEntryLevel, name: 'Citzen Developer', date: '31/12/2025' },
]

function BadgeItem({ image, name, date }) {
  return (
    <div className="sll-profile-badge-item">
      <div className="sll-profile-badge-image">
        <img src={image} alt={name} />
      </div>
      <p>{name}</p>
      <span>{date}</span>
    </div>
  )
}

function ConsultorPerfilPublicoView() {
  const profileStats = useMemo(
    () => [
      { icon: pointsIcon, label: '550 Pontos' },
      { icon: badgesIcon, label: '9 Badges Obtidos' },
      { icon: emailIcon, label: 'antoniopt@gmail.com' },
    ],
    [],
  )

  return (
    <div className="sll-profile-page">
      <main className="sll-profile-main">
        <div className="sll-profile-scroll">
          <section className="sll-profile-hero" aria-label="Perfil público consultor">
            <div className="sll-profile-hero-copy">
              <h1>Perfis Públicos</h1>
              <p>Estamos aqui para te ajudar a melhorar o currículo</p>
            </div>
          </section>

          <section className="sll-profile-card">
            <div className="sll-profile-card-main">
              <div className="sll-profile-avatar">
                <img src={profileAvatar} alt="António Portugal" />
              </div>

              <div className="sll-profile-copy">
                <div className="sll-profile-name-row">
                  <h2>António Portugal</h2>
                  <span className="sll-profile-role-pill">Consultor</span>
                </div>
                <p>Área: LowCode (Outsystems)</p>
                <p>Service Line: Hybrid Cloud</p>
                <p>Learning Path: Jornada Técnica</p>
              </div>
            </div>

            <div className="sll-profile-divider" />

            <div className="sll-profile-stats">
              {profileStats.map((stat) => (
                <div key={stat.label} className="sll-profile-stat-item">
                  <img src={stat.icon} alt={stat.label} />
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="sll-profile-badges-card">
            <div className="sll-profile-badges-header">
              <img src={badgesHeaderIcon} alt="Badges" />
              <h3>Badges Obtidos</h3>
            </div>

            <div className="sll-profile-badges-grid">
              {badges.map((badge, index) => (
                <BadgeItem key={`${badge.name}-${index}`} image={badge.image} name={badge.name} date={badge.date} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default ConsultorPerfilPublicoView