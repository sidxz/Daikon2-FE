import React from "react";

const ScreenOverviewVotingReady = ({ votingReady }) => {
  let votingReadyComponent = votingReady.map((voteReady) => {
    return (
      <div
        className="flex justify-content-center"
        style={{
          fontSize: "medium",
        }}
      >
        {voteReady}
      </div>
    );
  });

  return (
    <div className="flex ml-2 mt-2 w-full surface-400 flex-column gap-3 mb-3">
      <div
        className="flex p-2 bg-green-100 justify-content-center "
        style={{
          fontSize: "medium",
        }}
      >
        VOTING READY
      </div>
      <div className="flex gap-5 m-5 justify-content-center">
        {votingReadyComponent}{" "}
      </div>
    </div>
  );
};

export default ScreenOverviewVotingReady;
