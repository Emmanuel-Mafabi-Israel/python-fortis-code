/*
    GLORY BE TO GOD,
    FORTIS-CODE,
    BY ISRAEL MAFABI EMMANUEL

    --- ACCOUNT INFORMATION ---
*/

import React, { useState, useEffect, useContext } from 'react';

import LoadingSpinner from '../common/FortisLoadingSpinner';
import ErrorMessage from '../common/FortisErrorMessage';

import { AuthContext } from '../../context/AuthContext'; // Import AuthContext
import api from '../api/api'; // Import the API functions

import DashboardLayout from '../layouts/DashboardLayout'

export default function AccountInfo() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useContext(AuthContext);

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
                <h2>Account Information</h2>
                {user && (
                    <>
                        <p>Email: {user.email}</p>
                        <p>Balance: {user.balance}</p>
                        {/* Display other user details as needed */}
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};