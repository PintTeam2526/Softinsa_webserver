import { memo } from 'react'
import { Outlet } from 'react-router-dom'
import ConsultorSidebar from '../components/ConsultorSidebar'
import ConsultorTopbar from '../components/ConsultorTopbar'
import './ConsultorLayout.css'

const ConsultorLayout = memo(() => {
  return (
    <div className="d-flex consultor-shell">
      <ConsultorSidebar />

      <main className="main-content flex-grow-1 consultor-main-content">
        <ConsultorTopbar />

        <div className="content-inner consultor-content-inner">
          <Outlet />
        </div>
      </main>
    </div>
  )
})

export default ConsultorLayout