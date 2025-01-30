/*
    GLORY BE TO GOD,
    FORTIS-CODE,
    BY ISRAEL MAFABI EMMANUEL

    --- ACCOUNT INFORMATION ---
*/

import React, { useState, useEffect, useContext, useCallback } from 'react';

import LoadingSpinner from '../common/FortisLoadingSpinner';
import ErrorMessage from '../common/FortisErrorMessage';
import InputField from '../common/FortisInputField';
import Button from '../common/FortisButton';

import { AuthContext } from '../../context/AuthContext'; // Import AuthContext
import api from '../api/api'; // Import the API functions

import DashboardLayout from '../layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';

export default function AccountInfo() {
    const [user, setUser]       = useState(null);
    const [name, setName]       = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState('');
    const { token, logout }     = useContext(AuthContext);
    const navigate              = useNavigate();

    const fetchUserDetails = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await api.getUserDetails(token);
            setUser(data);
            if (data && data.profile && data.profile.name) {
                setName(data.profile.name)
            }

        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    }, [token]);

    useEffect(() => {
        fetchUserDetails();
    }, [fetchUserDetails]);

    const handleNameChange = (e) => {
        setName(e.target.value)
    }

    const handleUpdateName = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.updateUserProfile(token, { name });
        } catch (err) {
            setError(err.message)
        }
        setLoading(false);
        // Refetch details after update
        fetchUserDetails();
    }

    const handleDeleteAccount = async () => {
        setLoading(true);
        setError('');
        try {
            await api.deleteUser(token);
            navigate('/account-deleted') // redirect to delete success page.
            logout();
        } catch (err) {
            setError(err.message)
            setLoading(false);
        }

    }

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorMessage className="fortis-code-error-major" message={error} />;
    }

    return (
        <DashboardLayout>
            <div className='fortis-code-dashboard-main-accounts'>
                <div className='fortis-code-user'>
                    <div className='fortis-code-user-logo'>{user.profile?.name ? user.profile.name : <div className='fortis-code-setup-heads-up'>Setup your account name please!</div>}</div>
                    <div className='fortis-code-user-subheading'>{user.email}</div>
                </div>
                {user && (
                    <div className='fortis-code-user-account-info'>
                        <div className='fortis-code-user-account-balance-dramatic'>
                            <div className='balance'>
                                <div className='symbol'>FTK</div>&nbsp;{user.balance}
                            </div>
                            <div className='indicator'>Available balance</div>
                        </div>
                        <div className="fortis-code-user-account-updates">
                            <form className='fortis-code-user-account-changes-form' onSubmit={handleUpdateName}>
                                <InputField
                                    className="fortis-code-form-input-fields"
                                    placeholder="Change Your Initials"
                                    type="text"
                                    value={name}
                                    onChange={handleNameChange}
                                />
                                <div className="fortis-code-form-btn">
                                    <Button className="fortis-code-btn-initiators" type="submit" disabled={loading}>
                                        {loading ? <LoadingSpinner /> : 'Update Name'}
                                    </Button>
                                </div>
                            </form>
                            <div className="fortis-code-form-btn">
                                <div className="title">Danger Zone</div>
                                <Button className="fortis-code-danger-btn" onClick={handleDeleteAccount}>
                                    Delete Account
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}