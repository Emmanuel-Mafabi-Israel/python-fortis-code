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
            <div className='fortis-code-dashboard-main-transact'>
                <div className='fortis-code-user'>
                    <div className='fortis-code-user-logo'>Initiate Transaction</div>
                    <div className='fortis-code-user-subheading'>Asset Transfer</div>
                </div>
                <form className='fortis-code-user-account-transaction-form' onSubmit={handleSubmit}>
                    <div className="fortis-code-transaction">
                        {error && <ErrorMessage className="fortis-code-error" message={error} />}
                        <InputField
                            className="fortis-code-form-input-fields"
                            placeholder="Recipient Email"
                            type="email"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            required
                        />
                        <InputField
                            className="fortis-code-form-input-fields"
                            placeholder="Token Amount"
                            type="number"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            required
                        />
                        <div className="fortis-code-form-interactive">
                            <select className="fortis-code-select" value={method} onChange={(e) => setMethod(e.target.value)} title='Select Transaction Type'>
                                <option value="direct">Direct</option>
                                <option value="deposit">Deposit</option>
                            </select>
                            <Button className="fortis-code-btn-initiators" type="submit" disabled={loading}>
                                {loading ? <LoadingSpinner /> : 'Send Token'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};