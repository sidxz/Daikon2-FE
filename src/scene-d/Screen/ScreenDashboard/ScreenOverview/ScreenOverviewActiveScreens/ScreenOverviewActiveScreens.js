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
          className="flex bg-cyan-50 p-3 justify-content-center shadow-1 hover:shadow-3"
          style={{
            minWidth: "7rem",
            color: "#0e7994",
          }}
        >
          {screenActive.screenName}
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
