import React from "react";
import { useNavigate } from "react-router-dom";
import { FormatScreeningMethod } from "../../../shared/Formatters";

const FSDOOngoingScreens = ({ screens }) => {
  const navigate = useNavigate();

  if (!screens || screens.length === 0)
    return (
      <div className="flex justify-content-center align-items-center w-full text-sm	text-color-secondary">
        - No ongoing campaigns -
      </div>
    );

  let screensComponent = screens.map((screen) => {
    return (
      <div className="flex flex-column bg-cyan-50 justify-content-center shadow-1 hover:shadow-3 w-15rem">
        <div className="flex align-items-end justify-content-end">
          <div className="p-1 white-space-nowrap justify-content-center bg-white text-700 text-xs w-6 overflow-hidden text-overflow-ellipsis border-right-1 border-cyan-100">
            {screen.screenType == "phenotypic"
              ? "Phenotypic"
              : FormatScreeningMethod(screen.method)}
          </div>

          <div className="p-1 white-space-nowrap justify-content-center bg-white text-700 text-xs w-6 overflow-hidden text-overflow-ellipsis border-cyan-100">
            {screen.primaryOrgName}
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
