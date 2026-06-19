import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './rec-pass.css'

import { enviarCodigoRecuperacao, verificarCodigoRecuperacao, redefinirPassword } from '../../../controllers/recPassController'


function RecuperacaoView() {
  const navigate = useNavigate()
  const [step, setStep] = useState('email') // 'email' | 'codigo' | 'nova-password'
  const [email, setEmail] = useState('')
  const [codigo, setCodigo] = useState(['', '', '', '', '', ''])
  const [novaPassword, setNovaPassword] = useState('')
  const [confirmarPassword, setConfirmarPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const inputsRef = useRef([])

  async function handleEmailSubmit(event) {
    event.preventDefault()
    if (!email) { setError('Introduza o seu email.'); return }
    setError('')
    setLoading(true)
    const sucesso = await enviarCodigoRecuperacao(email)
    setLoading(false)
    if (sucesso) {
      setStep('codigo')
    } else {
      setError('Erro ao enviar o código. Tente novamente.')
    }
  }

  function handleCodigoChange(index, value) {
    if (!/^\d?$/.test(value)) return
    const next = [...codigo]
    next[index] = value
    setCodigo(next)
    if (error) setError('')
    if (value && index < 5) inputsRef.current[index + 1]?.focus()
  }

  function handleCodigoPaste(event) {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    event.preventDefault()
    const next = [...codigo]
    pasted.split('').forEach((ch, i) => { next[i] = ch })
    setCodigo(next)
    inputsRef.current[Math.min(pasted.length, 5)]?.focus()
  }

  function handleCodigoKeyDown(index, event) {
    if (event.key === 'Backspace' && !codigo[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  async function handleCodigoSubmit(event) {
    event.preventDefault()
    if (codigo.some(d => d === '')) { setError('Preencha todos os dígitos do código.'); return }
    setError('')
    setLoading(true)
    const sucesso = await verificarCodigoRecuperacao(email, codigo.join(''))
    setLoading(false)
    if (sucesso) {
      setStep('nova-password')
    } else {
      setError('Código inválido ou expirado. Tente novamente.')
    }
  }

  async function handleNovaPasswordSubmit(event) {
    event.preventDefault()
    if (!novaPassword || !confirmarPassword) { setError('Preencha os dois campos.'); return }
    if (novaPassword !== confirmarPassword) { setError('As passwords não coincidem.'); return }
    if (novaPassword.length < 6) { setError('A password deve ter pelo menos 6 caracteres.'); return }
    setError('')
    setLoading(true)
    const sucesso = await redefinirPassword(email, codigo.join(''), novaPassword)
    setLoading(false)
    if (sucesso) {
      navigate('/login')
    } else {
      setError('Erro ao redefinir a password. O código pode ter expirado.')
    }
  }

  return (
    <div className="recuperacao-container">
      <div className="recuperacao-graphic-side">
        <div className="recuperacao-big-circles" aria-hidden="true">
          <div className="recuperacao-circle recuperacao-circle-5" />
          <div className="recuperacao-circle recuperacao-circle-4" />
          <div className="recuperacao-circle recuperacao-circle-3" />
          <div className="recuperacao-circle recuperacao-circle-2" />
          <div className="recuperacao-circle recuperacao-circle-1" />
        </div>
      </div>

      <div className="recuperacao-form-side">
        <div className="recuperacao-form-wrapper">

          {/* PASSO 1 — Email */}
          {step === 'email' && (
            <div className="recuperacao-form-content">
              <div className="recuperacao-icon" aria-hidden="true">
                <svg viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="22" fill="#eef2ff" stroke="#3a57e8" strokeWidth="1.5" />
                  <path d="M14 18h20v14a2 2 0 01-2 2H16a2 2 0 01-2-2V18z" stroke="#3a57e8" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
                  <path d="M14 18l10 9 10-9" stroke="#3a57e8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <h1 className="recuperacao-title">Recuperar password</h1>
              <p className="recuperacao-subtitle">
                Introduz o teu email e enviamos um código de recuperação.
              </p>

              <form onSubmit={handleEmailSubmit} className="recuperacao-form">
                <div className="recuperacao-form-group">
                  <label htmlFor="email" className="recuperacao-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError('') }}
                    className="recuperacao-input"
                    placeholder="exemplo@softinsa.pt"
                    required
                  />
                </div>

                {error && <p className="recuperacao-error">{error}</p>}

                <button type="submit" className="recuperacao-button" disabled={loading}>
                  {loading ? 'A enviar…' : 'Enviar código'}
                </button>
              </form>

              <div className="recuperacao-footer">
                <span>Lembras-te da password?</span>
                <Link to="/login" className="recuperacao-link">Entrar</Link>
              </div>

              <button type="button" className="recuperacao-cancel" onClick={() => navigate(-1)}>
                Cancelar
              </button>
            </div>
          )}

          {/* PASSO 2 — Código */}
          {step === 'codigo' && (
            <div className="recuperacao-form-content">
              <div className="recuperacao-icon" aria-hidden="true">
                <svg viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="22" fill="#eef2ff" stroke="#3a57e8" strokeWidth="1.5" />
                  <rect x="15" y="22" width="18" height="13" rx="2" stroke="#3a57e8" strokeWidth="1.5" fill="none" />
                  <path d="M18 22v-4a6 6 0 0112 0v4" stroke="#3a57e8" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="24" cy="28.5" r="1.5" fill="#3a57e8" />
                </svg>
              </div>

              <h1 className="recuperacao-title">Verificar código</h1>
              <p className="recuperacao-subtitle">
                Enviámos um código de 6 dígitos para <strong>{email}</strong>
              </p>

              <form onSubmit={handleCodigoSubmit} className="recuperacao-form">
                <div className="recuperacao-codigo-row" onPaste={handleCodigoPaste}>
                  {codigo.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => inputsRef.current[i] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleCodigoChange(i, e.target.value)}
                      onKeyDown={e => handleCodigoKeyDown(i, e)}
                      className={`recuperacao-codigo-input${digit ? ' is-filled' : ''}`}
                      aria-label={`Dígito ${i + 1}`}
                      autoFocus={i === 0}
                    />
                  ))}
                </div>

                {error && <p className="recuperacao-error">{error}</p>}

                <button type="submit" className="recuperacao-button" disabled={loading}>
                  {loading ? 'A verificar…' : 'Confirmar código'}
                </button>
              </form>

              <button
                type="button"
                className="recuperacao-resend"
                onClick={() => { setStep('email'); setCodigo(['', '', '', '', '', '']); setError('') }}
              >
                ← Alterar email ou reenviar código
              </button>

              <button type="button" className="recuperacao-cancel" onClick={() => navigate(-1)}>
                Cancelar
              </button>
            </div>
          )}

          {/* PASSO 3 — Nova password */}
          {step === 'nova-password' && (
            <div className="recuperacao-form-content">
              <div className="recuperacao-icon" aria-hidden="true">
                <svg viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="22" fill="#eef2ff" stroke="#3a57e8" strokeWidth="1.5" />
                  <path d="M17 24h14M24 17v14" stroke="#3a57e8" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="24" cy="24" r="8" stroke="#3a57e8" strokeWidth="1.5" fill="none" />
                </svg>
              </div>

              <h1 className="recuperacao-title">Nova password</h1>
              <p className="recuperacao-subtitle">
                Escolhe uma nova password para a tua conta.
              </p>

              <form onSubmit={handleNovaPasswordSubmit} className="recuperacao-form">
                <div className="recuperacao-form-group">
                  <label htmlFor="nova-password" className="recuperacao-label">Nova password</label>
                  <input
                    type="password"
                    id="nova-password"
                    value={novaPassword}
                    onChange={e => { setNovaPassword(e.target.value); setError('') }}
                    className="recuperacao-input"
                    placeholder="Mínimo 6 caracteres"
                    required
                  />
                </div>

                <div className="recuperacao-form-group">
                  <label htmlFor="confirmar-password" className="recuperacao-label">Confirmar password</label>
                  <input
                    type="password"
                    id="confirmar-password"
                    value={confirmarPassword}
                    onChange={e => { setConfirmarPassword(e.target.value); setError('') }}
                    className="recuperacao-input"
                    placeholder="Repete a nova password"
                    required
                  />
                </div>

                {error && <p className="recuperacao-error">{error}</p>}

                <button type="submit" className="recuperacao-button" disabled={loading}>
                  {loading ? 'A guardar…' : 'Guardar password'}
                </button>
              </form>

              <button type="button" className="recuperacao-cancel" onClick={() => navigate(-1)}>
                Cancelar
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default RecuperacaoView
