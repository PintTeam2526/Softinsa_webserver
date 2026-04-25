import { Navigate, Route, Routes } from 'react-router-dom'
import SoftinsaLayout from './views/layouts/SoftinsaLayout'
import DashboardView from './views/pages/admin/DashboardView'
import SoftinsaUsers from './views/pages/admin/softinsa-users'
import SoftinsaPedidos from './views/pages/admin/softinsa-pedidos'
import SoftinsaSlas from './views/pages/admin/softinsa-slas'
import SoftinsaRgpd from './views/pages/admin/softinsa-rgpd'
import SoftinsaBadges from './views/pages/admin/softinsa-badges'
import SoftinsaAreas from './views/pages/admin/softinsa-areas'
import SoftinsaServiceLines from './views/pages/admin/softinsa-service-lines'
import SoftinsaLearningPaths from './views/pages/admin/softinsa-learning-paths'
import ConsultorHomeView from './views/pages/consultor/consultorHomeView'
import ConsultorBadgesView from './views/pages/consultor/consultorBadgesView'
import ConsultorBadgesListsView from './views/pages/consultor/consultorBadgesListsView'
import ConsultorPedidosView from './views/pages/consultor/consultorPedidosView'
import ConsultorObjetivosView from './views/pages/consultor/consultorObjetivosView'
import ConsultorMessagesView from './views/pages/consultor/consultorMessagesView'
import ConsultorConquistasView from './views/pages/consultor/consultorConquistasView'
import ConsultorOutrasAreasView from './views/pages/consultor/consultorOutrasAreasView'
import ConsultorPerfilPublicoView from './views/pages/consultor/consultorPerfilPublicoView'

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

      <Route path="/consultor" element={<SoftinsaLayout />}>
        <Route index element={<ConsultorHomeView />} />
        <Route path="pedidos" element={<ConsultorPedidosView />} />
        <Route path="listas-badges" element={<ConsultorBadgesListsView />} />
        <Route path="objetivos" element={<ConsultorObjetivosView />} />
        <Route path="conquistas" element={<ConsultorConquistasView />} />
        <Route path="outras-areas" element={<ConsultorOutrasAreasView />} />
        <Route path="perfil-publico" element={<ConsultorPerfilPublicoView />} />
        {/* paginas a mais -> ver se dá para reaproveitar*/}
        <Route path="badges" element={<ConsultorBadgesView />} />
        <Route path="mensagens" element={<ConsultorMessagesView />} />
      </Route>

      <Route path="*" element={<Navigate to="/softinsa" replace />} />
    </Routes>
  )
}

export default App