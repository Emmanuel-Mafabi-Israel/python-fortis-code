/*
    GLORY BE TO GOD,
    FORTIS-CODE,
    BY ISRAEL MAFABI EMMANUEL

    --- NOTIFICATIONS ---
*/
import React, { useState, useEffect, useContext, useCallback } from 'react';

import LoadingSpinner from '../common/FortisLoadingSpinner';
import ErrorMessage from '../common/FortisErrorMessage';
import Button from '../common/FortisButton';

import { AuthContext } from '../../context/AuthContext';
import api from '../api/api'; // Import the API functions

import DashboardLayout from '../layouts/DashboardLayout'

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useContext(AuthContext);

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await api.getNotifications(token);
            setNotifications(data);
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    }, [token]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    return (
        <DashboardLayout>
            <div>
                <h2>Notifications</h2>
                <Button onClick={fetchNotifications}>Refresh Notifications</Button>
                <ul>
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <li key={notification.id}>
                                <p>Message: {notification.message}</p>
                            </li>
                        ))
                    ) : (
                        <p>No Notifications</p>
                    )}
                </ul>
            </div>
        </DashboardLayout>
    );
};