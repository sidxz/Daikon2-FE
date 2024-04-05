import React from "react";
import { GeneIcon } from "../../../../../Apps/Flow/icons/GeneIcon";

const HNGene = ({ dataObj, entryPoint }) => {
  return (
    <g
      onClick={() => {
        navigate(`/wf/gene/${dataObj?.id}`);
      }}
    >
      {dataObj?.id === entryPoint && (
        <foreignObject x="-70" y="-40" width="15rem" height="15rem">
          <div className="flex items-center p-0 m-0 w-15rem h-15rem border-1 border-green-200 border-circle"></div>
        </foreignObject>
      )}
      <foreignObject x="-20" y="-20" width="4rem" height="4rem">
        <div className="flex items-center border-circle bg-white border-50 p-0 m-0 w-3rem h-3rem border-0">
          <GeneIcon size={"35em"} />
        </div>
      </foreignObject>
      <foreignObject x="0" y="0" width="12rem" height="9rem">
        <div className="flex items-center border-50 p-0 m-0 w-12rem h-9rem border-0">
          <p>
            <b>Gene</b>
            <br />
            {dataObj?.attributes?.accessionNumber}
            <br />
            {dataObj?.attributes?.name}
            <br />
            {dataObj?.attributes?.functionalCategory}
          </p>
        </div>
      </foreignObject>
    </g>
  );
};

export default HNGene;
