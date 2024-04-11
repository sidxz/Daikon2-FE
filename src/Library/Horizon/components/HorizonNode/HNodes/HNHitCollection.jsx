import React from "react";
import { HitCollectionIcon } from "../../../../../Apps/Flow/icons/HitCollectionIcon";

const HNHitCollection = ({ dataObj, entryPoint }) => {
  return (
    <g
      onClick={() => {
        navigate(`/wf/gene/${dataObj?.id}`);
      }}
    >
      {dataObj?.id === entryPoint && (
        <foreignObject x="-45" y="-55" width="13rem" height="13rem">
          <div className="flex items-center p-0 m-2 w-12rem h-12rem border-1 border-dashed border-green-200 border-circle"></div>
        </foreignObject>
      )}
      <foreignObject x="-20" y="-20" width="4rem" height="4rem">
        <div className="flex items-center border-circle border-50 p-0 m-0 w-3rem h-3rem border-0">
          <HitCollectionIcon size={"30em"} />
        </div>
      </foreignObject>
      <foreignObject x="0" y="0" width="12rem" height="9rem">
        <div className="flex items-center border-50 p-0 m-0 w-12rem h-9rem border-0">
          <p>
            <b>Hit Collection</b>
            <br />
            {dataObj?.attributes?.name}
            <br />
            {dataObj?.attributes?.hitCollectionType}
            <br />
            {dataObj?.attributes?.bucket}
          </p>
        </div>
      </foreignObject>
    </g>
  );
};

export default HNHitCollection;
