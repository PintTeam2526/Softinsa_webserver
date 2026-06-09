import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './register.css'
import { getAreas } from '../../../controllers/areasController'
import { registarConsultor } from '../../../controllers/registoController'

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
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    fotoPerfil: '',
    idAreaPreferencia: '',
    acceptTerms: false,
  })
  const [areas, setAreas] = useState([])
  const [error, setError] = useState('')

  // Carregar áreas ao montar o componente
  useEffect(() => {
    getAreas()
      .then((data) => {
        setAreas(data)
      })
      .catch((err) => {
        console.error('Erro ao carregar áreas:', err)
      })
  }, [])

  const handleAvatarClick = () => {
    fileInputRef.current.click()
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (error) setError('')
  }

  function handleFileChange(event) {
    const file = event.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('A imagem é demasiado grande (máx 2MB).')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          fotoPerfil: reader.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  async function handleRegisto() {
    try {
      const resultado = await registarConsultor(
        formData.name,
        formData.email,
        formData.username,
        formData.password,
        formData.fotoPerfil,
        formData.idAreaPreferencia
      )
      if (resultado === true) {
        navigate('/acesso')
      } else {
        setError('Falha no registo, por favor tente outra vez')
        return
      }
    } catch (err) {
      console.error('Erro na chamada do controller:', err)
      setError('Falha no registo, por favor tente outra vez')
      return
    }
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
    if (!formData.email) {
      setError('Tem adicionar um email válido.')
      return
    }
    if (!formData.fotoPerfil) {
      setError('Tem de adicionar uma foto de perfil.')
      return
    }
    if (!formData.name) {
      setError('Tem de preencher o nome.')
      return
    }
    if (!formData.username) {
      setError('Tem preencher o username.')
      return
    }
    if (!formData.idAreaPreferencia) {
      setError('Tem escolher a àrea de preferencia.')
      return
    }
    handleRegisto()
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
              <div className="register-avatar-container">
                <div className="register-avatar-wrapper" onClick={handleAvatarClick}>
                  {formData.fotoPerfil ? (
                    <img src={formData.fotoPerfil} alt="Avatar" className="register-avatar-image" />
                  ) : (
                    <div className="register-avatar-placeholder">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                    </div>
                  )}
                  <div className="register-avatar-overlay">
                    <span>Mudar</span>
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg"
                  style={{ display: 'none' }}
                />
                <p className="register-avatar-text">Foto de perfil</p>
              </div>

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
                <label htmlFor="username" className="register-label">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
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

              <div className="register-form-group">
                <label htmlFor="idAreaPreferencia" className="register-label">
                  Área de Preferência
                </label>
                <select
                  id="idAreaPreferencia"
                  name="idAreaPreferencia"
                  value={formData.idAreaPreferencia}
                  onChange={handleChange}
                  className="register-input"
                  required
                >
                  <option value="">Seleciona uma área...</option>
                  {areas.map((area) => (
                    <option key={area.id_area} value={area.id_area}>
                      {area.nome_area}
                    </option>
                  ))}
                </select>
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
