/*
	GLORY BE TO GOD,
	FORTIS-CODE,
	BY ISRAEL MAFABI EMMANUEL
*/

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Welcome from './components/auth/Welcome';
import Login from './components/auth/Login';
import Registration from './components/auth/Registration';
import DashboardMain from './components/dashboard/DashboardMain';
import AccountInfo from './components/dashboard/AccountInfo';
import Notifications from './components/dashboard/Notifications';
import TransactionHistory from './components/dashboard/TransactionHistory';
import TransactionAction from './components/dashboard/TransactionAction';

import { AuthProvider, AuthContext } from './context/AuthContext';

// ProtectedRoute
const ProtectedRoute = ({ children }) => {
	const { isAuthenticated } = React.useContext(AuthContext);
	return isAuthenticated ? children : <Navigate to="/login" />;
};

export default function App() {
	return (
		<Router>
			<AuthProvider>
				<Routes>
					<Route path="/" element={<Welcome />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Registration />} />
					<Route path="/dashboard" element={
						<ProtectedRoute>
							<DashboardMain />
						</ProtectedRoute>
					} />
					<Route path="/account" element={
						<ProtectedRoute>
							<AccountInfo />
						</ProtectedRoute>
					} />
					<Route path="/notifications" element={
						<ProtectedRoute>
							<Notifications />
						</ProtectedRoute>
					} />
					<Route path="/transactions" element={
						<ProtectedRoute>
							<TransactionHistory />
						</ProtectedRoute>
					} />
					<Route path="/transact" element={
						<ProtectedRoute>
							<TransactionAction />
						</ProtectedRoute>
					} />
				</Routes>
			</AuthProvider>
		</Router>
	);
};