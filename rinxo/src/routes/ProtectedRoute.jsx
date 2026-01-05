import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { API } from "../utils/auth.utils";

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await API.get("/auth/check");
        if (res.data.success) {
          setIsAuth(true);
          setUser(res.data.user);
        } else {
          setIsAuth(false);
        }
      } catch {
        setIsAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuth === null) return;
  // <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50">
  //   <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
  // </div>;
  if (!isAuth) return <Navigate to="/login" replace />;

  return React.Children.map(children, (child) =>
    React.isValidElement(child) ? React.cloneElement(child, { user }) : child
  );
};

export default ProtectedRoute;
