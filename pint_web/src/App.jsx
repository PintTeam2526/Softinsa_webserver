import { Navigate, Route, Routes } from 'react-router-dom'
import SoftinsaLayout from './views/layouts/SoftinsaLayout'
import DashboardView from './views/pages/DashboardView'
import SoftinsaUsers from './views/pages/admin/softinsa-users'
import SoftinsaPedidos from './views/pages/admin/softinsa-pedidos'
import SoftinsaSlas from './views/pages/admin/softinsa-slas'
import SoftinsaRgpd from './views/pages/admin/softinsa-rgpd'
import SoftinsaBadges from './views/pages/admin/softinsa-badges'
import SoftinsaAreas from './views/pages/admin/softinsa-areas'
import SoftinsaServiceLines from './views/pages/admin/softinsa-service-lines'
import SoftinsaLearningPaths from './views/pages/admin/softinsa-learning-paths'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/softinsa" replace />} />

      <Route path="/softinsa" element={<SoftinsaLayout />}>
        <Route index element={<DashboardView />} />
        <Route path="utilizadores" element={<SoftinsaUsers />} />
        <Route path="pedidos" element={<SoftinsaPedidos />} />
        <Route path="slas" element={<SoftinsaSlas />} />
        <Route path="rgpd" element={<SoftinsaRgpd />} />
        <Route path="badges" element={<SoftinsaBadges />} />
        <Route path="areas" element={<SoftinsaAreas />} />
        <Route path="service-lines" element={<SoftinsaServiceLines />} />
        <Route path="learning-paths" element={<SoftinsaLearningPaths />} />
      </Route>

      <Route path="*" element={<Navigate to="/softinsa" replace />} />
    </Routes>
  )
}

export default App