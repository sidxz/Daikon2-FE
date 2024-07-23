import React from "react";
import { FaGaugeSimpleHigh } from "react-icons/fa6";

const FTVSafetyAssessmentGrid = () => {
  let data = [
    {
      Topic: "Carcinogenesis",
      Impact: "M",
      ImpactPriority: false,
      Likelihood: "L",
      LikelihoodPriority: false,
    },
    {
      Topic: "Cardiovascular",
      Impact: "",
      ImpactPriority: false,
      Likelihood: "",
      LikelihoodPriority: false,
    },
    {
      Topic: "Endocrine",
      Impact: "M",
      ImpactPriority: false,
      Likelihood: "L",
      LikelihoodPriority: false,
    },
    {
      Topic: "Gastrointestinal",
      Impact: "",
      ImpactPriority: false,
      Likelihood: "",
      LikelihoodPriority: false,
    },
    {
      Topic: "Hematological and Immune",
      Impact: "",
      ImpactPriority: false,
      Likelihood: "",
      LikelihoodPriority: false,
    },
    {
      Topic: "Hepatobiliary",
      Impact: "",
      ImpactPriority: false,
      Likelihood: "",
      LikelihoodPriority: false,
    },
    {
      Topic: "Integumentary",
      Impact: "",
      ImpactPriority: false,
      Likelihood: "",
      LikelihoodPriority: false,
    },
    {
      Topic: "Nervous",
      Impact: "H",
      ImpactPriority: false,
      Likelihood: "L",
      LikelihoodPriority: false,
    },
    {
      Topic: "Embryofetal Developmental Toxicity",
      Impact: "H",
      ImpactPriority: true,
      Likelihood: "M",
      LikelihoodPriority: false,
    },
    {
      Topic: "Reproductive Female",
      Impact: "H",
      ImpactPriority: true,
      Likelihood: "M",
      LikelihoodPriority: false,
    },
    {
      Topic: "Reproductive Male",
      Impact: "",
      ImpactPriority: false,
      Likelihood: "",
      LikelihoodPriority: false,
    },
    {
      Topic: "Respiratory",
      Impact: "",
      ImpactPriority: false,
      Likelihood: "",
      LikelihoodPriority: false,
    },
    {
      Topic: "Sensory",
      Impact: "M",
      ImpactPriority: true,
      Likelihood: "M",
      LikelihoodPriority: false,
    },
    {
      Topic: "Urinary",
      Impact: "",
      ImpactPriority: false,
      Likelihood: "",
      LikelihoodPriority: false,
    },
  ];

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
          {item.Topic}
        </div>
        <div
          className={`flex gap-2 w-18rem p-2 align-items-center justify-content-center border-round-md ${getColor(
            item.Impact
          )}`}
        >
          <div className="flex align-items-center justify-content-center">
            {item.Impact}
          </div>

          <div className="flex align-items-center justify-content-center">
            {item.ImpactPriority && showPriorityDot(item.ImpactPriority)}
          </div>
        </div>
        <div
          className={`flex gap-2 w-18rem p-2 align-items-center justify-content-center border-round-md ${getColor(
            item.Likelihood
          )}`}
        >
          <div className="flex align-items-center justify-content-center">
            {item.Likelihood}
          </div>

          <div className="flex align-items-left justify-content-left">
            {item.LikelihoodPriority &&
              showPriorityDot(item.LikelihoodPriority)}
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
