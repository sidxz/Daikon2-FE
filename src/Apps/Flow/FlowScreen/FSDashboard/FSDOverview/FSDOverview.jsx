import React from "react";
import { FcNeutralTrading, FcPlanner } from "react-icons/fc";
import { GiVote } from "react-icons/gi";
import { WiMoonFull } from "react-icons/wi";
import FSDOActiveScreens from "./FSDOActiveScreens/FSDOActiveScreens";
import FSDOPlannedScreens from "./FSDOPlannedScreens/FSDOPlannedScreens";
import FSDORecentlyCompleted from "./FSDORecentlyCompleted/FSDORecentlyCompleted";
import FSDOVotingReady from "./FSDOVotingReady/FSDOVotingReady";

const FSDOverview = () => {
  // root store context

  return (
    <div className="flex flex-column w-full">
      <div className="flex w-full surface-0">
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
              <FcPlanner />
            </div>
            <div className="flex">
              <b>PLANNED SCREENS</b>
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
        <div className="flex w-full">
          <div
            className="flex p-1 align-items-center justify-content-center w-full text-lg  border-1 border-0 gap-2"
            style={{
              color: "#3c83bd",
            }}
          >
            <div className="flex text-green-500">
              <WiMoonFull />
            </div>
            <div className="flex">
              <b>RECENTLY COMPLETED SCREENS</b>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full">
        <div
          className="flex max-w-1 p-4 align-items-center bg-teal-400 text-white"
          style={{
            textOrientation: "sideways-right",
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          TARGET BASED
        </div>

        <div className="flex w-full border-1 border-50 justify-content-center bg-white">
          <FSDOPlannedScreens />
        </div>
        <div className="flex w-full border-1 border-50 justify-content-center bg-white">
          <FSDOActiveScreens />
        </div>
        <div className="flex w-full border-1 border-50 justify-content-center bg-white">
          <FSDOVotingReady />
        </div>
        <div className="flex w-full border-1 border-50 justify-content-center bg-white">
          <FSDORecentlyCompleted />
        </div>
      </div>
      <div className="flex w-full pt-3">
        <div
          className="flex max-w-1 p-4 align-items-center bg-bluegray-400 text-white"
          style={{
            textOrientation: "sideways-right",
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          PHENOTYPIC
        </div>

        <div className="flex w-full border-1 border-50 justify-content-center bg-white">
          <FSDOPlannedScreens />
        </div>
        <div className="flex w-full border-1 border-50 justify-content-center bg-white">
          <FSDOActiveScreens />
        </div>
        <div className="flex w-full border-1 border-50 justify-content-center bg-white">
          <FSDOVotingReady />
        </div>
        <div className="flex w-full border-1 border-50 justify-content-center bg-white">
          <FSDORecentlyCompleted />
        </div>
      </div>
      ;
    </div>
  );
};

export default FSDOverview;
