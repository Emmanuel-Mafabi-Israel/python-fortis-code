/*
    GLORY BE TO GOD,
    FORTIS-CODE,
    BY ISRAEL MAFABI EMMANUEL

    --- DASHBOARD ---
*/

import React, { useState, useEffect, useContext } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import DashboardLayout from '../layouts/DashboardLayout'
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext
import api from '../../api/api'; // Import the API functions

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
            <div>
                {user && (
                    <>
                        <h2>Welcome to the Dashboard, {user.email}!</h2>
                        <p>Balance: {user.balance}</p>
                        {/* we'll Display other user details as needed 😉 */}
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};