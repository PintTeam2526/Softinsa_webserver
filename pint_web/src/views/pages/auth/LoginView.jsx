import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './login.css'
import api from '../../../services/api'

const imgTick = 'http://localhost:3845/assets/0b2cf47547393ab971bf1e9c667b682519c74f46.svg'
const imgEllipse5 = '../../../assets/images/auth/05.png'
const imgEllipse4 = '../../../assets/images/auth/04.png'
const imgEllipse3 = '../../../assets/images/auth/03.png'
const imgEllipse2 = '../../../assets/images/auth/02.png'
const imgEllipse1 = '../../../assets/images/auth/01.png'

function LoginView() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberPassword: false,
  })
  const [loginError, setLoginError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    // Limpa o erro quando o utilizador começa a escrever
    if (loginError) setLoginError('')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setLoginError('')

    try {
      const response = await api.post('/autenticacao/login', {
        email: formData.email,
        password: formData.password,
      })

      const { token, user } = response.data
      localStorage.setItem('token', token)

      const redirectMap = {
        a: '/softinsa',
        c: '/consultor',
        s: '/sll',
        t: '/talent-manager',
      }

      navigate(redirectMap[user.role] ?? '/login')
    } catch (error) {
      console.error('Erro no login:', error)
      setLoginError('Email ou password incorretos.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      {/* Graphic Side with Circles */}
      <div className="login-graphic-side">
        <div className="login-big-circles">
          <div className="login-circles-container">
            <img alt="" className="login-circle" src={imgEllipse5} />
          </div>
          <div className="login-circles-container">
            <img alt="" className="login-circle" src={imgEllipse4} />
          </div>
          <div className="login-circles-container">
            <img alt="" className="login-circle" src={imgEllipse3} />
          </div>
          <div className="login-circles-container">
            <img alt="" className="login-circle" src={imgEllipse2} />
          </div>
          <div className="login-circles-container">
            <img alt="" className="login-circle" src={imgEllipse1} />
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="login-form-side">
        <div className="login-form-wrapper">
          <div className="login-form-content">
            <h1 className="login-title">Login</h1>

            <form onSubmit={handleLogin} className="login-form">
              {/* Email Field */}
              <div className="login-form-group">
                <label htmlFor="email" className="login-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="login-input"
                  placeholder=""
                  required
                />
              </div>

              {/* Password Field */}
              <div className="login-form-group">
                <label htmlFor="password" className="login-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="login-input"
                  placeholder=""
                  required
                />
              </div>

              {/* Mensagem de erro */}
              {loginError && (
                <p className="login-error">{loginError}</p>
              )}

              {/* Checkbox and Forgot Password */}
              <div className="login-form-actions">
                <div className="login-checkbox-group">
                  <div className="login-checkbox-wrapper">
                    <input
                      type="checkbox"
                      id="rememberPassword"
                      name="rememberPassword"
                      checked={formData.rememberPassword}
                      onChange={handleInputChange}
                      className="login-checkbox"
                    />
                    <div className="login-checkbox-tick">
                      {formData.rememberPassword && (
                        <img alt="" src={imgTick} />
                      )}
                    </div>
                  </div>
                  <label htmlFor="rememberPassword" className="login-checkbox-label">
                    Guardar password?
                  </label>
                </div>
                <a href="#" className="login-forgot-link">
                  Forgot Password
                </a>
              </div>

              {/* Login Button */}
              <button type="submit" className="login-button" disabled={isLoading}>
                {isLoading ? 'A entrar...' : 'Login'}
              </button>
            </form>

            {/* Forgot Password Link */}
            <div className="login-recover-container">
              <a href="#" className="login-recover-link">
                Recuperar Password
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginView