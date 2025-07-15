import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
// import PageNotFound from "../modules/page-not-found";

import Register from "../pages/Register";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import DashboardPage from "../pages/dashboard/DashboardPage";
import PublicRouter from "./PublicRouter";
import PrivateRouter from "./PrivateRouter";
import ResetPassword from "../pages/ResetPassword";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import Profile from "../pages/Profile";
import AffirmationCreator from "../pages/affermation/AffirmationCreator";
import FreeSoundSearch from "../customHook/useFreeSound";
import VerifyOtp from "../pages/VerifyOtp";

export default function MainRoute() {
  return (
    <>
      <Routes>
        <Route path="/" element={<PublicRouter />}>
        <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
         
          {/* <Route path="/dashboard" element={<DashboardLayout />} /> */}
         
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />

         
        </Route>

        <Route path="/" element={<PrivateRouter />}>
        
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/affermation" element={<AffirmationCreator />} />
        {/* <Route path="/free" element={<FreeSoundSearch  />} /> */}

       

        </Route>

      </Routes>
    </>
  );
}
