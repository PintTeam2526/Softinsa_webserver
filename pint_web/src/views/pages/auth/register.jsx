import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './register.css'

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M13.5 4 6.5 11 2.5 7"
        stroke="#3a57e8"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function RegisterView() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  })
  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (error) setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (formData.password.length < 6) {
      setError('A password tem de ter pelo menos 6 caracteres.')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError('As passwords não coincidem.')
      return
    }
    if (!formData.acceptTerms) {
      setError('Tem de aceitar os termos e a política de privacidade.')
      return
    }

    // TODO: integrar com a API de registo
    console.log('Register attempt:', formData)
    navigate('/acesso')
  }

  return (
    <div className="register-container">
      <div className="register-graphic-side">
        <div className="register-big-circles" aria-hidden="true">
          <div className="register-circle register-circle-5" />
          <div className="register-circle register-circle-4" />
          <div className="register-circle register-circle-3" />
          <div className="register-circle register-circle-2" />
          <div className="register-circle register-circle-1" />
        </div>

        {/* Logo */}
        <div className="register-logo-container">
          <svg className="register-logo" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="200" rx="100" fill="#000000" />
            <text x="100" y="115" fontFamily="Inter, sans-serif" fontSize="35" fontWeight="700" textAnchor="middle" fill="#ffffff">
              SOF
              <tspan fill="#2596be">TI</tspan>
              NSA
            </text>
          </svg>
        </div>

        {/* Back Arrow */}
        <button
          className="register-back-button"
          onClick={() => navigate(-1)}
          aria-label="Voltar atrás"
        >
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="register-form-side">
        <div className="register-form-wrapper">
          <div className="register-form-content">
            <h1 className="register-title">Registar</h1>
            <p className="register-subtitle">Cria a tua conta Softinsa</p>

            <form onSubmit={handleSubmit} className="register-form">
              <div className="register-form-group">
                <label htmlFor="name" className="register-label">
                  Nome completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="register-input"
                  required
                />
              </div>

              <div className="register-form-group">
                <label htmlFor="email" className="register-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="register-input"
                  required
                />
              </div>

              <div className="register-form-row">
                <div className="register-form-group">
                  <label htmlFor="password" className="register-label">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="register-input"
                    minLength={6}
                    required
                  />
                </div>

                <div className="register-form-group">
                  <label htmlFor="confirmPassword" className="register-label">
                    Confirmar password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="register-input"
                    minLength={6}
                    required
                  />
                </div>
              </div>

              <div className="register-checkbox-group">
                <label className="register-checkbox-wrapper">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="register-checkbox"
                  />
                  <span className="register-checkbox-tick" aria-hidden="true">
                    {formData.acceptTerms ? <CheckIcon /> : null}
                  </span>
                  <span className="register-checkbox-label">
                    Aceito os <a href="#" className="register-inline-link">termos</a> e a{' '}
                    <a href="#" className="register-inline-link">política de privacidade</a>.
                  </span>
                </label>
              </div>

              {error ? <p className="register-error">{error}</p> : null}

              <button type="submit" className="register-button">
                Criar conta
              </button>
            </form>

            <div className="register-footer">
              <span>Já tens conta?</span>
              <Link to="/login" className="register-login-link">
                Entrar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterView
