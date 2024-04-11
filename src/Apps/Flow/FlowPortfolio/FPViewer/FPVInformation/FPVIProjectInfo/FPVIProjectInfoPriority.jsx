import React from "react";
import PortfolioPriorityGauge from "../../../shared/PortfolioPriorityGauge";
import PortfolioProbabilityGauge from "../../../shared/PortfolioProbabilityGauge";

const FPVIProjectInfoPriority = (project) => {
  return (
    <div className="flex flex-row">
      <div className="flex w-full align-items-center gap-7">
        <div className="flex">
          <PortfolioPriorityGauge />
        </div>

        <div className="flex">
          <PortfolioProbabilityGauge />
        </div>
      </div>
    </div>
  );
};

export default FPVIProjectInfoPriority;
