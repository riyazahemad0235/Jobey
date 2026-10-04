import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { JobContext } from "../context/JobContext";

function ProtectedRoute({ children }) {
  const { userData, authLoading } = useContext(JobContext);

  if (authLoading) {
    return <p>Checking login...</p>;
  }

  if (!userData) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
