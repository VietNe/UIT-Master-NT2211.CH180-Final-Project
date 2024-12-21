import { Navigate, useLocation } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import UserLayout from "../layouts/UserLayout";

const AuthGuard = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const userRole = localStorage.getItem("role") || "user";

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return userRole === "admin" ? <AdminLayout /> : <UserLayout />;
};

export default AuthGuard;
