// DashboardLayout.jsx

import React, { useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext

const DashboardLayout = React.memo(({ children }) => {
    const { logout } = useContext(AuthContext);

    const handleLogout = useCallback(() => {
        logout();
    }, [logout]);

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
    );
});

export default DashboardLayout;