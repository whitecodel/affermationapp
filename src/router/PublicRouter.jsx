import React from "react";
import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";

export default function PublicRouter() {
  const isloggedIn = localStorage.getItem("ACCESS_TOKEN");

  return <> {!isloggedIn ? <Outlet /> : <Navigate to="/dashboard" />}</>;
}
