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
        <div className='fortis-code-login'>
            <div className="fortis-code-login-container">
                <div className='fortis-code-org'>
                    <div className='fortis-code-logo'>Fortis<b className='gray'>Code</b></div>
                    <div className='fortis-code-subheading'>Login to Your Fortis<b>Code</b>&nbsp;Account</div>
                </div>
                <form className='fortis-code-login-form' onSubmit={handleSubmit}>
                    <div className="fortis-code-error-placeholder">
                        {error && <ErrorMessage className="fortis-code-error" message={error} />}
                    </div>
                    <div className="fortis-code-form-inputs">
                        <InputField
                            className="fortis-code-form-input-fields"
                            placeholder="Registered Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <InputField
                            className="fortis-code-form-input-fields"
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="fortis-code-form-btn">
                        <Button className={"fortis-code-btn-initiators"} type="submit" disabled={loading}>
                            {loading ? <LoadingSpinner /> : 'Login'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};