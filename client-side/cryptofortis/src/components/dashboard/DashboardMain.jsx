/*
    GLORY BE TO GOD,
    FORTIS-CODE,
    BY ISRAEL MAFABI EMMANUEL

    --- DASHBOARD ---
*/

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import ErrorMessage from '../common/FortisErrorMessage';
import LoadingScreen from '../common/FortisLoadingScreen';


import DashboardLayout from '../layouts/DashboardLayout';

import { AuthContext } from '../../context/AuthContext';

export default function DashboardMain() {
    const { user, isLoading, error } = useContext(AuthContext); // Destructure user, loading and error from the AuthContext.



    if (error) {
        return <ErrorMessage className="fortis-code-error-major" message={error} />;
    }

    return (
        <DashboardLayout>
            {isLoading ? (<LoadingScreen />) : (
                <div className='fortis-code-dashboard-main'>
                    {user && (
                        <div className='fortis-code-dashboard-main-container'>
                            <div className='fortis-code-welcome-text'>
                                {user.profile?.name ? (user.profile?.name === "FortisCode" ? "Welcome Admin!" : "Welcome, " + user.profile.name + "!") :
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
            )}
        </DashboardLayout>
    );
};