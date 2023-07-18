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
        <div className="flex flex-column bg-green-50 text-green-700 justify-content-center shadow-1 hover:shadow-3">
          <div className="flex align-items-end justify-content-end">
            <div
              className="flex p-1 justify-content-center bg-green-100 text-green-700 text-xs"
              style={{
                minWidth: "4rem",
              }}
            >
              {screenRecentlyCompleted.method}
            </div>

            <div
              className="flex p-1 ml-1 justify-content-center bg-yellow-400 text-yellow-800 text-xs"
              style={{
                minWidth: "4rem",
              }}
            >
              {screenRecentlyCompleted.org.alias}
            </div>
          </div>

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
              className="flex p-2 justify-content-center text-green-700 "
              style={{
                minWidth: "7rem",
              }}
            >
              {screenRecentlyCompleted.screenName}
            </div>
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
