import { observer } from "mobx-react-lite";
import React from "react";
import { Route, Routes } from "react-router";
import { Navigate } from "react-router-dom";
import FHaDashboard from "./FHaDashboard/FHaDashboard";
import FHaNew from "./FHaNew/FHaNew";
import FHaViewer from "./FHaViewer/FHaViewer";
const FlowHaApp = () => {
  return (
    <>
      <Routes>
        <Route index element={<Navigate to="dash/" />} />
        <Route path="dash/*" element={<FHaDashboard />} />
        <Route path="viewer/:id/*" element={<FHaViewer />} />
        <Route path="new/*" element={<FHaNew />} />
      </Routes>
    </>
  );
};

export default observer(FlowHaApp);
