import React from "react";
import { useNavigate } from "react-router-dom";
import { PortfolioIcon } from "../../../../../Apps/Flow/icons/PortfolioIcon";
import { PostPortfolioIcon } from "../../../../../Apps/Flow/icons/PostPortfolioIcon";
import { ProjectIcon } from "../../../../../Apps/Flow/icons/ProjectIcon";
import { AppOrgResolver } from "../../../../../Shared/VariableResolvers/AppOrgResolver";

const HNPortfolio = ({ dataObj, entryPoint }) => {
  const { getOrgAliasById } = AppOrgResolver();
  const navigate = useNavigate();

  const projectType =
    dataObj?.attributes?.stage === "H2L" ||
    dataObj?.attributes?.stage === "LO" ||
    dataObj?.attributes?.stage === "SP"
      ? "portfolio"
      : "post-portfolio";
  return (
    <g
      onClick={() => {
        navigate(`/wf/${projectType}/viewer/${dataObj?.id}`);
      }}
      style={{
        filter:
          dataObj?.attributes?.isProjectRemoved === "True"
            ? "grayscale(100%)"
            : "none",
      }}
    >
      {dataObj?.id === entryPoint && (
        <foreignObject x="-50" y="-40" width="14rem" height="14rem">
          <div className="flex items-center p-0 m-0 w-14rem h-14rem border-1 border-dashed border-green-200 border-circle"></div>
        </foreignObject>
      )}
      <foreignObject x="-20" y="-20" width="4rem" height="4rem">
        <div className="flex items-center border-circle border-50 p-0 m-0 w-3rem h-3rem border-0">
          <ProjectIcon size={"30em"} />
        </div>
      </foreignObject>

      <foreignObject x="0" y="0" width="12rem" height="9rem">
        <div className="flex items-center border-50 p-0 m-0 w-12rem h-9rem border-0">
          <p>
            <b>Project</b>
            <br />
            {dataObj?.attributes?.name}
            <br />
            {getOrgAliasById(dataObj?.attributes?.orgId)}
            <br />

            <div className="flex">
              <div className="flex">
                <PortfolioIcon size={15} />
              </div>
              <div className="flex">
                Portfolio / {dataObj?.attributes?.stage}
              </div>
            </div>

            <div className="flex">
              <div className="flex">
                <PostPortfolioIcon size={15} />
              </div>
              <div className="flex">
                Post Portfolio / {dataObj?.attributes?.stage}
              </div>
            </div>
          </p>
        </div>
      </foreignObject>
    </g>
  );
};

export default HNPortfolio;
