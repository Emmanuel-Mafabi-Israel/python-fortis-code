/*
    GLORY BE TO GOD,
    FORTIS-CODE,
    BY ISRAEL MAFABI EMMANUEL

    --- DASHBOARD ---
*/

import React, { useState, useEffect, useContext } from 'react';

import LoadingSpinner from '../common/FortisLoadingSpinner';
import ErrorMessage from '../common/FortisErrorMessage';

import DashboardLayout from '../layouts/DashboardLayout'

import { AuthContext } from '../../context/AuthContext'; // Import AuthContext
import api from '../api/api'; // Import the API functions

import { Link } from 'react-router-dom';

export default function DashboardMain() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useContext(AuthContext); // Destructure token from context

    useEffect(() => {
        const fetchUserDetails = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await api.getUserDetails(token);
                setUser(data);
            } catch (err) {
                setError(err.message);
            }
            setLoading(false);
        };

        fetchUserDetails();
    }, [token]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    return (
        <DashboardLayout>
            <div className='fortis-code-dashboard-main'>
                {user && (
                    <div className='fortis-code-dashboard-main-container'>
                        <div className='fortis-code-welcome-text'>
                        Welcome,&nbsp;{user.profile?.name ? user.profile.name + "!" : <div className='fortis-code-setup-heads-up'><p>Go to <Link className='fortis-code-link-redirect' to="/account">Account Section</Link> and set-up your account credentials.</p></div>}
                        </div>
                        <p className='fortis-code-balance-text'>Balance: {user.balance}</p>
                        {/* we'll Display other user details as needed 😉 */}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};