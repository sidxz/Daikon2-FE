import React from "react";
import { Route, Routes } from "react-router";
import { Navigate } from "react-router-dom";
import FPPDashboard from "./FPPDashboard/FPPDashboard";
import FPPViewer from "./FPPViewer/FPPViewer";
const FlowPostPortfolioApp = () => {
  return (
    <>
      <Routes>
        <Route index element={<Navigate to="dash/" />} />
        <Route path="dash/*" element={<FPPDashboard />} />
        <Route path="viewer/:id/*" element={<FPPViewer />} />
      </Routes>
    </>
  );
};

export default FlowPostPortfolioApp;
