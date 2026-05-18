import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import './TalentManagerPerfilPublicoView.css'

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

function TalentManagerPerfilPublicoView() {
  const location = useLocation()
  const selectedNameFromQuery = new URLSearchParams(location.search).get('name')
  const selectedName = location.state?.name ?? selectedNameFromQuery ?? 'António Portugal'

  const profile = useMemo(() => ({
    name: selectedName,
    role: 'Consultor',
    area: 'LowCode (Outsystems)',
    serviceLine: 'Hybrid Cloud',
    learningPath: 'Jornada Técnica',
    points: '550 Pontos',
    badges: '9 Badges Obtidos',
    email: 'antoniopt@gmail.com',
  }), [selectedName])

  // This view intentionally reuses SLL styles but does not render SLLSidebar/SLLTopbar
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
                <img src={profileAvatar} alt={profile.name} />
              </div>

              <div className="sll-profile-copy">
                <div className="sll-profile-name-row">
                  <h2>{profile.name}</h2>
                  <span className="sll-profile-role-pill">{profile.role}</span>
                </div>
                <p>Área: {profile.area}</p>
                <p>Service Line: {profile.serviceLine}</p>
                <p>Learning Path: {profile.learningPath}</p>
              </div>
            </div>

            <div className="sll-profile-divider" />

            <div className="sll-profile-stats">
              <div className="sll-profile-stat-item">
                <img src={pointsIcon} alt="Pontos" />
                <span>{profile.points}</span>
              </div>
              <div className="sll-profile-stat-item">
                <img src={badgesIcon} alt="Badges obtidos" />
                <span>{profile.badges}</span>
              </div>
              <div className="sll-profile-stat-item">
                <img src={emailIcon} alt="Email" />
                <span>{profile.email}</span>
              </div>
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

export default TalentManagerPerfilPublicoView
