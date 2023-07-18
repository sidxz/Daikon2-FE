import React from "react";
import { useNavigate } from "react-router-dom";
const ScreenOverviewRecentlyCompleted = ({ screensRecentlyCompleted }) => {
  const navigate = useNavigate();
  // check if screensPlanned is empty or not set or null
  if (!screensRecentlyCompleted || screensRecentlyCompleted.length === 0)
    return (
      <div className="flex justify-content-center align-items-center w-full text-sm	text-color-secondary">
        - No screens are active -
      </div>
    );

  let screensRecentlyCompletedComponent = screensRecentlyCompleted.map(
    (screenRecentlyCompleted) => {
      return (
        <div
          className="flex justify-content-center cursor-pointer"
          style={{
            fontSize: "large",
          }}
          onClick={() => {
            navigate(
              `/d/screen/target-based/${screenRecentlyCompleted.targetName}/screen-sequence/`
            );
          }}
        >
          <div
            className="flex bg-green-50 p-3 text-green-700 justify-content-center shadow-1 hover:shadow-3"
            style={{
              minWidth: "7rem",
              color: "#5D3891",
            }}
          >
            {screenRecentlyCompleted.screenName}
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
