import React from "react";
import { useNavigate } from "react-router-dom";

const ScreenOverviewPlannedScreens = ({ screensPlanned }) => {
  const navigate = useNavigate();
  // check if screensPlanned is empty or not set or null
  if (!screensPlanned || screensPlanned.length === 0)
    return (
      <div className="flex justify-content-center align-items-center w-full text-sm	text-color-secondary">
        - No screens are planned -
      </div>
    );

  let screensPlannedComponent = screensPlanned.map((screenPlanned) => {
    return (
      <div className="flex flex-column bg-purple-50 justify-content-center shadow-1 hover:shadow-3">
        <div className="flex align-items-end justify-content-end">
          <div
            className="flex p-1 justify-content-center bg-white text-700 text-xs border-1 border-purple-100"
            style={{
              minWidth: "4rem",
            }}
          >
            {screenPlanned.method}
          </div>

          <div
            className="flex p-1 ml-1 justify-content-center bg-white text-700 text-xs border-1 border-purple-100"
            style={{
              minWidth: "4rem",
            }}
          >
            {screenPlanned.org.alias}
          </div>
        </div>
        <div
          className="flex justify-content-center cursor-pointer"
          style={{
            fontSize: "large",
          }}
          onClick={() => {
            navigate(
              `/d/screen/target-based/${screenPlanned.targetName}/screen-sequence/`
            );
          }}
        >
          <div
            className="flex p-2 justify-content-center"
            style={{
              minWidth: "7rem",
              color: "#5D3891",
            }}
          >
            {screenPlanned.screenName}
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="flex flex-wrap w-full gap-3 p-1 align-items-center justify-content-center">
      {screensPlannedComponent}
    </div>
  );
};
export default ScreenOverviewPlannedScreens;
