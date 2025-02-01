/*
    GLORY BE TO GOD,
    FORTIS-CODE,
    BY ISRAEL MAFABI EMMANUEL

    --- DASHBOARD ---
*/

import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';

import LoadingScreen from '../common/FortisLoadingScreen';
import ErrorMessage from '../common/FortisErrorMessage';

import DashboardLayout from '../layouts/DashboardLayout'

import { AuthContext } from '../../context/AuthContext'; // Import AuthContext
import api from '../api/api'; // Import the API functions


export default function DashboardMain() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const { token } = useContext(AuthContext); // Destructure token from context

    // derive loading state from user
    const loading = !user;

    const fetchUserDetails = useCallback(async () => {
        setError('');
        try {
            const data = await api.getUserDetails(token);
            setUser(data);
        } catch (err) {
            setError(err.message);
            setUser(null); // set user to null to trigger error state
        }
    }, [token]);


    useEffect(() => {
        fetchUserDetails();
    }, [fetchUserDetails]);


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
                                <p>Go to the 
                                    <Link className='fortis-code-link-redirect' to="/account">
                                        Account Section
                                    </Link>
                                     and set-up your account credentials. <br />
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