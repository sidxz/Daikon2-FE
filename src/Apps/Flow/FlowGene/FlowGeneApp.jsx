import React from "react";
import { Route, Routes } from "react-router";
import FGDashboard from "./FGDashboard/FGDashboard";
import FGViewer from "./FGViewer/FGViewer";

const FlowGeneApp = () => {
  return (
    <>
      <Routes>
        <Route index element={<FGDashboard />} />
        <Route path=":id/*" element={<FGViewer />} />
      </Routes>
    </>
  );
};

export default FlowGeneApp;
