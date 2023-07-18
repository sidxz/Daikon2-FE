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
          className="flex bg-red-50 p-3 text-red-400 justify-content-center shadow-1 hover:shadow-3"
          style={{
            minWidth: "7rem",
            color: "#5D3891",
          }}
        >
          {voteReady.screenName}
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
