import React from "react";
import { Route, Routes } from "react-router";
import MLogixAllMolecules from "./MLogixAllMolecules/MLogixAllMolecules";
import MLogixDash from "./MLogixDash/MLogixDash";
import MLogixDraw from "./MLogixDraw/MLogixDraw";
import MLogixMenuBar from "./MLogixMenuBar/MLogixMenuBar";
import MLogixMoleculeView from "./MLogixMoleculeView/MLogixMoleculeView";
import MLogixSimilarSearch from "./MLogixSimilarSearch/MLogixSimilarSearch";

const MolecuLogix = () => {
  return (
    <div className="flex flex-column">
      <div className="block mb-2">
        <MLogixMenuBar />
      </div>
      <div className="flex w-full pl-3 pr-3 fadein animation-duration-1000">
        <Routes>
          <Route index element={<MLogixDash />} />
          <Route path="dash/" element={<MLogixDash />} />
          <Route path="all/" element={<MLogixAllMolecules />} />
          <Route path="molecule/:id" element={<MLogixMoleculeView />} />
          <Route path="search/:smiles" element={<MLogixSimilarSearch />} />
          <Route path="search/" element={<MLogixSimilarSearch />} />
          <Route path="draw/*" element={<MLogixDraw />} />
        </Routes>
      </div>
    </div>
  );
};

export default MolecuLogix;
