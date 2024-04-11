import React from "react";
import PostPortfolioPriorityGauge from "../../../shared/PostPortfolioPriorityGauge";
import PostPortfolioProbabilityGauge from "../../../shared/PostPortfolioProbabilityGauge";

const FPPVIProjectInfoPriority = (project) => {
  return (
    <div className="flex flex-row">
      <div className="flex w-full align-items-center gap-7">
        <div className="flex">
          <PostPortfolioPriorityGauge />
        </div>

        <div className="flex">
          <PostPortfolioProbabilityGauge />
        </div>
      </div>
    </div>
  );
};

export default FPPVIProjectInfoPriority;
