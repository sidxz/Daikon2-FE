import React from "react";
import { GeneIcon } from "../../../../../Apps/Flow/icons/GeneIcon";

const HNGene = ({ dataObj }) => {
  return (
    <g
      onClick={() => {
        navigate(`/wf/gene/${dataObj?.id}`);
      }}
    >
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
