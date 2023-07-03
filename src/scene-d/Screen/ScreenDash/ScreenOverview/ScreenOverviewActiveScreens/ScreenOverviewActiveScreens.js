import React from "react";

const ScreenOverviewActiveScreens = ({ screensActive }) => {
  let screensActiveComponent = screensActive.map((screenActive) => {
    return (
      <div
        className="flex  justify-content-center"
        style={{
          fontSize: "large",
        }}
      >
        <div
          className="flex surface-100 pl-4 pr-4 justify-content-center"
          style={{
            minWidth: "7rem",
          }}
        >
          {screenActive}
        </div>
      </div>
    );
  });

  return (
    <div className="flex bg-white w-full flex-column ml-2 mr-1 mb-3 gap-4 ">
      <div
        className="flex p-2 surface-300 justify-content-center "
        style={{
          fontSize: "medium",
        }}
      >
        ACTIVE SCREEN CAMPAIGNS
      </div>
      {screensActiveComponent}
    </div>
  );
};

export default ScreenOverviewActiveScreens;
