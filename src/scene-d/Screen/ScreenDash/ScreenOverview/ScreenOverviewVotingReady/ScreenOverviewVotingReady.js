import React from "react";

const ScreenOverviewVotingReady = ({ votingReady }) => {
  let votingReadyComponent = votingReady.map((voteReady) => {
    return (
      <div className="border-circle w-5rem h-5rem ml-1 mr-1 bg-white flex items-center justify-content-center ">
        <div className="flex align-items-center" style={{ fontSize: "small" }}>
          {voteReady}
        </div>
      </div>
    );
  });

  return (
    <div className="flex ml-2 mt-2 w-full surface-400 flex-column gap-2 mb-3">
      <div
        className="flex p-2 bg-green-100 justify-content-center "
        style={{
          fontSize: "medium",
        }}
      >
        VOTING READY
      </div>
      <div className="flex flex-wrap gap-2 mb-2 justify-content-center">
        {votingReadyComponent}{" "}
      </div>
    </div>
  );
};

export default ScreenOverviewVotingReady;
