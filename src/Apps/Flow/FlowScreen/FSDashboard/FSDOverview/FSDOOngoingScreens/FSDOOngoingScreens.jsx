import React from "react";
import { useNavigate } from "react-router-dom";
import { FormatScreeningMethod } from "../../../shared/Formatters";

const FSDOOngoingScreens = ({ screensOngoing }) => {
  const navigate = useNavigate();

  if (!screensOngoing || screensOngoing.length === 0)
    return (
      <div className="flex justify-content-center align-items-center w-full text-sm	text-color-secondary">
        - No ongoing campaigns -
      </div>
    );

  let screensOngoingComponent = screensOngoing.map((screenOngoing) => {
    return (
      <div className="flex flex-column bg-cyan-50  justify-content-center shadow-1 hover:shadow-3 w-15rem">
        <div className="flex align-items-end justify-content-end">
          <div className="p-1 white-space-nowrap justify-content-center bg-white text-700 text-xs w-6 overflow-hidden text-overflow-ellipsis border-right-1 border-cyan-100">
            {FormatScreeningMethod(screenOngoing.method)}
          </div>

          <div className="p-1 white-space-nowrap justify-content-center bg-white text-700 text-xs w-6 overflow-hidden text-overflow-ellipsis border-right-1 border-cyan-100">
            {screenOngoing.primaryOrgName}
          </div>
        </div>

        <div
          className="flex justify-content-center cursor-pointer w-full text-lg"
          onClick={() => {
            if (screenOngoing.screenType === "target-based") {
              navigate(`/wf/screen/viewer/tb/${screenOngoing.id}`);
            } else {
              navigate(`/wf/screen/viewer/ph/${screenOngoing.id}`);
            }
          }}
        >
          <div
            className="flex p-2 justify-content-center"
            style={{
              minWidth: "7rem",
              color: "#0e7994",
            }}
          >
            {screenOngoing.name}
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="flex flex-wrap w-full gap-3 p-1 align-items-center justify-content-center">
      {screensOngoingComponent}
    </div>
  );
};

export default FSDOOngoingScreens;
