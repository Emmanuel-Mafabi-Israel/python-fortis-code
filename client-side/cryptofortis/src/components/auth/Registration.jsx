/*
    GLORY BE TO GOD,
    FORTIS-CODE,
    BY ISRAEL MAFABI EMMANUEL

    --- REGISTRATION SCREEN ---
*/

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegFormBasic from './RegFormBasic';
import RegFormProfile from './RegFormProfile';

export default function Register() {
    const [registrationStage, setRegistrationStage] = useState(0);
    const navigate = useNavigate();

    const handleRegistrationSuccess = () => {
        setRegistrationStage(1); // Move to profile stage
    };

    const handleRegistrationComplete = () => {
        navigate("/dashboard"); // Redirect to dashboard after complete registration
    }
    const renderFormStage = () => {
        switch (registrationStage) {
            case 0:
                return <RegFormBasic onSuccess={handleRegistrationSuccess} />
            case 1:
                return <RegFormProfile onSuccess={handleRegistrationComplete} />
            default:
                return null;
        }
    }

    return (
        <div>
            <h2>Register</h2>
            {renderFormStage()}
        </div>
    );
};