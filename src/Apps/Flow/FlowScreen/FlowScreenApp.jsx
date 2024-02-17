import React from "react";
import { Route, Routes } from "react-router";
import FSDashboard from "./FSDashboard/FSDashboard";
import FSViewer from "./FSViewer/FSViewer";
const FlowScreenApp = () => {
  return (
    <>
      <Routes>
        <Route index element={<FSDashboard />} />
        <Route path=":id/*" element={<FSViewer />} />
      </Routes>
    </>
  );
};

export default FlowScreenApp;
