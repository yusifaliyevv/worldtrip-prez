import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (user && user.isAdmin) {
    return children;
  }

  return <Navigate to="/" replace />;
};

export default AdminRoute;
