import React from "react";
import { Route, Routes } from "react-router";
import FlowDash from "./FlowDash/FlowDash";
import FlowGeneApp from "./FlowGene/FlowGeneApp";
import FlowMenuBar from "./FlowMenuBar/FlowMenuBar";
import FlowScreenApp from "./FlowScreen/FlowScreenApp";
import FlowTarget from "./FlowTarget/FlowTarget";

const Flow = () => {
  return (
    <div className="flex flex-column">
      <div className="block mb-2">
        <FlowMenuBar />
      </div>
      <div className="flex w-full pl-3 pr-3 fadein animation-duration-1000">
        <Routes>
          <Route index element={<FlowDash />} />
          <Route path="gene/*" element={<FlowGeneApp />} />
          <Route path="target/*" element={<FlowTarget />} />
          <Route path="screen/*" element={<FlowScreenApp />} />
        </Routes>
      </div>
    </div>
  );
};

export default Flow;
