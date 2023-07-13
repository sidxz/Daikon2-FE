import React from "react";

const ScreenOverviewRecentlyCompleted = ({ screensRecentlyCompleted }) => {
  // check if screensPlanned is empty or not set or null
  if (!screensRecentlyCompleted) return <React.Fragment></React.Fragment>;

  let screensRecentlyCompletedComponent = screensRecentlyCompleted.map(
    (screenRecentlyCompleted) => {
      return (
        <div
          className="flex justify-content-center"
          style={{
            fontSize: "large",
          }}
        >
          <div
            className="flex bg-green-50 p-3 text-green-700 justify-content-center shadow-1 hover:shadow-3"
            style={{
              minWidth: "7rem",
              color: "#5D3891",
            }}
          >
            {screenRecentlyCompleted}
          </div>
        </div>
      );
    }
  );

  return (
    <div className="flex flex-wrap w-full gap-3 p-1 align-items-center justify-content-center">
      {screensRecentlyCompletedComponent}
    </div>
  );
};
export default ScreenOverviewRecentlyCompleted;
