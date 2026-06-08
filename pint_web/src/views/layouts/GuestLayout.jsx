import { memo } from 'react'
import { Outlet } from 'react-router-dom'
import GuestTopbar from '../components/GuestTopbar'
import './GuestLayout.css'

const GuestLayout = memo(() => {
    return (
        <div className="tm-page">
            <main className="tm-main">
                <GuestTopbar />
                <Outlet />
            </main>
        </div>
    )
})
export default GuestLayout