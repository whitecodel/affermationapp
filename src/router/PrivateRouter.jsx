import React from "react";
import { Outlet } from "react-router-dom";

import { Navigate } from "react-router-dom";
import DashboardLayout from "../pages/dashboard/DashboardLayout";


export default function PrivateRouter() {
  const isloggedIn = localStorage.getItem("ACCESS_TOKEN");
  // const { i18n } = useTranslation();

  return (
    <>
      {isloggedIn ? (
        <DashboardLayout>
          <Outlet />
          </DashboardLayout>
      
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
}
