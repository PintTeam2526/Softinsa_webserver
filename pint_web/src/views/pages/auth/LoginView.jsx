import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './login.css'

const imgTick = 'http://localhost:3845/assets/0b2cf47547393ab971bf1e9c667b682519c74f46.svg'
const imgEllipse5 = 'http://localhost:3845/assets/b9e5e6c7253e702e33ed1aaa921f6e302bc077df.svg'
const imgEllipse4 = 'http://localhost:3845/assets/801da602e7bbe6d4f36e4ed581414c34d371198c.svg'
const imgEllipse3 = 'http://localhost:3845/assets/110576950204e7fb8cb44c574fb459ffe2a4ce6b.svg'
const imgEllipse2 = 'http://localhost:3845/assets/4a707fb61f076a0640400982c899902ef6daffc2.svg'
const imgEllipse1 = 'http://localhost:3845/assets/1940231029714c275a9f9da7e8ca092c75f447f3.svg'

function LoginView() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberPassword: false,
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleLogin = (e) => {
    e.preventDefault()
    // TODO: Integrar com API/base de dados
    // Por enquanto, redireciona para AccessGatewayView
    // Depois será necessário:
    // 1. Autenticar o utilizador
    // 2. Obter o perfil/role do utilizador
    // 3. Redirecionar para o dashboard apropriado (/admin, /consultor, /sll)
    console.log('Login attempt:', formData)
    navigate('/acesso')
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
              <button type="submit" className="login-button">
                Login
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
