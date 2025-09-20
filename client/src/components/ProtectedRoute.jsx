import { Navigate } from "react-router-dom";

// Check authentication based on required role
const isAuthenticated = (requiredRole) => {
  if (requiredRole === "admin") {
    // For admin routes, check adminToken
    const adminToken = localStorage.getItem("adminToken");
    return { token: adminToken, role: adminToken ? "admin" : null };
  } else {
    // For user routes, check user token and role
    const userToken = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    return { token: userToken, role };
  }
};

export default function ProtectedRoute({ children, requiredRole = "admin" }) {
  const { token, role } = isAuthenticated(requiredRole);

  if (!token) {
    // Not logged in - redirect based on required role
    if (requiredRole === "admin") {
      return <Navigate to="/admin/login" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  if (requiredRole && role !== requiredRole) {
    // Logged in but wrong role
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
