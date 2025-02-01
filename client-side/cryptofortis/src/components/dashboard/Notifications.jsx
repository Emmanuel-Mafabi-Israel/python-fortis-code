/*
    GLORY BE TO GOD,
    FORTIS-CODE,
    BY ISRAEL MAFABI EMMANUEL

    --- NOTIFICATIONS ---
*/

import React, { useState, useEffect, useContext, useCallback } from 'react';

import ErrorMessage from '../common/FortisErrorMessage';
import Button from '../common/FortisButton';

import { AuthContext } from '../../context/AuthContext';
import api from '../api/api';
import DashboardLayout from '../layouts/DashboardLayout';
import LoadingScreen from '../common/FortisLoadingScreen';


export default function Notifications() {
    const [notifications, setNotifications] = useState(null);
    const [error, setError] = useState('');
     const { token, isLoading } = useContext(AuthContext);

    const fetchNotifications = useCallback(async () => {
        setError('');
        try {
            const data = await api.getNotifications(token);
            setNotifications(data);
        } catch (err) {
            setError(err.message);
            setNotifications(null);
        }
    }, [token]);

    useEffect(() => {
          if(token) {
        fetchNotifications();
          }
    }, [fetchNotifications, token]);

    if (error) {
        return <ErrorMessage className="fortis-code-error-major" message={error} />;
    }

    return (
         <DashboardLayout>
            { isLoading ? <LoadingScreen />: (
                <div className='fortis-code-dashboard-main-notifications'>
                    <div className='fortis-code-user'>
                        <div className='fortis-code-user-logo'>Notifications</div>
                        <Button className='fortis-code-btn-initiators' onClick={fetchNotifications}>Refresh</Button>
                    </div>
                    <ul className='fortis-code-user-list'>
                        {notifications?.length > 0 ? (
                            notifications.map((notification) => (
                                <li className='fortis-code-user-list-item' key={notification.id}>
                                    <p>Message: {notification.message}</p>
                                </li>
                            ))
                        ) : (
                            <p className='fortis-code-user-nothing'>No Notifications</p>
                        )}
                    </ul>
                </div>
             )}
         </DashboardLayout>
    );
}