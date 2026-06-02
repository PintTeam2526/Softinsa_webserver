import { Outlet } from 'react-router-dom'

function GuestLayout() {
    return (
        <div className="guest-layout">
            {/* navbar pública opcional */}
            <main>
                <Outlet />
            </main>
        </div>
    )
}
export default GuestLayout