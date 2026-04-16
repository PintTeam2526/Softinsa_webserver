import { Navigate, Route, Routes } from 'react-router-dom'
import SoftinsaLayout from './views/layouts/SoftinsaLayout'
import DashboardView from './views/pages/DashboardView'
import PlaceholderView from './views/pages/PlaceholderView'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/softinsa" replace />} />

      <Route path="/softinsa" element={<SoftinsaLayout />}>
        <Route index element={<DashboardView />} />
        <Route path="utilizadores" element={<PlaceholderView title="Utilizadores" />} />
        <Route path="pedidos" element={<PlaceholderView title="Pedidos" />} />
        <Route path="slas" element={<PlaceholderView title="SLAs" />} />
        <Route path="rgpd" element={<PlaceholderView title="RGPD" />} />
        <Route path="badges" element={<PlaceholderView title="Badges" />} />
        <Route path="areas" element={<PlaceholderView title="Areas" />} />
        <Route path="service-lines" element={<PlaceholderView title="Service Lines" />} />
        <Route path="learning-paths" element={<PlaceholderView title="Learning Paths" />} />
      </Route>

      <Route path="*" element={<Navigate to="/softinsa" replace />} />
    </Routes>
  )
}

export default App