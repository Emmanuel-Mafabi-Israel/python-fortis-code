/*
    GLORY BE TO GOD,
    FORTIS-CODE,
    BY ISRAEL MAFABI EMMANUEL

    --- DASHBOARD LAYOUT ---
*/

import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext

export default function DashboardLayout({ children }) {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/'); // navigate to the welcome page
    };

    return (
        <div className="fortis-code-dashboard-layout">
            <header className="fortis-code-dashboard-header">
                <div className='fortis-code-org'>
                    <div className='fortis-code-logo'>Fortis<b className='gray'>Code</b></div>
                    <div className='fortis-code-subheading'>cryptofortis</div>
                </div>
                <nav className='fortis-code-navbar'>
                    <Link className='fortis-code-navbar-link' to="/dashboard">Home</Link>
                    <Link className='fortis-code-navbar-link' to="/account">Account</Link>
                    <Link className='fortis-code-navbar-link' to="/notifications">Notifications</Link>
                    <Link className='fortis-code-navbar-link' to="/transactions">Transactions</Link>
                    <Link className='fortis-code-navbar-link' to="/transact">Transact</Link>
                </nav>
                <div className="fortis-code-nav-btn">
                    <button className={"fortis-code-btn-initiators"} onClick={handleLogout}>Logout</button>
                </div>
            </header>
            <main className="fortis-code-dashboard-content">
                {children}
            </main>
            <footer className="fortis-code-dashboard-footer">
                <div className='fortis-code-logo'>Fortis<b className='gray'>Code</b></div>
                <div className='fortis-code-subheading'>© {new Date().getFullYear()} - cryptofortis. by Israel Mafabi Emmanuel</div>
            </footer>
        </div>
    )
}