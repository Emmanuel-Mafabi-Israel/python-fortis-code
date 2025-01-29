/*
    GLORY BE TO GOD,
    FORTIS-CODE,
    API LOGIC MANAGEMENT,
    BY ISRAEL MAFABI EMMANUEL
*/

const API_BASE_URL = 'http://localhost:5000'; // fortis-cryptofortis backend url

const defaultHeaders = {
    'Content-Type': 'application/json',
};

const apiCall = async (url, method = 'GET', body = null, headers = {}) => {
    const mergedHeaders = { ...defaultHeaders, ...headers };

    try {
        const options = {
            method,
            headers: mergedHeaders,
            ...(body ? { body: JSON.stringify(body) } : {}),
        };

        const response = await fetch(`${API_BASE_URL}${url}`, options);
        if (!response.ok) {
            const message = await response.json()
            throw new Error(message.message || 'Something went wrong');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw error; // Re-throw to let the caller handle it.
    }
};

// API call functions
const register         = (userData) => apiCall('/register', 'POST', userData);
const login            = (credentials) => apiCall('/login', 'POST', credentials);
const deleteUser       = (token) => apiCall('/user', 'DELETE', null, { 'Authorization': `Bearer ${token}` });
const getUserDetails   = (token) => apiCall('/user', 'GET', null, { 'Authorization': `Bearer ${token}` });
const sendToken        = (token, payload) => apiCall('/send_token', 'POST', payload, { 'Authorization': `Bearer ${token}` });
const getNotifications = (token) => apiCall('/notifications', 'GET', null, { 'Authorization': `Bearer ${token}` });
const getTransactions  = (token) => apiCall('/transactions', 'GET', null, { 'Authorization': `Bearer ${token}` });

const api = {
    register,
    login,
    deleteUser,
    getUserDetails,
    sendToken,
    getNotifications,
    getTransactions
};

export default api;