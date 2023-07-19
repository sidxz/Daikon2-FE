import _ from "lodash";
import React from "react";
import { useNavigate } from "react-router-dom";

const ScreenOverviewActiveScreens = ({ screensActive }) => {
  const navigate = useNavigate();
  // check if screensActive is empty or not set or null
  if (!screensActive || screensActive.length === 0)
    return (
      <div className="flex justify-content-center align-items-center w-full text-sm	text-color-secondary">
        - No screens are active -
      </div>
    );

  let screensActiveComponent = screensActive.map((screenActive) => {
    return (
      <div className="flex flex-column bg-cyan-50  justify-content-center shadow-1 hover:shadow-3">
        <div className="flex align-items-end justify-content-end">
          <div
            className="flex p-1 justify-content-center bg-white text-700 text-xs border-right-1 border-cyan-100"
            style={{
              minWidth: "4rem",
            }}
          >
            {_.startCase(screenActive.method)}
          </div>

          <div
            className="flex p-1 justify-content-center bg-white text-700 text-xs"
            style={{
              minWidth: "4rem",
            }}
          >
            {screenActive.org.alias}
          </div>
        </div>

        <div
          className="flex justify-content-center cursor-pointer"
          style={{
            fontSize: "large",
          }}
          onClick={() => {
            navigate(
              `/d/screen/target-based/${screenActive.targetName}/screen-sequence/`
            );
          }}
        >
          <div
            className="flex p-2 justify-content-center"
            style={{
              minWidth: "7rem",
              color: "#0e7994",
            }}
          >
            {screenActive.screenName}
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="flex flex-wrap w-full gap-3 p-1 align-items-center justify-content-center">
      {screensActiveComponent}
    </div>
  );
};

export default ScreenOverviewActiveScreens;
