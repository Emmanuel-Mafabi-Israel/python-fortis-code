/*
    GLORY BE TO GOD,
    FORTIS-CODE,
    BY ISRAEL MAFABI EMMANUEL

    --- TRANSACTION HISTORY ---
*/

import React, { useState, useEffect, useContext } from 'react';
import LoadingScreen from '../common/FortisLoadingScreen';
import ErrorMessage from '../common/FortisErrorMessage';

import { AuthContext } from '../../context/AuthContext';
import api from '../api/api';
import DashboardLayout from '../layouts/DashboardLayout';

export default function TransactionHistory() {
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState('');
    const { token, isLoading } = useContext(AuthContext);

    useEffect(() => {
        const fetchTransactions = async () => {
            setError('');
            try {
                const data = await api.getTransactions(token);
                setTransactions(data);
            } catch (err) {
                setError(err.message);
            }
        };
        if (token) {
            fetchTransactions();
        }
    }, [token]);

    if (error) {
        return <ErrorMessage className="fortis-code-error-major" message={error} />;
    }
    return (
        <DashboardLayout>
            {isLoading ? (<LoadingScreen />) : (
                <div className='fortis-code-dashboard-main-transactions'>
                    <div className='fortis-code-user'>
                        <div className='fortis-code-user-logo'>Transaction History</div>
                    </div>
                    <ul className='fortis-code-user-list'>
                        {transactions.length > 0 ? (
                            transactions.map((transaction) => (
                                <li className='fortis-code-user-list-item' key={transaction.id}>
                                    <p>Transaction Type: {transaction.transaction_type}</p>
                                    <p>Value: {transaction.value}</p>
                                    <p>Timestamp: {transaction.timestamp}</p>
                                    {/*display other transaction info*/}
                                </li>
                            ))
                        ) : (
                            <p className='fortis-code-user-nothing'>No Transactions</p>
                        )}
                    </ul>
                </div>
            )}
        </DashboardLayout>
    );
}