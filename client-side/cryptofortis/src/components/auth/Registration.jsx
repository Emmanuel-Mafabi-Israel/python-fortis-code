/*
    GLORY BE TO GOD,
    FORTIS-CODE,
    BY ISRAEL MAFABI EMMANUEL

    --- REGISTRATION SCREEN ---
*/

import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegFormBasic from './RegFormBasic';
import { AuthContext } from '../../context/AuthContext';

export default function Registration() {
    const navigate = useNavigate();
    const { login: authLogin } = React.useContext(AuthContext)

    const handleRegistrationSuccess = async (data) => {
        authLogin(data.access_token);
        navigate('/login');
    };

    return (
        <div className='fortis-code-registration'>
            <div className="fortis-code-registration-container">
                <div className='fortis-code-org'>
                    <div className='fortis-code-logo'>Fortis<b className='gray'>Code</b></div>
                    <div className='fortis-code-subheading'>Create Your Fortis<b>Code</b>&nbsp;Account</div>
                </div>
                <RegFormBasic onSuccess={handleRegistrationSuccess}/>
            </div>
        </div>
    );
};