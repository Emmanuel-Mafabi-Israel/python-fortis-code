/*
    GLORY BE TO GOD,
    FORTIS-CODE,
    BY ISRAEL MAFABI EMMANUEL

    --- TRANSACTION HISTORY ---
*/

import React, { useState, useEffect, useContext } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/api'; // Import the API functions

import DashboardLayout from '../layouts/DashboardLayout'

export default function TransactionHistory() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await api.getTransactions(token);
                setTransactions(data);
            } catch (err) {
                setError(err.message);
            }
            setLoading(false);
        };

        fetchTransactions();
    }, [token]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    return (
        <DashboardLayout>
            <div>
                <h2>Transaction History</h2>
                <ul>
                    {transactions.length > 0 ? (
                        transactions.map((transaction) => (
                            <li key={transaction.id}>
                                <p>Transaction Type: {transaction.transaction_type}</p>
                                <p>Value: {transaction.value}</p>
                                <p>Timestamp: {transaction.timestamp}</p>
                                {/*display other transaction info*/}
                            </li>
                        ))
                    ) : (
                        <p>No Transactions</p>
                    )}
                </ul>
            </div>
        </DashboardLayout>
    );
};