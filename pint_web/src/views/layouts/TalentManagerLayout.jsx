import { memo } from 'react'
import { Outlet } from 'react-router-dom'
import TalentManagerSidebar from '../components/TalentManagerSidebar'
import TalentManagerTopbar from '../components/TalentManagerTopbar'
import './TalentManagerLayout.css'

const TalentManagerLayout = memo(() => {
  return (
    <div className="tm-page">
      <TalentManagerSidebar />

      <main className="tm-main">
        <TalentManagerTopbar />

        <Outlet />
      </main>
    </div>
  )
})

export default TalentManagerLayout