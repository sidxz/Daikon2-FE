import React from "react";
import { Route, Routes } from "react-router";
import { Navigate } from "react-router-dom";
import FPDashboard from "./FPDashboard/FPDashboard";
const FlowPortfolioApp = () => {
  return (
    <>
      <Routes>
        <Route index element={<Navigate to="dash/" />} />
        <Route path="dash/*" element={<FPDashboard />} />
      </Routes>
    </>
  );
};

export default FlowPortfolioApp;
