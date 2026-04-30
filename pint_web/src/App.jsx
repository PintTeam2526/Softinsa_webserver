import { Navigate, Route, Routes } from 'react-router-dom'
import SoftinsaLayout from './views/layouts/SoftinsaLayout'
import DashboardView from './views/pages/admin/DashboardView'
import AdminUsers from './views/pages/admin/admin-users'
import AdminPedidos from './views/pages/admin/admin-pedidos'
import AdminSlas from './views/pages/admin/admin-slas'
import AdminRgpd from './views/pages/admin/admin-rgpd'
import AdminBadges from './views/pages/admin/admin-badges'
import AdminAreas from './views/pages/admin/admin-areas'
import AdminServiceLines from './views/pages/admin/admin-service-lines'
import AdminLearningPaths from './views/pages/admin/admin-learning-paths'
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
import LoginView from './views/pages/auth/LoginView'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginView />} />
      <Route path="/login" element={<LoginView />} />
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

      <Route path="/admin" element={<SoftinsaLayout />}>
        <Route index element={<DashboardView />} />
        <Route path="utilizadores" element={<AdminUsers />} />
        <Route path="pedidos" element={<AdminPedidos />} />
        <Route path="slas" element={<AdminSlas />} />
        <Route path="rgpd" element={<AdminRgpd />} />
        <Route path="badges" element={<AdminBadges />} />
        <Route path="areas" element={<AdminAreas />} />
        <Route path="service-lines" element={<AdminServiceLines />} />
        <Route path="learning-paths" element={<AdminLearningPaths />} />
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