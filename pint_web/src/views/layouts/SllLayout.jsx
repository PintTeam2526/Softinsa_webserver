import { memo } from 'react'
import { Outlet } from 'react-router-dom'
import SLLSidebar from '../components/SLLSidebar'
import SLLTopbar from '../components/SLLTopbar'
import './SllLayout.css'

const SllLayout = memo(() => {
  return (
    <div className="tm-page">
      <SLLSidebar />

      <main className="tm-main">
        <SLLTopbar />

        <Outlet />
      </main>
    </div>
  )
})

export default SllLayout
