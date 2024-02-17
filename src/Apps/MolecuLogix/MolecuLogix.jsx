import React from "react";
import { Route, Routes } from "react-router";
import MLogixDash from "./MLogixDash/MLogixDash";
import MLogixMenuBar from "./MLogixMenuBar/MLogixMenuBar";
import MLogixDraw from "./MlogixDraw/MLogixDraw";

const MolecuLogix = () => {
  return (
    <div className="flex flex-column">
      <div className="block mb-2">
        <MLogixMenuBar />
      </div>
      <div className="flex w-full pl-3 pr-3 fadein animation-duration-1000">
        <Routes>
          <Route index element={<MLogixDash />} />
          <Route path="dash/*" element={<MLogixDash />} />
          <Route path="draw/*" element={<MLogixDraw />} />
        </Routes>
      </div>
    </div>
  );
};

export default MolecuLogix;
