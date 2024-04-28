import React from "react";
import { useNavigate } from "react-router-dom";
import { HAIcon } from "../../../../../Apps/Flow/icons/HAIcon";
import { AppOrgResolver } from "../../../../../Shared/VariableResolvers/AppOrgResolver";

const HNHa = ({ dataObj, entryPoint }) => {
  const { getOrgAliasById } = AppOrgResolver();
  const navigate = useNavigate();
  return (
    <g
      onClick={() => {
        navigate(`/wf/ha/viewer/${dataObj?.id}`);
      }}
      style={{
        filter:
          dataObj?.attributes?.isHAComplete === "True" &&
          dataObj?.attributes?.isHASuccess === "False"
            ? "grayscale(100%)"
            : "none",
      }}
    >
      {dataObj?.id === entryPoint && (
        <foreignObject x="-30" y="-40" width="12rem" height="12rem">
          <div className="flex items-center p-0 m-0 w-11rem h-11rem border-1 border-dashed border-green-200 border-circle"></div>
        </foreignObject>
      )}
      <foreignObject x="-20" y="-20" width="4rem" height="4rem">
        <div className="flex items-center border-circle border-50 p-0 m-0 w-3rem h-3rem border-0">
          <HAIcon size={"30em"} />
        </div>
      </foreignObject>
      <foreignObject x="0" y="0" width="12rem" height="9rem">
        <div className="flex items-center border-50 p-0 m-0 w-12rem h-9rem border-0">
          <p>
            <b>Hit Assessment</b>
            <br />
            {dataObj?.attributes?.name}
            <br />

            {dataObj?.attributes?.status}
            <br />
            {getOrgAliasById(dataObj?.attributes?.orgId)}
            <br />
            {dataObj?.attributes?.isHASuccess === "True" ? "Success" : ""}
          </p>
        </div>
      </foreignObject>
    </g>
  );
};

export default HNHa;
