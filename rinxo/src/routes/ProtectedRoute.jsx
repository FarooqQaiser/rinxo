import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom"; 
import { API } from "../utils/auth.utils";

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);
  const [role, setRole] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await API.get("/auth/check");
        if (res.data.success) {
          setIsAuth(true);
          setRole(res.data.user.role);
        } else {
          setIsAuth(false);
        }
      } catch (err) {
        console.error(err);
        setIsAuth(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuth === null) return <div>Loading...</div>;
  if (!isAuth) return <Navigate to="/login" replace />;

  return React.Children.map(children, child =>
    React.isValidElement(child) ? React.cloneElement(child, { role }) : child
  );
};

export default ProtectedRoute;
