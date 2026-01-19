import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleRoute = ({ role, children }) => {
  const { user } = useAuth();
  if (!user || user.role !== role) return <Navigate to="/login" />;
  return children;
};

export default RoleRoute;
