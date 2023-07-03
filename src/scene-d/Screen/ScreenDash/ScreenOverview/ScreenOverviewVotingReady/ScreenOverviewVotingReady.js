import React from "react";

const ScreenOverviewVotingReady = ({ votingReady }) => {
  // check if screensActive is empty or not set or null
  if (!votingReady) return <React.Fragment></React.Fragment>;

  let votingReadyComponent = votingReady.map((voteReady) => {
    return (
      <div className="border-circle bg-green-300 w-6rem h-6rem flex items-center justify-content-center shadow-1 hover:shadow-3">
        <div className="flex align-items-center">{voteReady}</div>
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
