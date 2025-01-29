/*
    GLORY BE TO GOD,
    FORTIS-CODE,
    BY ISRAEL MAFABI EMMANUEL

    --- REGISTRATION SCREEN PROFILE SETUP ---
*/

import React, { useState } from 'react'; // also add useContext

import InputField from '../common/FortisInputField';
import Button from '../common/FortisButton';
import LoadingSpinner from '../common/FortisLoadingSpinner';
import ErrorMessage from '../common/FortisErrorMessage';
// import api from '../../api/api'; // Importing the API functions
// import { AuthContext } from '../../context/AuthContext';

export default function RegFormProfile({ onSuccess }) {
    // const { token } = useContext(AuthContext)
    const [name, setName] = useState('');
    const [profile_picture, setProfilePicture] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // Here we would add a function to our api.js file to handle updating the profile
            // await api.updateUserProfile(token, { name, profile_picture })
            // proceed to the next registration step or complete registration
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
                label="Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <InputField
                label="Profile Picture URL"
                type="text"
                value={profile_picture}
                onChange={(e) => setProfilePicture(e.target.value)}
            />
            <Button type="submit" disabled={loading}>
                {loading ? <LoadingSpinner /> : 'Complete Registration'}
            </Button>
        </form>
    );
};