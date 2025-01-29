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

import api from '../api/api'

export default function RegFormBasic({ onSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
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
        <form onSubmit={handleSubmit}>
            {error && <ErrorMessage message={error} />}
            <InputField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <InputField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <Button type="submit" disabled={loading}>
                {loading ? <LoadingSpinner /> : 'Next'}
            </Button>
        </form>
    );
};