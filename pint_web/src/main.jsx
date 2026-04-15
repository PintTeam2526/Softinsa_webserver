import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Importação do Bootstrap Base
import 'bootstrap/dist/css/bootstrap.min.css'

// Se baixares o template oficial, aqui importarias o ficheiro customizado:
import './assets/scss/hope-ui.scss' 
import Dashboard from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>,
)
