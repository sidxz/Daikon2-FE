import React from "react";
import { Route, Routes } from "react-router";
import { Navigate } from "react-router-dom";
import FHADashboard from "./FHADashboard/FHADashboard";
import FHAViewer from "./FHAViewer/FHAViewer";
const FlowHAApp = () => {
  return (
    <>
      <Routes>
        <Route index element={<Navigate to="dash/" />} />
        <Route path="dash/*" element={<FHADashboard />} />
        <Route path="viewer/:id/*" element={<FHAViewer />} />
      </Routes>
    </>
  );
};

export default FlowHAApp;
