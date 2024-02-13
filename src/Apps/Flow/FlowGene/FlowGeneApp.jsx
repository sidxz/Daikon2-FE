import React from "react";
import { Route, Routes } from "react-router";
import FlowGeneDashboard from "./FlowGeneDashboard/FlowGeneDashboard";

const FlowGeneApp = () => {
  return (
    <>
      <Routes>
        <Route index element={<FlowGeneDashboard />} />
      </Routes>
    </>
  );
};

export default FlowGeneApp;
