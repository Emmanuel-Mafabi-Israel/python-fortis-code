/*
    GLORY BE TO GOD,
    FORTIS-CODE,
    USER AUTHENTICATION STATE HANDLER,
    BY ISRAEL MAFABI EMMANUEL
*/

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { persistAuthToken, getPersistedAuthToken, removePersistedAuthToken } from '../utils/authUtils';
import api from '../components/api/api'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(getPersistedAuthToken());
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const fetchUserDetails = useCallback(async (newToken) => {
        try {
            const data = await api.getUserDetails(newToken);
            setUser(data);
        } catch (err) {
            console.error(err);
        }
    }, []);

    const login = useCallback(async (newToken) => {
        setToken(newToken);
        setIsAuthenticated(true);
        persistAuthToken(newToken);
        try {
            await fetchUserDetails(newToken);
            navigate("/dashboard");
        } catch(e) {
            removePersistedAuthToken(); // remove the incorrect token
            setToken(null);
            setIsAuthenticated(false);
            setUser(null);
            console.log("Error fetching user details after login: ", e);
             navigate("/login")
        }
    }, [navigate, fetchUserDetails]);

    const logout = useCallback(() => {
        setToken(null);
        setIsAuthenticated(false);
        setUser(null);
        removePersistedAuthToken();
    }, []);

    useEffect(() => {
        const initialToken = getPersistedAuthToken();
        if (initialToken) {
          setToken(initialToken);
          setIsAuthenticated(true);
          fetchUserDetails(initialToken);
        }
      }, [fetchUserDetails]);

    const value = {
        token,
        isAuthenticated,
        user,
        login,
        logout,
        setUser  // Including setUser to update the user state in child components
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};