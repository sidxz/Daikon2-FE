import React from "react";

const ScreenOverviewPlannedScreens = ({ screensPlanned }) => {
  let screensPlannedComponent = screensPlanned.map((screenPlanned) => {
    return (
      <div
        className="flex justify-content-center"
        style={{
          fontSize: "medium",
        }}
      >
        {screenPlanned}
      </div>
    );
  });

  return (
    <div className="flex bg-white w-full flex-column ml-2  gap-2">
      <div
        className="flex p-2 bg-blue-100 justify-content-center "
        style={{
          fontSize: "medium",
        }}
      >
        PLANNED SCREENS
      </div>
      <div className="flex gap-5 m-5 justify-content-center">
        {screensPlannedComponent}{" "}
      </div>
    </div>
  );
};
export default ScreenOverviewPlannedScreens;
