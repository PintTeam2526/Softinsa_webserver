import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    HiOutlineCog6Tooth,
    HiOutlineLockClosed,
    HiOutlineEnvelope,
    HiOutlineCamera,
    HiOutlineChevronRight,
    HiOutlineXMark,
    HiOutlineUserCircle,
    HiOutlineArrowRightOnRectangle,
} from 'react-icons/hi2'

import { getToken } from '../../../services/auth'

import { getUtilizadorById, updatemeUtilizador } from '../../../controllers/utilizadoresController'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolveImagem(raw) {
    if (!raw) return null

    if (raw?.type === 'Buffer' && Array.isArray(raw?.data)) {
        const binary = raw.data.reduce((acc, byte) => acc + String.fromCharCode(byte), '')
        raw = btoa(binary)
    }

    if (typeof raw !== 'string') return null
    if (raw.startsWith('data:') || raw.startsWith('http')) return raw

    let mime = 'image/jpeg'
    if (raw.startsWith('iVBOR')) mime = 'image/png'
    else if (raw.startsWith('R0lG')) mime = 'image/gif'
    else if (raw.startsWith('UklG')) mime = 'image/webp'
    else if (raw.startsWith('PHN2')) mime = 'image/svg+xml'

    return `data:${mime};base64,${raw}`
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

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

// ─── Componente partilhado ────────────────────────────────────────────────────

function PerfilView({ roleLabel, rolePillClass }) {
    const navigate = useNavigate()

    const [perfil, setPerfil] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const [activeModal, setActiveModal] = useState(null)
    const [feedback, setFeedback] = useState({ message: '', type: 'success' })
    const [isSaving, setIsSaving] = useState(false)

    const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' })
    const [emailForm, setEmailForm] = useState({ next: '', password: '' })
    const [avatarDraft, setAvatarDraft] = useState('')
    const fileInputRef = useRef(null)

    const idUtilizador = (() => {
        try {
            const token = getToken()
            const payload = JSON.parse(atob(token.split('.')[1]))
            return payload.id
        } catch {
            return null
        }
    })()


    useEffect(() => {
        const load = async () => {
            setIsLoading(true)
            try {
                const data = await getUtilizadorById(idUtilizador)
                setPerfil(data)
                setEmailForm((prev) => ({ ...prev, next: data?.email_utilizador ?? '' }))
                setAvatarDraft(data?.imagem_utilizador ?? '')
            } catch {
                flashFeedback('Erro ao carregar os dados do perfil.', 'error')
            } finally {
                setIsLoading(false)
            }
        }
        load()
    }, [idUtilizador])

    function openModal(name) {
        setFeedback({ message: '', type: 'success' })
        if (name === 'email') setEmailForm({ next: perfil?.email_utilizador ?? '', password: '' })
        if (name === 'image') setAvatarDraft(perfil?.imagem_utilizador ?? '')
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
            const updated = await getUtilizadorById(idUtilizador)
            setPerfil(updated)
            closeModal()
            flashFeedback(successMsg)
        } catch {
            flashFeedback('Não foi possível guardar as alterações.', 'error')
        } finally {
            setIsSaving(false)
        }
    }

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

    function handleAvatarFile(e) {
        const [file] = e.target.files || []
        if (!file) return
        const reader = new FileReader()
        reader.onload = () => {
            const base64 = String(reader.result).split(',')[1]
            setAvatarDraft(base64)
        }
        reader.readAsDataURL(file)
    }

    async function handleAvatarSubmit(e) {
        e.preventDefault()
        await saveUpdate({ foto: avatarDraft }, 'Imagem de perfil atualizada.')
    }

    function handleLogout() {
        localStorage.removeItem('token')
        sessionStorage.removeItem('token')
        navigate('/')
    }

    if (isLoading) {
        return (
            <div className="sll-profile-page">
                <main className="sll-profile-main">
                    <div className="sll-profile-loading" aria-live="polite">A carregar perfil…</div>
                </main>
            </div>
        )
    }

    const avatarSrc = resolveImagem(perfil?.imagem_utilizador)

    return (
        <div className="sll-profile-page">
            <main className="sll-profile-main">
                <div className="sll-profile-scroll">

                    <section className="sll-profile-hero" aria-label={`Perfil ${roleLabel}`}>
                        <div className="sll-profile-hero-copy">
                            <h1>O teu Perfil</h1>
                            <p>Gere as tuas informações e credenciais de acesso</p>
                        </div>
                    </section>

                    {feedback.message ? (
                        <div className={`sll-profile-feedback sll-profile-feedback--${feedback.type}`} role="status">
                            {feedback.message}
                        </div>
                    ) : null}

                    <section className="sll-profile-card">
                        <div className="sll-profile-card-main">
                            <div className="sll-profile-avatar">
                                {avatarSrc
                                    ? <img src={avatarSrc} alt={perfil?.nome_utilizador} />
                                    : (
                                        <span className="sll-profile-avatar-placeholder" aria-hidden="true">
                                            <HiOutlineUserCircle />
                                        </span>
                                    )
                                }
                            </div>
                            <div className="sll-profile-copy">
                                <div className="sll-profile-name-row">
                                    <h2>{perfil?.nome_utilizador}</h2>
                                    <span className={`sll-profile-role-pill ${rolePillClass}`}>
                                        {roleLabel}
                                    </span>
                                </div>
                                <p>{perfil?.email_utilizador}</p>
                            </div>
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
                                description={perfil?.email_utilizador}
                                onClick={() => openModal('email')}
                            />
                            <SettingsRow
                                Icon={HiOutlineCamera}
                                label="Trocar imagem de perfil"
                                description="Carrega uma nova fotografia"
                                onClick={() => openModal('image')}
                            />
                            <SettingsRow
                                Icon={HiOutlineArrowRightOnRectangle}
                                label="Terminar sessão"
                                description="Sair da aplicação"
                                onClick={handleLogout}
                            />
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
                            <button type="button" className="sll-profile-btn-secondary" onClick={closeModal} disabled={isSaving}>Cancelar</button>
                            <button
                                type="submit"
                                className="sll-profile-btn-primary"
                                disabled={isSaving || !passwordForm.current || !passwordForm.next || passwordForm.next !== passwordForm.confirm}
                            >
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
                            <button type="button" className="sll-profile-btn-secondary" onClick={closeModal} disabled={isSaving}>Cancelar</button>
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
                            {resolveImagem(avatarDraft)
                                ? <img src={resolveImagem(avatarDraft)} alt="Pré-visualização" />
                                : (
                                    <span className="sll-profile-avatar-placeholder sll-profile-avatar-placeholder--lg" aria-hidden="true">
                                        <HiOutlineUserCircle />
                                    </span>
                                )
                            }
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarFile}
                            className="sll-profile-file-hidden"
                        />
                        <button type="button" className="sll-profile-btn-secondary" onClick={() => fileInputRef.current?.click()}>
                            Escolher ficheiro…
                        </button>
                        <div className="sll-profile-modal-actions">
                            <button type="button" className="sll-profile-btn-secondary" onClick={closeModal} disabled={isSaving}>Cancelar</button>
                            <button type="submit" className="sll-profile-btn-primary" disabled={isSaving || !avatarDraft}>
                                {isSaving ? 'A guardar…' : 'Guardar'}
                            </button>
                        </div>
                    </form>
                </Modal>
            ) : null}
        </div>
    )
}

export default PerfilView