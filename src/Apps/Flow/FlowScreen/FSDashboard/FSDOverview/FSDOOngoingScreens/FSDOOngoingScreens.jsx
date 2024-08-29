import React from "react";
import { useNavigate } from "react-router-dom";
import { AppOrgResolver } from "../../../../../../Shared/VariableResolvers/AppOrgResolver";
import { FormatScreeningMethod } from "../../../shared/Formatters";
import FDate from "../../../../../../Library/FDate/FDate";
import { FaClock } from "react-icons/fa6";
import { getClockIconData } from "../FSDOHelper";
import "./FSDOOS.css";

const FSDOOngoingScreens = ({ screens }) => {
  const navigate = useNavigate();
  const { getOrgAliasById } = AppOrgResolver();

  if (!screens || screens.length === 0)
    return (
      <div className="flex justify-content-center align-items-center w-full text-sm	text-color-secondary">
        - No ongoing campaigns -
      </div>
    );

  let screensComponent = screens.map((screen) => {
    return (
      <div
        className="flex flex-column bg-cyan-50 justify-content-center shadow-1 hover:shadow-3 w-15rem"
        key={screen.id}
      >
        <div className="flex align-items-end justify-content-end">
          <div className="p-1 white-space-nowrap justify-content-center bg-white text-700 text-xs w-7 overflow-hidden text-overflow-ellipsis border-right-1 border-cyan-100">
            {screen.screenType == "phenotypic"
              ? "Phenotypic"
              : FormatScreeningMethod(screen.method)}
          </div>

          <div className="p-1 white-space-nowrap justify-content-center bg-white text-700 text-xs w-5 overflow-hidden text-overflow-ellipsis border-right-1 border-cyan-100">
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

          <div className="tooltip-container justify-content-center bg-white">
            {(() => {
              const dateToCheck = screen?.isModified
                ? screen?.latestStatusChangeDate
                : screen?.dateCreated;
              const { color: iconColor, tooltipText } =
                getClockIconData(dateToCheck);

              return iconColor ? (
                <>
                  <FaClock style={{ color: iconColor }} />
                  <span className="tooltip-text">{tooltipText}</span>
                </>
              ) : null;
            })()}
          </div>
        </div>

        <div
          className="flex justify-content-center cursor-pointer w-full text-lg p-2"
          style={{
            color: "#0e7994",
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
    <div className="flex flex-wrap w-full gap-3 p-1 align-items-start justify-content-center align-self-baseline">
      {screensComponent}
    </div>
  );
};

export default FSDOOngoingScreens;
