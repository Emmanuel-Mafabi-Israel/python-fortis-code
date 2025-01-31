/*
  GLORY BE TO GOD,
  FORTIS-CODE,
  API LOGIC MANAGEMENT,
  BY ISRAEL MAFABI EMMANUEL
*/

// fortis-cryptofortis server url
const API_BASE_URL = (environment = "DEVELOPMENT") => environment.toUpperCase() === "PRODUCTION" ? 'https://cryptofortis-server.onrender.com' : 'http://127.0.0.1:5000';

const defaultHeaders = {
    'Content-Type': 'application/json',
};

const apiCall = async (url, method = 'GET', body = null, headers = {}) => {
    const mergedHeaders = { ...defaultHeaders, ...headers };
    const options = {
        method,
        headers: mergedHeaders
    };

    if (body) {
        options.body = JSON.stringify(body)
    }

    try {
        const SERVER_RESPONSE = await fetch(`${API_BASE_URL("PRODUCTION")}${url}`, options)
        if(SERVER_RESPONSE.ok) {
            const DATA = await SERVER_RESPONSE.json();
            return DATA; 
        } else {
            let ERROR_MESSAGE = `Request failed with status: ${SERVER_RESPONSE.status}`
            try {
                const ERROR_DATA = await SERVER_RESPONSE.json()
                ERROR_MESSAGE = ERROR_DATA.error || ERROR_DATA.message || `Request failed with status: ${SERVER_RESPONSE.status}`
            } catch (jsonError) {
                ERROR_MESSAGE = `Error: ${await SERVER_RESPONSE.text()} or Request failed with status: ${SERVER_RESPONSE.status}`;
            }

            // for debugging purposes...
            console.log(ERROR_MESSAGE)
            throw new Error(ERROR_MESSAGE)
        }
    } catch (API_ERROR) {
        console.log(`API error: ${API_ERROR}`)
        throw API_ERROR;
    }
};

// API call functions
const register          = (userData) => apiCall('/register', 'POST', userData);
const login             = (credentials) => apiCall('/login', 'POST', credentials);
const deleteUser        = (token) => apiCall('/user', 'DELETE', null, { 'Authorization': `Bearer ${token}` });
const getUserDetails    = (token) => apiCall('/user', 'GET', null, { 'Authorization': `Bearer ${token}` });
const sendToken         = (token, payload) => apiCall('/send_token', 'POST', payload, { 'Authorization': `Bearer ${token}` });
const getNotifications  = (token) => apiCall('/notifications', 'GET', null, { 'Authorization': `Bearer ${token}` });
const getTransactions   = (token) => apiCall('/transactions', 'GET', null, { 'Authorization': `Bearer ${token}` });
const updateUserProfile = (token, payload) => apiCall('/user', 'PATCH', payload, { 'Authorization': `Bearer ${token}` });

const api = {
    register,
    login,
    deleteUser,
    getUserDetails,
    sendToken,
    getNotifications,
    getTransactions,
    updateUserProfile
};

export default api;