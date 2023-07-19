import _ from "lodash";
import React from "react";
import { useNavigate } from "react-router-dom";

const ScreenOverviewVotingReady = ({ votingReady }) => {
  const navigate = useNavigate();
  // check if screensActive is empty or not set or null
  if (!votingReady || votingReady.length === 0)
    return (
      <div className="flex justify-content-center align-items-center w-full text-sm	text-color-secondary">
        - No screens are active -
      </div>
    );

  let votingReadyComponent = votingReady.map((voteReady) => {
    return (
      <div className="flex flex-column bg-orange-50 justify-content-center shadow-1 hover:shadow-3">
        <div className="flex align-items-end justify-content-end">
          <div
            className="flex p-1 justify-content-center bg-white text-700 text-xs border-right-1 border-orange-100"
            style={{
              minWidth: "4rem",
            }}
          >
            {_.startCase(voteReady.method)}
          </div>

          <div
            className="flex p-1 justify-content-center bg-white text-700 text-xs"
            style={{
              minWidth: "4rem",
            }}
          >
            {voteReady.org.alias}
          </div>
        </div>
        <div
          className="flex justify-content-center cursor-pointer"
          style={{
            fontSize: "large",
          }}
          onClick={() => {
            navigate(
              `/d/screen/target-based/${voteReady.targetName}/screen-sequence/`
            );
          }}
        >
          <div
            className="flex p-2 justify-content-center text-orange-600"
            style={{
              minWidth: "7rem",
            }}
          >
            {voteReady.screenName}
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="flex flex-wrap w-full gap-3 p-1 align-items-center justify-content-center">
      {votingReadyComponent}
    </div>
  );
};

export default ScreenOverviewVotingReady;
