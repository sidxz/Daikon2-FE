import React from "react";
import { FaGaugeSimpleHigh } from "react-icons/fa6";
import { DVariableResolver } from "../../../../../Shared/DVariable/DVariableResolver";

const FTVSafetyAssessmentGrid = ({ data }) => {
  // filter the data and remove topic = mammalian-off-target or mtb-drug-binding-domain or source
  data = data.filter(
    (item) =>
      DVariableResolver(item.topic) !== "mammalian-off-target" &&
      DVariableResolver(item.topic) !== "mtb-drug-binding-domain" &&
      DVariableResolver(item.topic) !== "source"
  );

  let getColor = (value) => {
    if (value === "H") return "bg-red-300";
    if (value === "M") return "bg-yellow-300";
    if (value === "L") return "bg-green-300";
    return "";
  };
  const showPriorityDot = (priority) => {
    if (priority) {
      return <FaGaugeSimpleHigh />;
    }
    return <></>;
  };

  let dataRender = data.map((item, index) => {
    return (
      <div className="flex gap-2 max-w-min	 border-1 border-50" key={index}>
        <div className="flex w-18rem p-2 align-items-left justify-content-left text-base bg-blue-50 text-blue-900">
          {DVariableResolver(item?.topic)}
        </div>
        <div
          className={`flex gap-2 w-18rem p-2 align-items-center justify-content-center border-round-md ${getColor(
            DVariableResolver(item?.impact)
          )}`}
        >
          <div className="flex align-items-center justify-content-center">
            {DVariableResolver(item?.impact)}
          </div>

          <div className="flex align-items-center justify-content-center">
            {DVariableResolver(item?.impactPriority) &&
              showPriorityDot(DVariableResolver(item?.impactPriority))}
          </div>
        </div>
        <div
          className={`flex gap-2 w-18rem p-2 align-items-center justify-content-center border-round-md ${getColor(
            DVariableResolver(item?.likelihood)
          )}`}
        >
          <div className="flex align-items-center justify-content-center">
            {DVariableResolver(item?.likelihood)}
          </div>

          <div className="flex align-items-left justify-content-left">
            {DVariableResolver(item?.likelihoodPriority) &&
              showPriorityDot(DVariableResolver(item?.likelihoodPriority))}
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="flex flex-column gap-2 ">
      <h4>Potential organ toxicity if the mammalian target is engaged </h4>
      <div className="flex gap-2 ">
        <div className="flex gap-2 w-18rem p-2 align-items-center justify-content-center"></div>
        <div className="flex gap-2 w-18rem p-2 align-items-center justify-content-center text-base bg-blue-50 text-blue-900">
          Impact
        </div>
        <div className="flex gap-2 w-18rem p-2 align-items-center justify-content-center text-base bg-blue-50 text-blue-900">
          Likelihood
        </div>
      </div>
      {dataRender}
    </div>
  );
};

export default FTVSafetyAssessmentGrid;
