import { Navigate, Route, Routes } from 'react-router-dom'

import GuestLayout from './views/layouts/GuestLayout'
import SoftinsaLayout from './views/layouts/SoftinsaLayout'
import SllLayout from './views/layouts/SllLayout'
import TalentManagerLayout from './views/layouts/TalentManagerLayout'
import ConsultorLayout from './views/layouts/ConsultorLayout'

import PerfilPublicoView from './views/pages/shared/PerfilPublicoView'

import LoginView from './views/pages/auth/login'
import RegisterView from './views/pages/auth/register'

import DashboardView from './views/pages/admin/DashboardView'
import SoftinsaUsers from './views/pages/admin/admin-users'
import SoftinsaPedidos from './views/pages/admin/admin-pedidos'
import SoftinsaRgpd from './views/pages/admin/admin-rgpd'
import SoftinsaBadges from './views/pages/admin/admin-badges'
import SoftinsaAreas from './views/pages/admin/admin-areas'
import SoftinsaServiceLines from './views/pages/admin/admin-service-lines'
import SoftinsaLearningPaths from './views/pages/admin/admin-learning-paths'
import SoftinsaPerfilView from './views/pages/admin/admin-definicoes'

import SLLDashboard from './views/pages/SLL/SLLDashboard'
import SLLCertificadosView from './views/pages/SLL/SLLCertificadosView'
import SLLBadgesView from './views/pages/SLL/SLLBadgesView'
import SLLMinhaEquipaView from './views/pages/SLL/SLLMinhaEquipaView'
import SLLHistoricoView from './views/pages/SLL/SLLHistoricoView'
import SLLRelatoriosView from './views/pages/SLL/SLLRelatoriosView'
import SLLPendentesView from './views/pages/SLL/SLLPendentesView'
import SLLDefinicoesView from './views/pages/SLL/SLLDefinicoesView'

import TalentManagerDashboardView from './views/pages/talent-manager/TalentManagerDashboardView'
import TalentManagerPedidosView from './views/pages/talent-manager/TalentManagerPedidosView'
import TalentManagerHistoricoView from './views/pages/talent-manager/TalentManagerHistoricoView'
import TalentManagerBadgesView from './views/pages/talent-manager/TalentManagerBadgesView'
import TalentManagerCertificadosView from './views/pages/talent-manager/TalentManagerCertificadosView'
import TalentManagerConsultoresView from './views/pages/talent-manager/TalentManagerConsultoresView'
import TalentManagerRelatoriosView from './views/pages/talent-manager/TalentManagerRelatoriosView'
import TalentManagerDefinicoesView from './views/pages/talent-manager/TalentManagerDefinicoesView'

import ConsultorDashboardView from './views/pages/consultor/consultorDashboardView'
import ConsultorPedidosView from './views/pages/consultor/ConsultorPedidosView'
import ConsultorObjetivosView from './views/pages/consultor/ConsultorObjetivosView'
import ConsultorConquistasView from './views/pages/consultor/ConsultorConquistasView'
import ConsultorOutrasAreasView from './views/pages/consultor/ConsultorOutrasAreasView'
import ConsultorListaBadgesView from './views/pages/consultor/ConsultorListaBadgesView'
import ConsultorBadgePageView from './views/pages/consultor/ConsultorBadgePageView'
import ConsultorDefinicoesView from './views/pages/consultor/ConsultorDefinicoesView'

import ScrollToTop from './views/components/ScrollToTop'

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LoginView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/registar" element={<RegisterView />} />

        <Route path="/guest" element={<GuestLayout />}>
          <Route path="badges" element={<TalentManagerBadgesView isGuest={true} />} />
          <Route path="badge/:badgeId" element={<ConsultorBadgePageView isGuest={true} />} />
        </Route>

        <Route path="/softinsa" element={<SoftinsaLayout />}>
          <Route index element={<DashboardView />} />
          <Route path="utilizadores" element={<SoftinsaUsers />} />
          <Route path="pedidos" element={<SoftinsaPedidos />} />
          <Route path="rgpd" element={<SoftinsaRgpd />} />
          <Route path="badges" element={<SoftinsaBadges />} />
          <Route path="areas" element={<SoftinsaAreas />} />
          <Route path="service-lines" element={<SoftinsaServiceLines />} />
          <Route path="learning-paths" element={<SoftinsaLearningPaths />} />
          <Route path="definicoes" element={<SoftinsaPerfilView />} />
          <Route path="perfil-publico" element={<PerfilPublicoView />} />
        </Route>

        <Route path="/sll" element={<SllLayout />}>
          <Route index element={<SLLDashboard />} />
          <Route path="/sll/certificados" element={<SLLCertificadosView />} />
          <Route path="/sll/badges" element={<SLLBadgesView />} />
          <Route path="/sll/equipa" element={<SLLMinhaEquipaView />} />
          <Route path="/sll/relatorios" element={<SLLRelatoriosView />} />
          <Route path="/sll/historico" element={<SLLHistoricoView />} />
          <Route path="/sll/pendentes" element={<SLLPendentesView />} />
          <Route path="/sll/definicoes" element={<SLLDefinicoesView />} />
          <Route path="/sll/perfil-publico" element={<PerfilPublicoView />} />
        </Route>

        <Route path="/talent-manager" element={<TalentManagerLayout />}>
          <Route index element={<TalentManagerDashboardView />} />
          <Route path="pedidos" element={<TalentManagerPedidosView />} />
          <Route path="historico" element={<TalentManagerHistoricoView />} />
          <Route path="badges" element={<TalentManagerBadgesView />} />
          <Route path="certificados" element={<TalentManagerCertificadosView />} />
          <Route path="consultores" element={<TalentManagerConsultoresView />} />
          <Route path="relatorios" element={<TalentManagerRelatoriosView />} />
          <Route path="definicoes" element={<TalentManagerDefinicoesView />} />
          <Route path="perfil-publico" element={<PerfilPublicoView />} />
        </Route>

        <Route path="/consultor" element={<ConsultorLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ConsultorDashboardView />} />
          <Route path="home" element={<ConsultorDashboardView />} />
          <Route path="area/lowcode" element={<ConsultorDashboardView />} />
          <Route path="service-line/hybrid-cloud" element={<ConsultorDashboardView />} />
          <Route path="learning-path/jornada-tecnica" element={<ConsultorDashboardView />} />
          <Route path="pedidos" element={<ConsultorPedidosView />} />
          <Route path="badges/pedidos" element={<ConsultorPedidosView />} />
          <Route path="listas-badges" element={<ConsultorListaBadgesView />} />
          <Route path="badges/listas-badges" element={<ConsultorListaBadgesView />} />
          <Route path="objetivos" element={<ConsultorObjetivosView />} />
          <Route path="badges/objetivos" element={<ConsultorObjetivosView />} />
          <Route path="conquistas" element={<ConsultorConquistasView />} />
          <Route path="badges/conquistas" element={<ConsultorConquistasView />} />
          <Route path="outras-areas" element={<ConsultorOutrasAreasView />} />
          <Route path="badges/outras-areas" element={<ConsultorOutrasAreasView />} />
          <Route path="badge/:badgeId" element={<ConsultorBadgePageView />} />
          <Route path="area/lowcode/:badgeId" element={<ConsultorBadgePageView />} />
          <Route path="badges" element={<ConsultorDashboardView />} />
          <Route path="mensagens" element={<ConsultorDashboardView />} />
          <Route path="definicoes" element={<ConsultorDefinicoesView />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes >
    </>
  )
}

export default App