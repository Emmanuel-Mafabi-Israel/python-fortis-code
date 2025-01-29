/*
    GLORY BE TO GOD,
    FORTIS-CODE,
    BY ISRAEL MAFABI EMMANUEL

    --- LOGIN SCREEN ---
*/

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import InputField from '../common/FortisInputField';
import Button from '../common/FortisButton';
import LoadingSpinner from '../common/FortisLoadingSpinner';
import ErrorMessage from '../common/FortisErrorMessage';

import { AuthContext } from '../../context/AuthContext'; // Import AuthContext
import api from '../api/api'; // Import the API functions

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login: authLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const data = await api.login({ email, password }); // login with api function
            authLogin(data.access_token)
            navigate('/dashboard'); // Redirect to dashboard
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
                {loading ? <LoadingSpinner /> : 'Login'}
            </Button>
        </form>
    );
};