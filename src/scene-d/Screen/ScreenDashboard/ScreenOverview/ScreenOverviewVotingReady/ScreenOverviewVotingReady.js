import React from "react";

const ScreenOverviewVotingReady = ({ votingReady }) => {
  // check if screensActive is empty or not set or null
  if (!votingReady) return <React.Fragment></React.Fragment>;

  let votingReadyComponent = votingReady.map((voteReady) => {
    return (
      <div
        className="flex justify-content-center"
        style={{
          fontSize: "large",
        }}
      >
        <div
          className="flex bg-red-50 p-3 text-red-400 justify-content-center shadow-1 hover:shadow-3"
          style={{
            minWidth: "7rem",
            color: "#5D3891",
          }}
        >
          {voteReady}
        </div>
      </div>
    );
  });

  return (
    <div className="flex flex-wrap w-full gap-3 p-1 align-items-center justify-content-center">
      {votingReadyComponent}{" "}
    </div>
  );
};

export default ScreenOverviewVotingReady;
