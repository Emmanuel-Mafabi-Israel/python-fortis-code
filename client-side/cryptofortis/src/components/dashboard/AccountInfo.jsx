/*
    GLORY BE TO GOD,
    FORTIS-CODE,
    BY ISRAEL MAFABI EMMANUEL

    --- ACCOUNT INFORMATION ---
*/

import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import LoadingScreen from '../common/FortisLoadingScreen';
import ErrorMessage from '../common/FortisErrorMessage';
import InputField from '../common/FortisInputField';
import Button from '../common/FortisButton';
import { AuthContext } from '../../context/AuthContext';
import api from '../api/api';
import DashboardLayout from '../layouts/DashboardLayout';

export default function AccountInfo() {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const { token, logout, setUser: setUserContext, isLoading } = useContext(AuthContext);
    const navigate = useNavigate();


    const fetchUserDetails = useCallback(async () => {
        setError('');
        try {
            const data = await api.getUserDetails(token);
            setUser(data);
            if (data && data.profile && data.profile.name) {
                setName(data.profile.name);
            } else {
                setName(""); // set empty if no name is set
            }
        } catch (err) {
            setError(err.message);
            setUser(null);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            fetchUserDetails();
        }
    }, [fetchUserDetails, token]);

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleUpdateName = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const updatedUser = await api.updateUserProfile(token, { name });
            if (updatedUser) {
                setUser(updatedUser);
                setUserContext(updatedUser);
            } else {
                setError("Failed to update profile");
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteAccount = async () => {
        setError('');
        try {
            await api.deleteUser(token);
            logout();
            navigate('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    // trigger text -> new user's will have to setup their account names...
    const namePlaceholder = user?.profile?.name ? "Change Your Initials" : "Set Up Your Initials";
    const userLogoText = user?.profile?.name ? user?.profile?.name : "Set Up Your Initials";


    if (error) {
        return <ErrorMessage className="fortis-code-error-major" message={error} />;
    }

    return (
        <DashboardLayout>
            {isLoading ? (<LoadingScreen />) : (
                <div className='fortis-code-dashboard-main-accounts'>
                    <div className='fortis-code-user'>
                        <div className='fortis-code-user-logo'>{userLogoText}</div>
                        <div className='fortis-code-user-subheading'>{user?.email}</div>
                    </div>
                    {user && (
                        <div className='fortis-code-user-account-info'>
                            <div className='fortis-code-user-account-balance-dramatic'>
                                <div className='balance'>
                                    <div className='symbol'>FTK</div> {user.balance}
                                </div>
                                <div className='indicator'>Available balance</div>
                            </div>
                            <div className="fortis-code-user-account-updates">
                                <form className='fortis-code-user-account-changes-form' onSubmit={handleUpdateName}>
                                    <InputField
                                        className="fortis-code-form-input-fields"
                                        placeholder={namePlaceholder}
                                        type="text"
                                        value={name}
                                        onChange={handleNameChange}
                                    />
                                    <div className="fortis-code-form-btn">
                                        <Button className="fortis-code-btn-initiators" type="submit">
                                            Update Name
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
            )}
        </DashboardLayout>
    );
}