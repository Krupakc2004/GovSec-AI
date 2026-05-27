import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
	const token = sessionStorage.getItem("govsec_token");
	const userStr = sessionStorage.getItem("govsec_user");

	if (!token || !userStr) {
		return <Navigate to="/signin" replace />;
	}

	if (requiredRole) {
		try {
			const user = JSON.parse(userStr);
			if (user.role !== requiredRole) {
				return <Navigate to="/signin" replace />;
			}
		} catch {
			return <Navigate to="/signin" replace />;
		}
	}

	return children;
};

export default ProtectedRoute;
