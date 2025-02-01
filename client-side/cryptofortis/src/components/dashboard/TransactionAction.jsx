/*
    GLORY BE TO GOD,
    FORTIS-CODE,
    BY ISRAEL MAFABI EMMANUEL

    --- TRANSACTION ACTIONS ---
*/

import React, { useState, useContext, useEffect } from 'react';

import InputField from '../common/FortisInputField';
import Button from '../common/FortisButton';
import LoadingSpinner from '../common/FortisLoadingSpinner';
import ErrorMessage from '../common/FortisErrorMessage';
import SuccessMessage from '../common/FortisSuccessMessage';

import { AuthContext } from '../../context/AuthContext';
import api from '../api/api';
import DashboardLayout from '../layouts/DashboardLayout';

export default function TransactionAction() {
    const [recipient, setRecipient] = useState('');
    const [value, setValue] = useState('');
    const [method, setMethod] = useState('direct');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { token } = useContext(AuthContext);

    useEffect(() => {
        if (error) {
            console.log('Error State:', error);
            const timer = setTimeout(() => {
                setError('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        if (successMessage) {
            console.log('Success State:', successMessage);
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!recipient) {
            setError('Recipient email is required.');
            return;
        }

        if (!value) {
            setError('Transaction value is required.');
            return;
        }

        const parsedValue = parseFloat(value); // check if the value is a number
        if (isNaN(parsedValue)) {
            setError('Transaction value is not a valid number');
            return;
        }

        if (parsedValue <= 0) {
            setError('Transaction value must be greater than zero.');
            return;
        }

        setLoading(true);
        try {
            const response = await api.sendToken(token, { recipient, value: parsedValue, method });
            setSuccessMessage(response.message);
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
                        <div className="fortis-code-transaction-messages">
                            {error && <ErrorMessage className="fortis-code-error" message={error} />}
                            {successMessage && <SuccessMessage className="fortis-code-success" message={successMessage} />}
                        </div>
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
}