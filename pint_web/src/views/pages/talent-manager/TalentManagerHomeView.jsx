import { Routes, Route } from 'react-router-dom'
import TalentManagerLayout from '../../layouts/TalentManagerLayout'
import TalentManagerDashboardView from './TalentManagerDashboardView'
import TalentManagerPedidosView from './TalentManagerPedidosView'
import TalentManagerHistoricoView from './TalentManagerHistoricoView'
import TalentManagerBadgesView from './TalentManagerBadgesView'
import TalentManagerCertificadosView from './TalentManagerCertificadosView'
import TalentManagerConsultoresView from './TalentManagerConsultoresView'
import TalentManagerRelatoriosView from './TalentManagerRelatoriosView'
import './TalentManagerHomeView.css'

function TalentManagerHomeView() {
  return (
    <Routes>
      <Route element={<TalentManagerLayout />}>
        <Route index element={<TalentManagerDashboardView />} />
        <Route path="pedidos" element={<TalentManagerPedidosView />} />
        <Route path="historico" element={<TalentManagerHistoricoView />} />
        <Route path="badges" element={<TalentManagerBadgesView />} />
        <Route path="certificados" element={<TalentManagerCertificadosView />} />
        <Route path="consultores" element={<TalentManagerConsultoresView />} />
        <Route path="relatorios" element={<TalentManagerRelatoriosView />} />
      </Route>
    </Routes>
  )
}

export default TalentManagerHomeView