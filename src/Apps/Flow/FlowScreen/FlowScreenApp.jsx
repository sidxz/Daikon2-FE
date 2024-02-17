import React from "react";
import { Route, Routes } from "react-router";
import { Navigate } from "react-router-dom";
import FSDashboard from "./FSDashboard/FSDashboard";
import FSViewer from "./FSViewer/FSViewer";
const FlowScreenApp = () => {
  return (
    <>
      <Routes>
        <Route index element={<Navigate to="dash/" />} />
        <Route path="dash/*" element={<FSDashboard />} />
        <Route path=":id/*" element={<FSViewer />} />
      </Routes>
    </>
  );
};

export default FlowScreenApp;
