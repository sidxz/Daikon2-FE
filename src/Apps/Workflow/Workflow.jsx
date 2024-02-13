import React from "react";
import { Route, Routes } from "react-router";
import WorkflowDash from "./WorkflowDash/WorkflowDash";
import WorkflowGene from "./WorkflowGene/WorkflowGene";
import WorkflowMenuBar from "./WorkflowMenuBar/WorkflowMenuBar";
import WorkflowTarget from "./WorkflowTarget/WorkflowTarget";

const Workflow = () => {
  return (
    <div className="flex flex-column">
      <div className="block mb-2">
        <WorkflowMenuBar />
      </div>
      <div className="flex w-full pl-3 pr-3 fadein animation-duration-1000">
        <Routes>
          <Route index element={<WorkflowDash />} />
          <Route path="gene/*" element={<WorkflowGene />} />
          <Route path="target/*" element={<WorkflowTarget />} />
        </Routes>
      </div>
    </div>
  );
};

export default Workflow;
