/*
    GLORY BE TO GOD,
    FORTIS-CODE,
    BY ISRAEL MAFABI EMMANUEL

    --- REGISTRATION SCREEN PROFILE SETUP ---
*/
import React, { useState, useContext } from 'react';
import InputField from '../common/FortisInputField';
import Button from '../common/FortisButton';
import LoadingSpinner from '../common/FortisLoadingSpinner';
import ErrorMessage from '../common/FortisErrorMessage';
import api from '../api/api'; // Importing the API functions
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function RegFormProfile({ onSuccess, token }) {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login: authLogin } = useContext(AuthContext); // context login

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // Here we would add a function to our api.js file to handle updating the profile
            await api.updateUserProfile(token, { name }) // remove profile picture
            // proceed to the next registration step or complete registration
            if (onSuccess) {
                onSuccess();
            }
            authLogin(token); // log in with token before navigating to dashboard
            navigate('/dashboard')
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
                    placeholder="Your Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="fortis-code-form-btn">
                <Button className={"fortis-code-btn-initiators"} type="submit" disabled={loading}>
                    {loading ? <LoadingSpinner /> : 'Complete Registration'}
                </Button>
            </div>
        </form>
    );
};