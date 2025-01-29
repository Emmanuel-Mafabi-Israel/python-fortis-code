/*
    GLORY BE TO GOD,
    FORTIS-CODE,
    BASIC UTILITY FUNCTIONS FOR AUTHENTICATIONS,
    BY ISRAEL MAFABI EMMANUEL
*/

const AUTH_TOKEN_KEY = 'authToken';

export const persistAuthToken = (token) => {
    // storing the authentication token to local storage
    localStorage.setItem(AUTH_TOKEN_KEY, token)
};

export const getPersistedAuthToken = (token) => {
    // retrieve stored authentication key...
    return localStorage.getItem(AUTH_TOKEN_KEY)
};

export const removePersistedAuthToken = (token) => {
    // clear stored data...
    localStorage.removeItem(AUTH_TOKEN_KEY)
}