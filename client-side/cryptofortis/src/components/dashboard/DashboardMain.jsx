/*
    GLORY BE TO GOD,
    FORTIS-CODE,
    BY ISRAEL MAFABI EMMANUEL

    --- DASHBOARD ---
*/

import React, { useState, useEffect, useContext } from 'react';

// import LoadingSpinner from '../common/FortisLoadingSpinner';
import LoadingScreen from '../common/FortisLoadingScreen';
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
        return <LoadingScreen />;
    }

    if (error) {
        return <ErrorMessage className="fortis-code-error-major" message={error} />;
    }

    return (
        <DashboardLayout>
            <div className='fortis-code-dashboard-main'>
                {user && (
                    <div className='fortis-code-dashboard-main-container'>
                        <div className='fortis-code-welcome-text'>
                        {user.profile?.name ? "Welcome, " + user.profile.name + "!" : 
                            <div className='fortis-code-setup-heads-up'>
                                <p>Go to the&nbsp;
                                    <Link className='fortis-code-link-redirect' to="/account">
                                        Account Section
                                    </Link>
                                    &nbsp;and set-up your account credentials. <br />
                                    You've been awarded funds - participation funds. 
                                    </p>
                            </div>}
                        </div>
                        <div className='fortis-code-balance-text'>
                            <div className="balance"> <div className="symbol">FTK</div>{user.balance}</div>
                            <div className="indicator">Available balance</div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};