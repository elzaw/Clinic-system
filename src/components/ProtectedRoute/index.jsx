import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirect them to the login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  return element; // Render the protected component if authenticated
};

export default ProtectedRoute;
