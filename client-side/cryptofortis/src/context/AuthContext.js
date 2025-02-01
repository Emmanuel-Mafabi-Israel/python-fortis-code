/*
    GLORY BE TO GOD,
    FORTIS-CODE,
    USER AUTHENTICATION STATE HANDLER,
    BY ISRAEL MAFABI EMMANUEL
*/

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { persistAuthToken, getPersistedAuthToken, removePersistedAuthToken } from '../utils/authUtils';
import api from '../components/api/api'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(getPersistedAuthToken());
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const fetchUserDetails = useCallback(async (newToken) => {
        console.log("Fetching user details with token:", newToken);
        try {
            const data = await api.getUserDetails(newToken);
            setUser(data);
            console.log("User details fetched:", data);
        } catch (err) {
            console.error("Error fetching user details: ", err);
            removePersistedAuthToken();
            setToken(null);
            setIsAuthenticated(false);
            setUser(null);
            navigate("/login");
        }
    }, [navigate]);

    const login = useCallback(async (newToken) => {
        console.log("Login with token:", newToken);
        setIsLoading(true);
        setToken(newToken);
        setIsAuthenticated(true);
        persistAuthToken(newToken);
        setTimeout(() => {
            setIsLoading(false);
            navigate("/dashboard");
        }, 1000);
    }, [navigate]);

    const logout = useCallback(() => {
        console.log("Logout initiated");
        setIsLoading(true);
        console.log("Logout isLoading set to:", true);
        setTimeout(() => {
            setToken(null);
            setIsAuthenticated(false);
            setUser(null);
            removePersistedAuthToken();
            setIsLoading(false);
            console.log("Logout isLoading set to:", false);
            navigate("/login");
        }, 1000);
    }, [navigate]);

    useEffect(() => {
        console.log("useEffect triggered:", location.pathname, token);
        const initialToken = getPersistedAuthToken();
        if (initialToken && location.pathname === '/dashboard' && initialToken !== 'undefined') {
            setToken(initialToken);
            setIsAuthenticated(true);
            try {
                fetchUserDetails(initialToken);
            } catch (error) {
                console.error("Error on app load: ", error)
                removePersistedAuthToken()
                setToken(null);
                setIsAuthenticated(false);
                setUser(null);
                navigate("/login");
            }
        }
    }, [fetchUserDetails, location, navigate, token]);

    const value = {
        token,
        isAuthenticated,
        user,
        login,
        logout,
        isLoading,
        setUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};