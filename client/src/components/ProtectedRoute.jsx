import { Navigate } from "react-router-dom";

// Example: you might get this info from context, Redux, or Supabase
const isAuthenticated = () => {
  const token = localStorage.getItem("authToken"); // or Supabase session
  const role = localStorage.getItem("role");       // e.g., "admin" or "user"
  return { token, role };
};

export default function ProtectedRoute({ children, requiredRole = "admin" }) {
  const { token, role } = isAuthenticated();

  if (!token) {
    // Not logged in
    return <Navigate to="/admin/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // Logged in but wrong role
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
