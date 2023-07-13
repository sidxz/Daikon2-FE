import React from "react";

const ScreenOverviewActiveScreens = ({ screensActive }) => {
  // check if screensActive is empty or not set or null
  if (!screensActive) return <React.Fragment></React.Fragment>;

  let screensActiveComponent = screensActive.map((screenActive) => {
    return (
      <div
        className="flex justify-content-center"
        style={{
          fontSize: "large",
        }}
      >
        <div
          className="flex bg-cyan-50 p-3 justify-content-center shadow-1 hover:shadow-3"
          style={{
            minWidth: "7rem",
            color: "#0e7994",
          }}
        >
          {screenActive}
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
