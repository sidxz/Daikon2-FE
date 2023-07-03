import React from "react";

const ScreenOverviewPlannedScreens = ({ screensPlanned }) => {
  let screensPlannedComponent = screensPlanned.map((screenPlanned) => {
    return (
      <div
        className="flex justify-content-center bg-blue-100 p-2"
        style={{
          fontSize: "medium",
          minWidth: "4rem",
        }}
      >
        {screenPlanned}
      </div>
    );
  });

  return (
    <div className="flex bg-white w-full flex-column ml-2 mr-2">
      <div
        className="flex p-2 bg-blue-100 justify-content-center "
        style={{
          fontSize: "medium",
        }}
      >
        PLANNED SCREENS
      </div>
      <div className="flex flex-wrap gap-4 ml-1 mr-1 mt-3 mb-5 justify-content-center">
        {screensPlannedComponent}{" "}
      </div>
    </div>
  );
};
export default ScreenOverviewPlannedScreens;
