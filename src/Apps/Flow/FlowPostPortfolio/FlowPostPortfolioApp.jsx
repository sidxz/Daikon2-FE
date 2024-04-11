import React from "react";
import { Route, Routes } from "react-router";
import { Navigate } from "react-router-dom";
import FPPDashboard from "./FPPDashboard/FPPDashboard";
const FlowPostPortfolioApp = () => {
  return (
    <>
      <Routes>
        <Route index element={<Navigate to="dash/" />} />
        <Route path="dash/*" element={<FPPDashboard />} />
      </Routes>
    </>
  );
};

export default FlowPostPortfolioApp;
