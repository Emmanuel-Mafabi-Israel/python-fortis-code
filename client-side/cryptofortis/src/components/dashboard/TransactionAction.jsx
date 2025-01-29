/*
    GLORY BE TO GOD,
    FORTIS-CODE,
    BY ISRAEL MAFABI EMMANUEL

    --- TRANSACTION ACTIONS ---
*/

import React, { useState, useContext } from 'react';

import InputField from '../common/FortisInputField';
import Button from '../common/FortisButton';
import LoadingSpinner from '../common/FortisLoadingSpinner';
import ErrorMessage from '../common/FortisErrorMessage';

import { AuthContext } from '../../context/AuthContext';
import api from '../api/api'; // Import the API functions

import DashboardLayout from '../layouts/DashboardLayout'

export default function TransactionAction() {
    const [recipient, setRecipient] = useState('');
    const [value, setValue] = useState('');
    const [method, setMethod] = useState('direct');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { token } = useContext(AuthContext)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.sendToken(token, { recipient, value, method });
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <DashboardLayout>
            <div>
                <h2>Initiate Transaction</h2>
                <form onSubmit={handleSubmit}>
                    {error && <ErrorMessage message={error} />}
                    <InputField
                        label="Recipient Email"
                        type="email"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        required
                    />
                    <InputField
                        label="Value"
                        type="number"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        required
                    />
                    <select value={method} onChange={(e) => setMethod(e.target.value)}>
                        <option value="direct">Direct</option>
                        <option value="deposit">Deposit</option>
                    </select>

                    <Button type="submit" disabled={loading}>
                        {loading ? <LoadingSpinner /> : 'Send Token'}
                    </Button>
                </form>
            </div>
        </DashboardLayout>
    );
};