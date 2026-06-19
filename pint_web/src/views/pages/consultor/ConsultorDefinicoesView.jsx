import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HiOutlineCog6Tooth,
  HiOutlineLockClosed,
  HiOutlineEnvelope,
  HiOutlineMapPin,
  HiOutlineCamera,
  HiOutlineChevronRight,
  HiOutlineXMark,
  HiOutlineDocumentText,
  HiOutlineArrowRightOnRectangle
} from 'react-icons/hi2'
import { Row, Col } from 'react-bootstrap'
import './ConsultorDefinicoesView.css'
import '../shared/profile-settings.css'

import { clearToken } from '../../../services/auth'

import { getConsultor, updatemeUtilizador } from '../../../controllers/utilizadoresController'
import { getAreas } from '../../../controllers/areasController'
import { getRGPD } from '../../../controllers/gestaoController'


function resolveImagem(raw) {
  if (!raw) return null

  // Sequelize pode devolver BLOB como { type: 'Buffer', data: [...] }
  if (raw?.type === 'Buffer' && Array.isArray(raw?.data)) {
    const binary = raw.data.reduce((acc, byte) => acc + String.fromCharCode(byte), '')
    raw = btoa(binary)
  }

  if (typeof raw !== 'string') return null

  // Já é data URI ou URL externo — devolve tal qual
  if (raw.startsWith('data:') || raw.startsWith('http')) return raw

  // Detecta o tipo pela assinatura Base64
  let mime = 'image/jpeg' // fallback
  if (raw.startsWith('iVBOR')) mime = 'image/png'
  else if (raw.startsWith('R0lG')) mime = 'image/gif'
  else if (raw.startsWith('UklG')) mime = 'image/webp'
  else if (raw.startsWith('PHN2')) mime = 'image/svg+xml'

  return `data:${mime};base64,${raw}`
}

// ─── Componentes auxiliares ───────────────────────────────────────────────────
function BadgeItem({ imagem, nome, data }) {
  const dataFormatada = data
    ? new Date(data).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '—'

  return (
    <div className="sll-profile-badge-item">
      <div className="sll-profile-badge-image">
        <img src={imagem} alt={nome} />
      </div>
      <p>{nome}</p>
      <span>{dataFormatada}</span>
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
        onClick={(e) => e.stopPropagation()}
      >
        <header className="sll-profile-modal-header">
          <h3>{title}</h3>
          <button type="button" className="sll-profile-modal-close" onClick={onClose} aria-label="Fechar">
            <HiOutlineXMark aria-hidden="true" />
          </button>
        </header>
        {children}
      </div>
    </div>
  )
}

function RgpdConsentModal({ politica, onAccept, onReject }) {
  const [checked, setChecked] = useState(false)
  const [error, setError] = useState('')

  const handleAccept = () => {
    if (!checked) { setError('Para continuar, aceite a política.'); return }
    onAccept()
  }

  const handleReject = () => {
    setChecked(false)
    setError('Sem aceitação não é possível concluir o primeiro acesso.')
    onReject()
  }

  return (
    <div className="sll-profile-modal-backdrop" role="presentation">
      <div className="sll-profile-modal" role="dialog" aria-label="Aceitação de termos RGPD">
        <header className="sll-profile-modal-header">
          <h3>Aceitação de termos</h3>
        </header>

        <p>Primeiro acesso detetado. Para continuar no portal, confirme a política abaixo.</p>

        <div className="sll-profile-rgpd-policy">{politica}</div>

        <label className="sll-profile-rgpd-consent-item">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => { setChecked(e.target.checked); if (error) setError('') }}
          />
          <span>Li e aceito as políticas RGPD.</span>
        </label>

        {error ? <p className="sll-profile-rgpd-error">{error}</p> : null}

        <div className="sll-profile-modal-actions">
          <button type="button" className="sll-profile-btn-secondary" onClick={handleReject}>
            Recusar
          </button>
          <button
            type="button"
            className={`sll-profile-btn-primary${!checked ? ' is-disabled' : ''}`}
            onClick={handleAccept}
            disabled={!checked}
          >
            Aceitar e continuar
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── View principal ───────────────────────────────────────────────────────────
function ConsultorDefinicoesView() {
  const navigate = useNavigate()

  // Dados do perfil
  const [perfil, setPerfil] = useState(null)
  const [areas, setAreas] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // RGPD
  const [rgpdPolitica, setRgpdPolitica] = useState(null)

  // UI
  const [activeModal, setActiveModal] = useState(null)
  const [feedback, setFeedback] = useState({ message: '', type: 'success' })
  const [isSaving, setIsSaving] = useState(false)

  // Formulários dos modais
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' })
  const [emailForm, setEmailForm] = useState({ next: '', password: '' })
  const [areaDraft, setAreaDraft] = useState('')
  const [avatarDraft, setAvatarDraft] = useState('')
  const fileInputRef = useRef(null)

  // Carrega perfil e RGPD em paralelo
  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const [consultorData, rgpdData, areasData] = await Promise.all([
          getConsultor(),
          getRGPD(),
          getAreas(),
        ])
        setPerfil(consultorData)
        setAreas(areasData ?? [])
        setEmailForm((prev) => ({ ...prev, next: consultorData?.email ?? '' }))
        setAreaDraft(consultorData?.id_area ?? '')
        setAvatarDraft(consultorData?.foto ?? '')
        setRgpdPolitica(rgpdData?.politica ?? '')
      } catch {
        flashFeedback('Erro ao carregar os dados do perfil.', 'error')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const profileStats = useMemo(() => {
    if (!perfil) return []
    return [
      { label: `${perfil.total_pontos ?? 0} Pontos` },
      { label: `${perfil.total_badges ?? 0} Badges Obtidos` },
      { label: perfil.email ?? '' },
    ]
  }, [perfil])

  // ── Helpers ────────────────────────────────────────────────────────────────
  function openModal(name) {
    setFeedback({ message: '', type: 'success' })
    if (name === 'email') setEmailForm({ next: perfil?.email ?? '', password: '' })
    if (name === 'area') setAreaDraft(perfil?.id_area ?? '')
    if (name === 'image') setAvatarDraft(perfil?.foto ?? '')
    if (name === 'password') setPasswordForm({ current: '', next: '', confirm: '' })
    setActiveModal(name)
  }

  function closeModal() { setActiveModal(null) }

  function flashFeedback(message, type = 'success') {
    setFeedback({ message, type })
    window.setTimeout(() => setFeedback({ message: '', type: 'success' }), 2400)
  }

  async function saveUpdate(payload, successMsg) {
    setIsSaving(true)
    try {
      await updatemeUtilizador(payload)
      // Backend devolve apenas { mensagem }, por isso refetch para reflectir as alterações
      const updated = await getConsultor()
      setPerfil(updated)
      closeModal()
      flashFeedback(successMsg)
    } catch {
      flashFeedback('Não foi possível guardar as alterações.', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  // ── Handlers dos modais ────────────────────────────────────────────────────
  async function handlePasswordSubmit(e) {
    e.preventDefault()
    const { current, next, confirm } = passwordForm
    if (!current || !next || next !== confirm) return
    await saveUpdate({ password: next, password_antiga: current }, 'Password atualizada com sucesso.')
  }

  async function handleEmailSubmit(e) {
    e.preventDefault()
    if (!emailForm.next.trim()) return
    await saveUpdate({ email: emailForm.next.trim() }, 'Email atualizado.')
  }

  async function handleAreaSubmit(e) {
    e.preventDefault()
    await saveUpdate({ id_area: Number(areaDraft) }, 'Área de preferência atualizada.')
  }

  function handleAvatarFile(e) {
    const [file] = e.target.files || []
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatarDraft(String(reader.result))
    reader.readAsDataURL(file)
  }

  async function handleAvatarSubmit(e) {
    e.preventDefault()
    await saveUpdate({ foto: avatarDraft }, 'Imagem de perfil atualizada.')
  }

  function handleLogout() {
    clearToken()
    navigate('/')
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="sll-profile-page">
        <main className="sll-profile-main">
          <div className="sll-profile-loading" aria-live="polite">A carregar perfil…</div>
        </main>
      </div>
    )
  }

  return (
    <div className="sll-profile-page">
      <main className="sll-profile-main">
        <div className="sll-profile-scroll">
          <section className="sll-profile-hero" aria-label="Perfil público consultor">
            <div className="sll-profile-hero-copy">
              <h1>Perfil Público</h1>
              <p>Estamos aqui para te ajudar a melhorar o currículo</p>
            </div>
          </section>

          {feedback.message ? (
            <div
              className={`sll-profile-feedback sll-profile-feedback--${feedback.type}`}
              role="status"
            >
              {feedback.message}
            </div>
          ) : null}

          <section className="sll-profile-card d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center">
            <div className="sll-profile-card-main">
              <div className="sll-profile-avatar">
                <img src={resolveImagem(perfil?.foto)} alt={perfil?.nome} />
              </div>
              <div className="sll-profile-copy">
                <div className="sll-profile-name-row">
                  <h2>{perfil?.nome}</h2>
                  <span className="sll-profile-role-pill">Consultor</span>
                </div>
                <p>Área: {perfil?.area}</p>
                <p>Service Line: {perfil?.service_line}</p>
                <p>Learning Path: {perfil?.learning_path}</p>
              </div>
            </div>

            <div className="vr d-none d-lg-block" />
            <hr className="d-lg-none w-100 m-0" />

            <div className="sll-profile-stats">
              {profileStats.map((stat) => (
                <div key={stat.label} className="sll-profile-stat-item">
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </section>

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
                description={perfil?.email}
                onClick={() => openModal('email')}
              />
              <SettingsRow
                Icon={HiOutlineMapPin}
                label="Área de preferência"
                description={perfil?.area}
                onClick={() => openModal('area')}
              />
              <SettingsRow
                Icon={HiOutlineCamera}
                label="Trocar imagem de perfil"
                description="Carrega uma nova fotografia"
                onClick={() => openModal('image')}
              />
              <SettingsRow
                Icon={HiOutlineDocumentText}
                label="Política de privacidade (RGPD)"
                description="Consulta os termos de privacidade aceites"
                onClick={() => openModal('rgpd')}
              />
              <SettingsRow
                Icon={HiOutlineArrowRightOnRectangle}
                label="Terminar sessão"
                description="Sair da aplicação"
                onClick={handleLogout}
              />
            </div>
          </section>

          {perfil?.badges?.length > 0 ? (
            <section className="sll-profile-badges-card">
              <div className="sll-profile-badges-header">
                <h3>Badges Obtidos</h3>
              </div>
              <Row className="row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
                {perfil.badges.map((badge, i) => (
                  <Col key={`${badge.nome}-${i}`}>
                    <BadgeItem imagem={resolveImagem(badge.imagem)} nome={badge.nome} data={badge.data_conclusao} />
                  </Col>
                ))}
              </Row>
            </section>
          ) : null}
        </div>
      </main>

      {/* ── Modais de definições ─────────────────────────────────────────────── */}
      {activeModal === 'password' ? (
        <Modal title="Alterar password" onClose={closeModal}>
          <form className="sll-profile-form" onSubmit={handlePasswordSubmit}>
            <label className="sll-profile-field">
              <span>Password atual</span>
              <input
                type="password"
                value={passwordForm.current}
                onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                required
              />
            </label>
            <label className="sll-profile-field">
              <span>Nova password</span>
              <input
                type="password"
                value={passwordForm.next}
                onChange={(e) => setPasswordForm({ ...passwordForm, next: e.target.value })}
                minLength={6}
                required
              />
            </label>
            <label className="sll-profile-field">
              <span>Confirmar nova password</span>
              <input
                type="password"
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                required
              />
              {passwordForm.confirm && passwordForm.confirm !== passwordForm.next ? (
                <small className="sll-profile-field-error">As passwords não coincidem.</small>
              ) : null}
            </label>
            <div className="sll-profile-modal-actions">
              <button type="button" className="sll-profile-btn-secondary" onClick={closeModal} disabled={isSaving}>
                Cancelar
              </button>
              <button type="submit" className="sll-profile-btn-primary" disabled={isSaving}>
                {isSaving ? 'A guardar…' : 'Guardar'}
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
                onChange={(e) => setEmailForm({ ...emailForm, next: e.target.value })}
                required
              />
            </label>
            <label className="sll-profile-field">
              <span>Password (confirmação)</span>
              <input
                type="password"
                value={emailForm.password}
                onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
                required
              />
            </label>
            <div className="sll-profile-modal-actions">
              <button type="button" className="sll-profile-btn-secondary" onClick={closeModal} disabled={isSaving}>
                Cancelar
              </button>
              <button type="submit" className="sll-profile-btn-primary" disabled={isSaving}>
                {isSaving ? 'A guardar…' : 'Guardar'}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}

      {activeModal === 'area' ? (
        <Modal title="Área de preferência" onClose={closeModal}>
          <form className="sll-profile-form" onSubmit={handleAreaSubmit}>
            <label className="sll-profile-field">
              <span>Seleciona a tua área de preferência</span>
              <select
                value={areaDraft}
                onChange={(e) => setAreaDraft(e.target.value)}
                required
              >
                <option value="" disabled>Escolhe uma área…</option>
                {areas.map((area) => (
                  <option key={area.id_area} value={area.id_area}>
                    {area.nome_area}
                  </option>
                ))}
              </select>
            </label>
            <div className="sll-profile-modal-actions">
              <button type="button" className="sll-profile-btn-secondary" onClick={closeModal} disabled={isSaving}>
                Cancelar
              </button>
              <button type="submit" className="sll-profile-btn-primary" disabled={isSaving}>
                {isSaving ? 'A guardar…' : 'Guardar'}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}

      {activeModal === 'image' ? (
        <Modal title="Trocar imagem de perfil" onClose={closeModal}>
          <form className="sll-profile-form" onSubmit={handleAvatarSubmit}>
            <div className="sll-profile-avatar-preview">
              <img src={resolveImagem(avatarDraft)} alt="Pré-visualização" />
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
            <div className="sll-profile-modal-actions">
              <button type="button" className="sll-profile-btn-secondary" onClick={closeModal} disabled={isSaving}>
                Cancelar
              </button>
              <button type="submit" className="sll-profile-btn-primary" disabled={isSaving}>
                {isSaving ? 'A guardar…' : 'Guardar'}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}

      {activeModal === 'rgpd' ? (
        <Modal title="Política de privacidade (RGPD)" onClose={closeModal}>
          <div className="sll-profile-rgpd-policy">{rgpdPolitica}</div>
        </Modal>
      ) : null}
    </div>
  )
}

export default ConsultorDefinicoesView