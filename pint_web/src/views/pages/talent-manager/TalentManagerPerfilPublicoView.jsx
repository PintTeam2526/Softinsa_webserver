import './TalentManagerPerfilPublicoView.css'
import { useMemo } from 'react'
import '../SLL/SLL-perfil-publico.css'

const profileAvatar = 'https://www.figma.com/api/mcp/asset/791e05ae-1993-432d-aa0a-a906a2c30856'
const badgeEntryLevel = 'https://www.figma.com/api/mcp/asset/41229589-8f50-47c3-8553-3b4939eafc0c'
const badgeTeamLeader = 'https://www.figma.com/api/mcp/asset/b4a91d17-1fb7-4a47-bc42-d9284b60851f'
const badgeDevOps = 'https://www.figma.com/api/mcp/asset/b1a47080-ecc6-400f-b8f3-775875949b31'
const heroCircle1 = 'https://www.figma.com/api/mcp/asset/288fce76-e128-4294-99a0-2da910fa598e'
const heroCircle2 = 'https://www.figma.com/api/mcp/asset/72189645-88a7-49c5-9d57-6e68bd098b5b'
const heroCircle3 = 'https://www.figma.com/api/mcp/asset/cdd091b5-b5e5-4ef4-8207-d871d25984d9'
const heroCircle4 = 'https://www.figma.com/api/mcp/asset/95830a8c-9cec-42b8-9e1c-40587c2a28eb'
const heroCircle5 = 'https://www.figma.com/api/mcp/asset/5736997c-a9f9-48f5-b679-0a4d5b6a8abc'
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
  // This view intentionally reuses SLL styles but does not render SLLSidebar/SLLTopbar
  return (
    <div className="sll-profile-page">
      <main className="sll-profile-main">
        <div className="sll-profile-scroll">
          <section className="sll-profile-hero" aria-label="Perfil público consultor">
            <div className="sll-profile-hero-art" aria-hidden="true">
              <img className="sll-profile-hero-circle sll-profile-hero-circle-5" src={heroCircle5} alt="" />
              <img className="sll-profile-hero-circle sll-profile-hero-circle-4" src={heroCircle4} alt="" />
              <img className="sll-profile-hero-circle sll-profile-hero-circle-3" src={heroCircle3} alt="" />
              <img className="sll-profile-hero-circle sll-profile-hero-circle-2" src={heroCircle2} alt="" />
              <img className="sll-profile-hero-circle sll-profile-hero-circle-1" src={heroCircle1} alt="" />
            </div>

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
              <div className="sll-profile-stat-item">
                <img src={pointsIcon} alt="Pontos" />
                <span>550 Pontos</span>
              </div>
              <div className="sll-profile-stat-item">
                <img src={badgesIcon} alt="Badges obtidos" />
                <span>9 Badges Obtidos</span>
              </div>
              <div className="sll-profile-stat-item">
                <img src={emailIcon} alt="Email" />
                <span>antoniopt@gmail.com</span>
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
