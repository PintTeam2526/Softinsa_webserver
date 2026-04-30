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
import AccessGatewayView from './views/pages/shared/accessGatewayView'
import TalentManagerHomeView from './views/pages/talent-manager/TalentManagerHomeView'
import SLLHomeView from './views/pages/SLL/SLLHomeView'
import SLLCertificadosView from './views/pages/SLL/SLLCertificadosView'
import SLLBadgesView from './views/pages/SLL/SLLBadgesView'
import SLLMinhaEquipaView from './views/pages/SLL/SLLMinhaEquipaView'
import SLLHistoricoView from './views/pages/SLL/SLLHistoricoView'
import SLLRelatoriosView from './views/pages/SLL/SLLRelatoriosView'
import SLLPendentesView from './views/pages/SLL/SLLPendentesView'
import SLLPerfilPublicoView from './views/pages/SLL/SLLPerfilPublicoView'
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
      <Route path="/" element={<AccessGatewayView />} />
      <Route path="/acesso" element={<AccessGatewayView />} />
      <Route path="/talent-manager" element={<TalentManagerHomeView />} />
      <Route path="/sll" element={<SLLHomeView />} />
      <Route path="/sll/certificados" element={<SLLCertificadosView />} />
      <Route path="/sll/badges" element={<SLLBadgesView />} />
      <Route path="/sll/equipa" element={<SLLMinhaEquipaView />} />
      <Route path="/sll/relatorios" element={<SLLRelatoriosView />} />
      <Route path="/sll/historico" element={<SLLHistoricoView />} />
      <Route path="/sll/pendentes" element={<SLLPendentesView />} />
      <Route path="/sll/perfil-publico" element={<SLLPerfilPublicoView />} />

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

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App