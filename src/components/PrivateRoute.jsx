import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn } from "../utils/Credentials";
import { ROUTES } from "../utils/Constants";

const PrivateRoute = () => {
  return isLoggedIn() ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
};

export default PrivateRoute;
