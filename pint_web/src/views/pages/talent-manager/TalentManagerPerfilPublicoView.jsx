import { useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  HiOutlineCog6Tooth,
  HiOutlineLockClosed,
  HiOutlineEnvelope,
  HiOutlineCamera,
  HiOutlineChevronRight,
  HiOutlineXMark,
} from 'react-icons/hi2'
import './TalentManagerPerfilPublicoView.css'
import '../shared/profile-settings.css'

const defaultAvatar = 'https://www.figma.com/api/mcp/asset/791e05ae-1993-432d-aa0a-a906a2c30856'
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

function SettingsRow({ Icon, label, description, onClick }) {
  return (
    <button type="button" className="sll-profile-settings-row" onClick={onClick}>
      <span className="sll-profile-settings-icon">
        <Icon aria-hidden="true" />
      </span>
      <span className="sll-profile-settings-copy">
        <strong>{label}</strong>
        <span>{description}</span>
      </span>
      <HiOutlineChevronRight className="sll-profile-settings-chevron" aria-hidden="true" />
    </button>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div className="sll-profile-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="sll-profile-modal"
        role="dialog"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="sll-profile-modal-header">
          <h3>{title}</h3>
          <button
            type="button"
            className="sll-profile-modal-close"
            onClick={onClose}
            aria-label="Fechar"
          >
            <HiOutlineXMark aria-hidden="true" />
          </button>
        </header>
        {children}
      </div>
    </div>
  )
}

function TalentManagerPerfilPublicoView() {
  const location = useLocation()
  const selectedNameFromQuery = new URLSearchParams(location.search).get('name')
  const selectedName = location.state?.name ?? selectedNameFromQuery ?? 'António Portugal'

  // Quando o TM está a visualizar o perfil de outro consultor (via URL/state),
  // não faz sentido mostrar as definições da conta — só aparecem no próprio perfil.
  const isOwnProfile = !selectedNameFromQuery && !location.state?.name

  const [activeModal, setActiveModal] = useState(null)
  const [feedback, setFeedback] = useState('')

  const [email, setEmail] = useState('antoniopt@gmail.com')
  const [avatarUrl, setAvatarUrl] = useState(defaultAvatar)

  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' })
  const [emailForm, setEmailForm] = useState({ next: email, password: '' })
  const [avatarDraft, setAvatarDraft] = useState(avatarUrl)
  const fileInputRef = useRef(null)

  const profile = useMemo(() => ({
    name: selectedName,
    role: 'Consultor',
    area: 'LowCode (Outsystems)',
    serviceLine: 'Hybrid Cloud',
    learningPath: 'Jornada Técnica',
    points: '550 Pontos',
    badges: '9 Badges Obtidos',
    email,
  }), [selectedName, email])

  function openModal(name) {
    setFeedback('')
    if (name === 'email') setEmailForm({ next: email, password: '' })
    if (name === 'image') setAvatarDraft(avatarUrl)
    if (name === 'password') setPasswordForm({ current: '', next: '', confirm: '' })
    setActiveModal(name)
  }

  function closeModal() {
    setActiveModal(null)
  }

  function flashFeedback(message) {
    setFeedback(message)
    window.setTimeout(() => setFeedback(''), 2400)
  }

  function handlePasswordSubmit(event) {
    event.preventDefault()
    const { current, next, confirm } = passwordForm
    if (!current || !next || next !== confirm) return
    closeModal()
    flashFeedback('Password atualizada com sucesso.')
  }

  function handleEmailSubmit(event) {
    event.preventDefault()
    if (!emailForm.next.trim()) return
    setEmail(emailForm.next.trim())
    closeModal()
    flashFeedback('Email atualizado.')
  }

  function handleAvatarFile(event) {
    const [file] = event.target.files || []
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatarDraft(String(reader.result))
    reader.readAsDataURL(file)
  }

  function handleAvatarSubmit(event) {
    event.preventDefault()
    setAvatarUrl(avatarDraft)
    closeModal()
    flashFeedback('Imagem de perfil atualizada.')
  }

  // Esta view reutiliza propositadamente as classes `sll-profile-*` mas não
  // renderiza a sidebar/topbar do SLL.
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

          {feedback ? (
            <div className="sll-profile-feedback" role="status">
              {feedback}
            </div>
          ) : null}

          <section className="sll-profile-card">
            <div className="sll-profile-card-main">
              <div className="sll-profile-avatar">
                <img src={avatarUrl} alt={profile.name} />
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

          {isOwnProfile ? (
            <section className="sll-profile-settings-card" aria-label="Definições da conta">
              <header className="sll-profile-settings-header">
                <HiOutlineCog6Tooth aria-hidden="true" />
                <h3>Definições da conta</h3>
              </header>

              <div className="sll-profile-settings-list">
                <SettingsRow
                  Icon={HiOutlineLockClosed}
                  label="Alterar password"
                  description="Atualiza a tua password de acesso"
                  onClick={() => openModal('password')}
                />
                <SettingsRow
                  Icon={HiOutlineEnvelope}
                  label="Alterar email"
                  description={email}
                  onClick={() => openModal('email')}
                />
                <SettingsRow
                  Icon={HiOutlineCamera}
                  label="Trocar imagem de perfil"
                  description="Carrega uma nova fotografia"
                  onClick={() => openModal('image')}
                />
              </div>
            </section>
          ) : null}

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

      {activeModal === 'password' ? (
        <Modal title="Alterar password" onClose={closeModal}>
          <form className="sll-profile-form" onSubmit={handlePasswordSubmit}>
            <label className="sll-profile-field">
              <span>Password atual</span>
              <input
                type="password"
                value={passwordForm.current}
                onChange={(event) => setPasswordForm({ ...passwordForm, current: event.target.value })}
                required
              />
            </label>
            <label className="sll-profile-field">
              <span>Nova password</span>
              <input
                type="password"
                value={passwordForm.next}
                onChange={(event) => setPasswordForm({ ...passwordForm, next: event.target.value })}
                minLength={6}
                required
              />
            </label>
            <label className="sll-profile-field">
              <span>Confirmar nova password</span>
              <input
                type="password"
                value={passwordForm.confirm}
                onChange={(event) => setPasswordForm({ ...passwordForm, confirm: event.target.value })}
                required
              />
              {passwordForm.confirm && passwordForm.confirm !== passwordForm.next ? (
                <small className="sll-profile-field-error">As passwords não coincidem.</small>
              ) : null}
            </label>
            <div className="sll-profile-modal-actions">
              <button type="button" className="sll-profile-btn-secondary" onClick={closeModal}>
                Cancelar
              </button>
              <button type="submit" className="sll-profile-btn-primary">
                Guardar
              </button>
            </div>
          </form>
        </Modal>
      ) : null}

      {activeModal === 'email' ? (
        <Modal title="Alterar email" onClose={closeModal}>
          <form className="sll-profile-form" onSubmit={handleEmailSubmit}>
            <label className="sll-profile-field">
              <span>Novo email</span>
              <input
                type="email"
                value={emailForm.next}
                onChange={(event) => setEmailForm({ ...emailForm, next: event.target.value })}
                required
              />
            </label>
            <label className="sll-profile-field">
              <span>Password (confirmação)</span>
              <input
                type="password"
                value={emailForm.password}
                onChange={(event) => setEmailForm({ ...emailForm, password: event.target.value })}
                required
              />
            </label>
            <div className="sll-profile-modal-actions">
              <button type="button" className="sll-profile-btn-secondary" onClick={closeModal}>
                Cancelar
              </button>
              <button type="submit" className="sll-profile-btn-primary">
                Guardar
              </button>
            </div>
          </form>
        </Modal>
      ) : null}

      {activeModal === 'image' ? (
        <Modal title="Trocar imagem de perfil" onClose={closeModal}>
          <form className="sll-profile-form" onSubmit={handleAvatarSubmit}>
            <div className="sll-profile-avatar-preview">
              <img src={avatarDraft || defaultAvatar} alt="Pré-visualização" />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarFile}
              className="sll-profile-file-hidden"
            />
            <button
              type="button"
              className="sll-profile-btn-secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              Escolher ficheiro…
            </button>
            <label className="sll-profile-field">
              <span>ou cola um link para a imagem</span>
              <input
                type="url"
                value={avatarDraft.startsWith('data:') ? '' : avatarDraft}
                onChange={(event) => setAvatarDraft(event.target.value)}
                placeholder="https://…"
              />
            </label>
            <div className="sll-profile-modal-actions">
              <button type="button" className="sll-profile-btn-secondary" onClick={closeModal}>
                Cancelar
              </button>
              <button type="submit" className="sll-profile-btn-primary">
                Guardar
              </button>
            </div>
          </form>
        </Modal>
      ) : null}
    </div>
  )
}

export default TalentManagerPerfilPublicoView
