import React from "react";
import { useNavigate } from "react-router-dom";
import FDate from "../../../../../../Library/FDate/FDate";
import { AppOrgResolver } from "../../../../../../Shared/VariableResolvers/AppOrgResolver";
import { FormatScreeningMethod } from "../../../shared/Formatters";

const FSDORecentlyCompleted = ({ screens }) => {
  const navigate = useNavigate();
  const { getOrgAliasById } = AppOrgResolver();

  if (!screens || screens.length === 0)
    return (
      <div className="flex justify-content-center align-items-center w-full text-sm	text-color-secondary">
        - No screens are recently completed -
      </div>
    );
  let screensComponent = screens.map((screen) => {
    return (
      <div
        className="flex flex-wrap border-round-md  flex-column bg-green-50 shadow-1 hover:shadow-3 w-15rem"
        key={screen.id}
      >
        <div className="flex align-items-end justify-content-end">
          <div className="p-1 white-space-nowrap justify-content-center bg-white text-700 text-xs w-6 overflow-hidden text-overflow-ellipsis border-right-1 border-green-100">
            {screen.screenType == "phenotypic"
              ? "Phenotypic"
              : FormatScreeningMethod(screen.method)}
          </div>

          <div className="p-1 white-space-nowrap justify-content-center bg-white text-700 text-xs w-5 overflow-hidden text-overflow-ellipsis border-right-1 border-green-100">
            {getOrgAliasById(screen?.primaryOrgId)}
          </div>
          <div className="p-1 white-space-nowrap justify-content-center bg-white text-700 text-xs w-6 overflow-hidden text-overflow-ellipsis border-cyan-100">
            <FDate
              timestamp={
                screen?.isModified
                  ? screen?.latestStatusChangeDate
                  : screen?.dateCreated
              }
            />
          </div>
          <div className="tooltip-container justify-content-center bg-white"></div>
        </div>
        <div
          className="flex justify-content-center cursor-pointer w-full text-green-600 text-lg p-2"
          style={{
            color: "#5D3891",
          }}
          onClick={() => {
            if (screen.screenType === "target-based") {
              navigate(`/wf/screen/viewer/tb/${screen.id}`);
            } else {
              navigate(`/wf/screen/viewer/ph/${screen.id}`);
            }
          }}
        >
          {screen.name}
        </div>
      </div>
    );
  });

  return (
    <div className="flex flex-wrap align-content-center w-full gap-3 p-1 align-items-start justify-content-center align-self-baseline">
      {screensComponent}
    </div>
  );
};

export default FSDORecentlyCompleted;
