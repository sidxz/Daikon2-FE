import React from "react";
import FlowDashCards from "./FlowDashCards/FlowDashCards";

const FlowDash = () => {
  return (
    <div className="Home surface-50 flex flex-column align-items-center w-full pb-4 pl-5 pr-5 ml-5 mr-5">
      <div className="flex">
        <h1>Data Acquisition, Integration and Knowledge Capture Application</h1>
      </div>
      <div className="flex">
        <FlowDashCards />
      </div>
    </div>
  );
};

export default FlowDash;
