import React from "react";
import HNGene from "./HNodes/HNGene";
import HNHitCollection from "./HNodes/HNHitCollection";
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
  }
  return <div>HorizonNode</div>;
};

export default HorizonNode;
