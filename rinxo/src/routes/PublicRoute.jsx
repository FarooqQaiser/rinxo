import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { API } from "../utils/auth.utils";

const PublicRoute = () => {
  const [checking, setChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await API.get("/auth/check");
        if (res.data.success) {
          setIsAuth(true);
        }
      } catch {
        setIsAuth(false);
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, []);

  if (checking) return  (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
)
  // If already logged in → block login/register
  return isAuth ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;
