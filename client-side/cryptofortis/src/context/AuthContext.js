/*
    GLORY BE TO GOD,
    FORTIS-CODE,
    USER AUTHENTICATION STATE HANDLER,
    BY ISRAEL MAFABI EMMANUEL
*/

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { persistAuthToken, getPersistedAuthToken, removePersistedAuthToken } from '../utils/authUtils';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(getPersistedAuthToken()); // Initialize from persisted token
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);
    const navigate = useNavigate();
    const login = useCallback((newToken) => {
        setToken(newToken);
        setIsAuthenticated(true);
        persistAuthToken(newToken); // Persist auth token
        // redirect to the dashboard page
        navigate("/dashboard");
    }, [navigate]);

    const logout = useCallback(() => {
        setToken(null);
        setIsAuthenticated(false);
        removePersistedAuthToken(); // Remove the token
        // setShouldNavigateToLogin(true) // for login redirection...
    }, []);

    useEffect(() => {
        setIsAuthenticated(!!token)
    }, [token])

    const value = {
        token,
        isAuthenticated,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};