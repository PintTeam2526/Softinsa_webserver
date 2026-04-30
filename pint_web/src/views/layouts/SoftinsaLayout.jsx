import { memo } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'
import AdminTopbar from '../components/AdminTopbar'
import './SoftinsaLayout.css'

const SoftinsaLayout = memo(() => {
  return (
    <div className="d-flex softinsa-shell">
      <AdminSidebar />

      <main className="main-content flex-grow-1 softinsa-main-content">
        <AdminTopbar />

        <div className="content-inner softinsa-content-inner">
          <Outlet />
        </div>
      </main>
    </div>
  )
})

export default SoftinsaLayout
