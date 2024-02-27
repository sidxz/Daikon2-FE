import React from "react";
import { Route, Routes } from "react-router";
import { Navigate } from "react-router-dom";
import FHADashboard from "./FHADashboard/FHADashboard";
const FlowHAApp = () => {
  return (
    <>
      <Routes>
        <Route index element={<Navigate to="dash/" />} />
        <Route path="dash/*" element={<FHADashboard />} />
      </Routes>
    </>
  );
};

export default FlowHAApp;
