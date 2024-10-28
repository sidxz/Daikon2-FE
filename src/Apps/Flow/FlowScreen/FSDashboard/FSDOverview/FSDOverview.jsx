import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import { FcNeutralTrading, FcPlanner } from "react-icons/fc";
import { GiVote } from "react-icons/gi";
import { WiMoonFull } from "react-icons/wi";
import Loading from "../../../../../Library/Loading/Loading";
import { RootStoreContext } from "../../../../../RootStore";
import FSDOOngoingScreens from "./FSDOOngoingScreens/FSDOOngoingScreens";
import FSDOPlannedScreens from "./FSDOPlannedScreens/FSDOPlannedScreens";
import FSDORecentlyCompleted from "./FSDORecentlyCompleted/FSDORecentlyCompleted";
import FSDOVotingReady from "./FSDOVotingReady/FSDOVotingReady";
import FSDOverviewFilters from "./FSDOverviewFilters";

const FSDOverview = () => {
  // root store context
  const rootStore = useContext(RootStoreContext);
  const {
    fetchScreens,
    isScreenListCacheValid,
    isFetchingScreens,
    screenListTargetBased,
    screenListPhenotypic,
    getFilteredListTargetBased,
  } = rootStore.screenStore;
  useEffect(() => {
    if (!isScreenListCacheValid) {
      fetchScreens();
    }
  }, [isScreenListCacheValid, fetchScreens]);

  if (isFetchingScreens) {
    return <Loading message={"Fetching Screens..."} />;
  }

  //console.log("screenListTargetBased", screenListTargetBased);

  let sortByDate = (a, b) => {
    // Handle default or null dateModified by using dateCreated instead
    const dateA = a?.isModified
      ? new Date(a.latestStatusChangeDate)
      : new Date(a.dateCreated);
    const dateB = b?.isModified
      ? new Date(b.latestStatusChangeDate)
      : new Date(b.dateCreated);

    return dateB - dateA; // Sort by dateModified or dateCreated if dateModified is default or null
  };

  const currentDate = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(currentDate.getMonth() - 6);

  return (
    <div className="flex flex-column w-full">
      <div className="flex w-full">
        <FSDOverviewFilters />
      </div>
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
            className="flex p-1 align-items-center justify-content-center w-full text-lg border-1 border-0 gap-2"
            style={{
              color: "#3c83bd",
            }}
          >
            <div className="flex">
              <FcPlanner />
            </div>
            <div className="flex">
              <b>PLANNED | ASSAY DEVELOPMENT</b>
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
              <b>ONGOING</b>
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
              <b>RECENTLY COMPLETED</b>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full">
        <div
          className="flex max-w-1 p-4 align-items-center justify-content-center bg-teal-400 text-white"
          style={{
            textOrientation: "sideways-right",
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          TARGET BASED
        </div>

        <div className="flex w-full border-1 border-50 justify-content-center">
          <FSDOPlannedScreens
            screens={getFilteredListTargetBased
              .filter(
                (item) =>
                  item.status === "Planned" ||
                  item.status == "Assay Development"
              ) // Filter by Ongoing status
              .sort(sortByDate)}
          />
        </div>
        <div className="flex w-full border-1 border-50 justify-content-center">
          <FSDOOngoingScreens
            screens={getFilteredListTargetBased
              .filter((item) => item.status === "Ongoing") // Filter by Ongoing status
              .sort(sortByDate)}
          />
        </div>
        <div className="flex w-full border-1 border-50 justify-content-center">
          <FSDOVotingReady
            screens={getFilteredListTargetBased
              .filter((item) => item.status === "Voting Ready") // Filter by Ongoing status
              .sort(sortByDate)}
          />
        </div>
        <div className="flex w-full border-1 border-50 justify-content-center">
          <FSDORecentlyCompleted
            screens={getFilteredListTargetBased
              .filter((item) => item.status === "Completed")
              .filter((item) => {
                const latestStatusDate = new Date(item.latestStatusChangeDate);
                return (
                  latestStatusDate >= sixMonthsAgo &&
                  latestStatusDate <= currentDate
                );
              })
              .sort(sortByDate)}
          />
        </div>
      </div>
      <div className="flex w-full pt-4">
        <div
          className="flex max-w-1 p-4 align-items-center justify-content-center bg-blue-400 text-white"
          style={{
            textOrientation: "sideways-right",
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          PHENOTYPIC
        </div>

        <div className="flex w-full border-1 border-50 justify-content-center">
          <FSDOPlannedScreens
            screens={screenListPhenotypic
              .filter(
                (item) =>
                  item.status === "Planned" ||
                  item.status == "Assay Development"
              ) // Filter by Ongoing status
              .sort(sortByDate)}
          />
        </div>
        <div className="flex w-full border-1 border-50 justify-content-center">
          <FSDOOngoingScreens
            screens={screenListPhenotypic
              .filter((item) => item.status === "Ongoing") // Filter by Ongoing status
              .sort(sortByDate)}
          />
        </div>
        <div className="flex w-full border-1 border-50 justify-content-center">
          <FSDOVotingReady
            screens={screenListPhenotypic
              .filter((item) => item.status === "Voting Ready") // Filter by Ongoing status
              .sort(sortByDate)}
          />
        </div>
        <div className="flex w-full border-1 border-50 justify-content-center">
          <FSDORecentlyCompleted
            screens={screenListPhenotypic
              .filter((item) => item.status === "Completed")
              .filter((item) => item.status === "Completed")
              .filter((item) => {
                const latestStatusDate = new Date(item.latestStatusChangeDate);
                return (
                  latestStatusDate >= sixMonthsAgo &&
                  latestStatusDate <= currentDate
                );
              })
              .sort(sortByDate)}
          />
        </div>
      </div>
    </div>
  );
};

export default observer(FSDOverview);
