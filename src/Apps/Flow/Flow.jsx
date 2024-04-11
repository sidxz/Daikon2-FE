import React from "react";
import { Route, Routes } from "react-router";
import FlowDash from "./FlowDash/FlowDash";
import FlowGeneApp from "./FlowGene/FlowGeneApp";
import FlowHaApp from "./FlowHA/FlowHaApp";
import FlowMenuBar from "./FlowMenuBar/FlowMenuBar";
import FlowPortfolioApp from "./FlowPortfolio/FlowPortfolioApp";
import FlowScreenApp from "./FlowScreen/FlowScreenApp";
import FlowTargetApp from "./FlowTarget/FlowTargetApp";

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
          <Route path="target/*" element={<FlowTargetApp />} />
          <Route path="screen/*" element={<FlowScreenApp />} />
          <Route path="ha/*" element={<FlowHaApp />} />
          <Route path="portfolio/*" element={<FlowPortfolioApp />} />
        </Routes>
      </div>
    </div>
  );
};

export default Flow;
