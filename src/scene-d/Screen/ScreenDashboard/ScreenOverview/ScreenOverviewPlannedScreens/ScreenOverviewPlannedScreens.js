import React from "react";

const ScreenOverviewPlannedScreens = ({ screensPlanned }) => {
  // check if screensPlanned is empty or not set or null
  if (!screensPlanned) return <React.Fragment></React.Fragment>;

  let screensPlannedComponent = screensPlanned.map((screenPlanned) => {
    return (
      <div
        className="flex justify-content-center"
        style={{
          fontSize: "large",
        }}
      >
        <div
          className="flex bg-purple-50 p-3 justify-content-center shadow-1 hover:shadow-3"
          style={{
            minWidth: "7rem",
            color: "#5D3891",
          }}
        >
          {screenPlanned}
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
