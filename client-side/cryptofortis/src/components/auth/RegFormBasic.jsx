/*
    GLORY BE TO GOD,
    FORTIS-CODE,
    BY ISRAEL MAFABI EMMANUEL

    --- REGISTRATION SCREEN BASIC ---
*/
import React, { useState } from 'react';

import InputField from '../common/FortisInputField';
import Button from '../common/FortisButton';
import LoadingSpinner from '../common/FortisLoadingSpinner';
import ErrorMessage from '../common/FortisErrorMessage';

import api from '../api/api';

export default function RegFormBasic({ onSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const validatePassword = () => {
        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return false;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return false;
        }

        if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
            setError("Password must contain at least one uppercase and one lowercase letter.");
            return false;
        }

        setError("") // remove errors
        return true
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('')
        if (!validatePassword()) {
            return;
        }

        setLoading(true);
        try {
            await api.register({ email, password });
            // Proceed to the next registration step
            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            setError(err.message);
        }
        
        setLoading(false);
    };

    return (
        <form className='fortis-code-registration-form' onSubmit={handleSubmit}>
            <div className="fortis-code-error-placeholder">
                {error && <ErrorMessage className="fortis-code-error" message={error} />}
            </div>
            <div className="fortis-code-form-inputs">
                <InputField
                    className="fortis-code-form-input-fields"
                    placeholder="A registered Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <InputField
                    className="fortis-code-form-input-fields"
                    placeholder="New Account Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <InputField
                    className="fortis-code-form-input-fields"
                    placeholder="Verify Password"
                    type="text"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </div>
            <div className="fortis-code-form-btn">
                <Button className={"fortis-code-btn-initiators"} type="submit" disabled={loading}>
                    {loading ? <LoadingSpinner /> : 'Next'}
                </Button>
            </div>
        </form>
    );
};