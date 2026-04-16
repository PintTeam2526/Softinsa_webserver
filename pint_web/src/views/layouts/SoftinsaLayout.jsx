import { memo } from 'react'
import { Outlet } from 'react-router-dom'
import SoftinsaSidebar from '../components/SoftinsaSidebar'
import SoftinsaTopbar from '../components/SoftinsaTopbar'
import './SoftinsaLayout.css'

const SoftinsaLayout = memo(() => {
  return (
    <div className="d-flex softinsa-shell">
      <SoftinsaSidebar />

      <main className="main-content flex-grow-1 softinsa-main-content">
        <SoftinsaTopbar />

        <div className="content-inner softinsa-content-inner">
          <Outlet />
        </div>
      </main>
    </div>
  )
})

export default SoftinsaLayout
