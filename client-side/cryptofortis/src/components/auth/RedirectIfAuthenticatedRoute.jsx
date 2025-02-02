/*
    GLORY BE TO GOD,
    FORTIS-CODE,
    BY ISRAEL MAFABI EMMANUEL

    --- PAGE REDIRECTIONS ---
*/

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const RedirectIfAuthenticatedRoute = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);
    return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

export default RedirectIfAuthenticatedRoute;