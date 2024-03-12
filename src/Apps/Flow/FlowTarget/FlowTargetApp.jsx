import { observer } from "mobx-react-lite";
import React from "react";
import { Route, Routes } from "react-router-dom";
import FTDashboard from "./FTDashboard/FTDashboard";
import FTViewer from "./FTViewer/FTViewer";
const FlowTarget = () => {
  return (
    <>
      <Routes>
        <Route index element={<FTDashboard />} />
        <Route path=":id/*" element={<FTViewer />} />
      </Routes>
    </>
  );
};

export default observer(FlowTarget);
