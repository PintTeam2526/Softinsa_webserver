import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// Importação do Bootstrap Base
import 'bootstrap/dist/css/bootstrap.min.css'

// Se baixares o template oficial, aqui importarias o ficheiro customizado:
import './assets/scss/hope-ui.scss'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
