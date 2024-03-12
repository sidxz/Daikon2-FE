import React from "react";
import "./FlowDash.css";
import FlowDashCards from "./FlowDashCards/FlowDashCards";

const FlowDash = () => {
  return (
    <div className="FlowDash bg-bluegray-50 flex flex-column align-items-center w-full">
      <div className="flex">
        <p className="HeaderText text-xl font-medium">
          Data Acquisition, Integration and Knowledge Capture Application
        </p>
      </div>
      <div className="flex">
        <FlowDashCards />
      </div>
    </div>
  );
};

export default FlowDash;
