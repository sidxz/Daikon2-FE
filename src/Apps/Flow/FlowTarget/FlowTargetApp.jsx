import React from "react";
import { Route, Routes } from "react-router-dom";
import FTDashboard from "./FTDashboard/FTDashboard";

const FlowTarget = () => {
  return (
    <>
      <Routes>
        <Route index element={<FTDashboard />} />
      </Routes>
    </>
  );
};

export default FlowTarget;
