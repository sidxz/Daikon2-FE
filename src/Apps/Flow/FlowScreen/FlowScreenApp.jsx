import { observer } from "mobx-react-lite";
import React from "react";
import { Route, Routes } from "react-router";
import { Navigate } from "react-router-dom";
import FSDashboard from "./FSDashboard/FSDashboard";
import FSPhViewer from "./FSPhViewer/FSPhViewer";
import FSTbViewer from "./FSTbViewer/FSTbViewer";
import FSViewer from "./FSViewer/FSViewer";

const FlowScreenApp = () => {
  return (
    <>
      <Routes>
        <Route index element={<Navigate to="dash/" />} />
        <Route path="dash/*" element={<FSDashboard />} />
        <Route path="viewer/tb/:id/*" element={<FSTbViewer />} />
        <Route path="viewer/ph/:id/*" element={<FSPhViewer />} />
        <Route path=":id/*" element={<FSViewer />} />
      </Routes>
    </>
  );
};

export default observer(FlowScreenApp);
