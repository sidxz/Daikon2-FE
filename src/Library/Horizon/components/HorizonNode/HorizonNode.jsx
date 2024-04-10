import React from "react";
import HNGene from "./HNodes/HNGene";
import HNHa from "./HNodes/HNHa";
import HNHitCollection from "./HNodes/HNHitCollection";
import HNPortfolio from "./HNodes/HNPortfolio";
import HNScreen from "./HNodes/HNScreen";
import HNTarget from "./HNodes/HNTarget";

const HorizonNode = ({
  dataObj,
  toggleNode,
  foreignObjectProps,
  entryPoint,
}) => {
  console.log(dataObj);

  switch (dataObj.type) {
    case "Gene":
      return <HNGene dataObj={dataObj} entryPoint={entryPoint} />;
    case "Target":
      return <HNTarget dataObj={dataObj} entryPoint={entryPoint} />;
    case "Screen":
      return <HNScreen dataObj={dataObj} entryPoint={entryPoint} />;
    case "HitCollection":
      return <HNHitCollection dataObj={dataObj} entryPoint={entryPoint} />;
    case "HitAssessment":
      return <HNHa dataObj={dataObj} entryPoint={entryPoint} />;
    case "Project":
      return <HNPortfolio dataObj={dataObj} entryPoint={entryPoint} />;
  }
  return <div>HorizonNode</div>;
};

export default HorizonNode;
