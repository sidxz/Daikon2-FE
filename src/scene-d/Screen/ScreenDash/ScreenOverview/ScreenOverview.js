import React from "react";
import { FcNeutralTrading, FcPlanner } from "react-icons/fc";
import { GiVote } from "react-icons/gi";
import ScreenOverviewActiveScreens from "./ScreenOverviewActiveScreens/ScreenOverviewActiveScreens";
import ScreenOverviewPlannedScreens from "./ScreenOverviewPlannedScreens/ScreenOverviewPlannedScreens";
import ScreenOverviewVotingReady from "./ScreenOverviewVotingReady/ScreenOverviewVotingReady";

const ScreenOverview = () => {
  return (
    <div className="flex flex-column w-full">
      <div className="flex w-full surface-50">
        <div
          className="flex w-1 p-4 align-items-center bg-white"
          style={{
            textOrientation: "sideways-right",
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          &nbsp;
        </div>
        <div className="flex w-full">
          <div
            className="flex p-1 align-items-center justify-content-center w-full text-lg  border-1 border-0 gap-2"
            style={{
              color: "#3c83bd",
            }}
          >
            <div className="flex">
              <FcNeutralTrading />
            </div>
            <div className="flex">
              <b>ACTIVE SCREEN CAMPAIGNS</b>
            </div>
          </div>
        </div>
        <div className="flex w-full text-sm">
          <div
            className="flex p-1 align-items-center justify-content-center w-full text-lg  border-1 border-0 gap-2"
            style={{
              color: "#3c83bd",
            }}
          >
            <div className="flex text-orange-500">
              <GiVote />
            </div>
            <div className="flex">
              <b>VOTING READY</b>
            </div>
          </div>
        </div>
        <div className="flex w-full text-sm">
          <div
            className="flex p-1 align-items-center justify-content-center w-full text-lg  border-1 border-0 gap-2"
            style={{
              color: "#3c83bd",
            }}
          >
            <div className="flex">
              <FcPlanner />
            </div>
            <div className="flex">
              <b>PLANNED SCREENS</b>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full">
        <div
          className="flex w-1 p-4 align-items-center bg-teal-400 text-white"
          style={{
            textOrientation: "sideways-right",
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          TARGET BASED
        </div>
        <div className="flex w-full border-1 border-100  bg-white">
          <ScreenOverviewActiveScreens
            screensActive={["DnaE1", "DapE", "DnaE1"]}
          />
        </div>
        <div className="flex w-full border-1 border-100  bg-white">
          <ScreenOverviewVotingReady votingReady={["Rho"]} />
        </div>
        <div className="flex w-full border-1 border-100  bg-white">
          <ScreenOverviewPlannedScreens screensPlanned={["AccD6", "Pks13"]} />
        </div>
      </div>
      <div className="flex w-full">
        <div
          className="flex w-1 p-4 align-items-center bg-bluegray-400 text-white"
          style={{
            textOrientation: "sideways-right",
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          PHENOTYPIC
        </div>
        <div className="flex w-full border-1 border-100 bg-white">
          <ScreenOverviewActiveScreens screensActive={["485", "326", "979"]} />
        </div>
        <div className="flex w-full border-1 border-100 bg-white">
          <ScreenOverviewVotingReady votingReady={["ACU", "BAY10"]} />
        </div>
        <div className="flex w-full border-1 border-100 bg-white">
          <ScreenOverviewPlannedScreens screensPlanned={["ISA", "326"]} />
        </div>
      </div>
    </div>
  );
};

export default ScreenOverview;
