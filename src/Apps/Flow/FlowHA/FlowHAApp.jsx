import { observer } from "mobx-react-lite";
import React from "react";
import { Route, Routes } from "react-router";
import { Navigate } from "react-router-dom";
import FHANew from "./FHANew/FHANew";
import FHAViewer from "./FHAViewer/FHAViewer";
import FHaDashboard from "./FHaDashboard/FHaDashboard";
const FlowHaApp = () => {
  return (
    <>
      <Routes>
        <Route index element={<Navigate to="dash/" />} />
        <Route path="dash/*" element={<FHaDashboard />} />
        <Route path="viewer/:id/*" element={<FHAViewer />} />
        <Route path="new/*" element={<FHANew />} />
      </Routes>
    </>
  );
};

export default observer(FlowHaApp);
