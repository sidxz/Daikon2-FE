import React from "react";

const FTVApconixGrid = () => {
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
    if (value === "H") return "bg-red-400";
    if (value === "M") return "bg-yellow-400";
    if (value === "L") return "bg-green-400";
    return "";
  };
  const showPriorityDot = (priority) => {
    if (priority){
        return (
            (<span className="pi pi-circle-fill"></span>
            )
        )
    }
    return (
        <></>
    )
  };

  let dataRender = data.map((item, index) => {
    return (
      <div className="flex w-full gap-4" key={index}>
        <div className="flex w-18rem p-2 align-items-left justify-content-left bg-teal-400 text-white">
          {item.Topic}
        </div>
        <div className={`flex gap-2 w-15rem p-2 align-items-center justify-content-center ${getColor(item.Impact)}`}>
          <div className="flex align-items-center justify-content-center">
          {item.Impact}
          </div>
          
          <div className="flex align-items-center justify-content-center">{item.ImpactPriority && showPriorityDot(item.ImpactPriority)}</div>
          
        </div>
        <div
          className={`flex gap-2 w-15rem p-2 align-items-center justify-content-center ${getColor(
            item.Likelihood
          )}`}
        >
          <div className="flex align-items-center justify-content-center">
          {item.Likelihood}
          </div>
          
          <div className="flex align-items-left justify-content-left">{item.LikelihoodPriority && showPriorityDot(item.LikelihoodPriority)}</div>
          
          
        </div>
      </div>
    );
  });

  return (
    <div className="flex flex-column w-full gap-2">
      <div className="flex w-full gap-1">
        <div className="flex w-20rem p-2 align-items-center justify-content-center"></div>
        <div className="flex w-15rem p-2 align-items-center justify-content-center">Impact</div>
        <div className="flex w-15rem p-2 align-items-center justify-content-center">Likelihood</div>
      </div>
      {dataRender}
    </div>
  );
};

export default FTVApconixGrid;
