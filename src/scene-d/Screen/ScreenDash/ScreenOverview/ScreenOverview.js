import React from "react";
import ScreenOverviewActiveScreens from "./ScreenOverviewActiveScreens/ScreenOverviewActiveScreens";
import ScreenOverviewPlannedScreens from "./ScreenOverviewPlannedScreens/ScreenOverviewPlannedScreens";

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
                screensActive={["DnaE1", "DapE", "RNAP"]}
              />
            </div>
            <div className="flex w-full flex-column">
              <div className="flex w-full ">
                <ScreenOverviewPlannedScreens
                  screensPlanned={["AccD6", "Pks13", "Rho"]}
                />
              </div>
              <div className="flex w-full surface-400 flex-column gap-3 mb-3">
                <div
                  className="flex p-2 bg-green-100 justify-content-center "
                  style={{
                    fontSize: "medium",
                    fontFamily: "sans-serif",
                  }}
                >
                  VOTING READY
                </div>
                <div
                  className="flex justify-content-center"
                  style={{
                    fontSize: "medium",
                    fontFamily: "sans-serif",
                  }}
                >
                  <p>DnaE1, RNAP, LysA</p>
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
