import React from "react";
import { PhenoScreenIcon } from "../../../../../Apps/Flow/icons/PhenoScreenIcon";
import { ScreenIcon } from "../../../../../Apps/Flow/icons/ScreenIcon";

const HNScreen = ({ dataObj, entryPoint }) => {
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
        <div className="flex items-center p-0 m-0 w-3rem h-3rem">
          {dataObj?.attributes?.screenType === "target-based" ? (
            <ScreenIcon size={"30em"} />
          ) : (
            <PhenoScreenIcon size={"32em"} />
          )}
        </div>
      </foreignObject>
      <foreignObject x="0" y="0" width="12rem" height="10rem">
        <div className={"flex items-center p-0 m-0 w-12rem h-12rem"}>
          <p>
            <b>
              <span>
                {dataObj?.attributes?.screenType === "target-based"
                  ? "Screen"
                  : "Phenotypic Screen"}
              </span>
            </b>

            <br />
            {dataObj?.attributes?.name}

            <br />
            {dataObj?.attributes?.method}
            <br />
            {dataObj?.attributes?.primaryOrgName}
            <br />
            {dataObj?.attributes?.status}
          </p>
        </div>
      </foreignObject>
    </g>
  );
};

export default HNScreen;
