import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import { FcAlarmClock, FcDisapprove, FcOk, FcWorkflow } from "react-icons/fc";

import { RootStoreContext } from "../../../../app/stores/rootStore";
import HAOverviewActiveHA from "./HAOverviewActiveHA/HAOverviewActiveHA";
import HAOverviewHAEnabledScreens from "./HAOverviewHAEnabledScreens/HAOverviewHAEnabledScreens";
import HAOverviewInActiveHA from "./HAOverviewInActiveHA/HAOverviewInActiveHA";
import HAOverviewPortfolioReady from "./HAOverviewPortfolioReady/HAOverviewPortfolioReady";

const HAOverview = () => {
  var rootStore = useContext(RootStoreContext);
  var { haDash, isLoadingHaDash, loadHaDash } = rootStore.dataViewStore;

  // load screen dash
  useEffect(() => {
    if (!isLoadingHaDash && haDash === null) {
      loadHaDash();
    }
  }, [haDash, isLoadingHaDash, loadHaDash]);

  console.log("loadHaDash", haDash);

  if (isLoadingHaDash || haDash === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-column w-full">
      <div className="flex w-full ">
        <div className="flex w-full flex-column text-sm ">
          <div
            className="flex p-1 align-items-center justify-content-center w-full text-lg gap-2"
            style={{
              color: "#3c83bd",
            }}
          >
            <div className="flex">
              <FcAlarmClock />
            </div>
            <div className="flex ">
              <b>READY FOR HA</b>
            </div>
          </div>
          <div className="flex w-full">
            <div className="flex w-full  pt-1  bg-white">
              <HAOverviewHAEnabledScreens projects={haDash.waiting} />
            </div>
          </div>
        </div>

        <div className="flex w-full flex-column text-sm">
          <div
            className="flex p-1 align-items-center justify-content-center w-full text-lg gap-2"
            style={{
              color: "#3c83bd",
            }}
          >
            <div className="flex">
              <FcWorkflow />
            </div>
            <div className="flex">
              <b>ACTIVE HA</b>
            </div>
          </div>
          <div className="flex w-full">
            <div className="flex w-full  pt-1 bg-white">
              <HAOverviewActiveHA projects={haDash.ongoing} />
            </div>
          </div>
        </div>

        <div className="flex w-full flex-column text-sm">
          <div
            className="flex p-1 align-items-center justify-content-center w-full text-lg gap-2"
            style={{
              color: "#3c83bd",
            }}
          >
            <div className="flex text-orange-500">
              <FcDisapprove />
            </div>
            <div className="flex">
              <b>INACTIVE HA</b>
            </div>
          </div>
          <div className="flex w-full">
            <div className="flex w-full  pt-1  bg-white">
              <HAOverviewInActiveHA projects={haDash.recentlyCompletedFailed} />
            </div>
          </div>
        </div>

        <div className="flex w-full flex-column text-sm">
          <div
            className="flex p-1 align-items-center justify-content-center w-full text-lg gap-2"
            style={{
              color: "#3c83bd",
            }}
          >
            <div className="flex text-green-500">
              <FcOk />
            </div>
            <div className="flex">
              <b>PORTFOLIO READY</b>
            </div>
          </div>
          <div className="flex w-full">
            <div className="flex w-full  pt-1 bg-white">
              <HAOverviewPortfolioReady projects={haDash.portfolioReady} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(HAOverview);
