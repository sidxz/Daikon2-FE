import React from "react";
import ScreenOverviewActiveScreens from "./ScreenOverviewActiveScreens/ScreenOverviewActiveScreens";
import ScreenOverviewPlannedScreens from "./ScreenOverviewPlannedScreens/ScreenOverviewPlannedScreens";
import ScreenOverviewVotingReady from "./ScreenOverviewVotingReady/ScreenOverviewVotingReady";

const ScreenOverview = () => {
  return (
    <div className="card">
      <div className="flex card-container ">
        <div className="flex flex-column w-full surface-ground gap-3  border-round ">
          <div
            className="flex p-2 bg-yellow-100 justify-content-center "
            style={{
              fontSize: "medium",
              fontFamily: "sans-serif",
            }}
          >
            TARGET-BASED
          </div>
          <div className="flex ">
            <div className="flex w-full">
              <ScreenOverviewActiveScreens
                screensActive={["DnaE1", "DapE", "Rho"]}
              />
            </div>
            <div className="flex w-full flex-column">
              <div className="flex w-full ">
                <ScreenOverviewPlannedScreens
                  screensPlanned={["AccD6", "Pks13", "LysA"]}
                />
              </div>
              <div className="flex w-full flex-column">
                <div className="flex w-full ">
                  <ScreenOverviewVotingReady votingReady={["DnaE1", "PknB"]} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full surface-ground text-black font-bold text-center  border-round mx-4 ">
          Phenotypic
        </div>
      </div>
      <div className="flex flex-column card-container mt-4 pr-4">
        <div className="flex align-items-center justify-content-center h-4rem surface-ground font-bold text-black border-round">
          All Screens
        </div>
      </div>
    </div>
  );
};

export default ScreenOverview;
