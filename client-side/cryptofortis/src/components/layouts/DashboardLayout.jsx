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
        <div className="dashboard-layout">
            <header className="dashboard-header">
                <h1>Fortis Dashboard</h1>
                <nav>
                    <Link to="/dashboard">Home</Link>
                    <Link to="/account">Account</Link>
                    <Link to="/notifications">Notifications</Link>
                    <Link to="/transactions">Transactions</Link>
                    <Link to="/transact">Transact</Link>
                    <button onClick={handleLogout}>Logout</button>
                </nav>
            </header>
            <main className="dashboard-content">
                {children}
            </main>
            <footer className="dashboard-footer">
                <p>© {new Date().getFullYear()} Fortis.</p>
            </footer>
        </div>
    )
}