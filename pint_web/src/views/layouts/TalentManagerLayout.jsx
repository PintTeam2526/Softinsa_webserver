import { memo } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import TalentManagerSidebar from '../components/TalentManagerSidebar'
import TalentManagerTopbar from '../components/TalentManagerTopbar'
import '../pages/talent-manager/TalentManagerHomeView.css'

const TalentManagerLayout = memo(() => {
  const location = useLocation()
  const isRelatoriosView = location.pathname.includes('/talent-manager/relatorios')

  return (
    <div className={`tm-page${isRelatoriosView ? ' is-relatorios-view' : ''}`}>
      <TalentManagerSidebar />

      <main className="tm-main">
        <TalentManagerTopbar />

        <Outlet />
      </main>
    </div>
  )
})

export default TalentManagerLayout