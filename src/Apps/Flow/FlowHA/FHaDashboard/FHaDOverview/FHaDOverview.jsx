import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import { FcAlarmClock, FcDisapprove, FcOk, FcWorkflow } from "react-icons/fc";
import Loading from "../../../../../Library/Loading/Loading";
import { RootStoreContext } from "../../../../../RootStore";
import FHaDOActiveHA from "./FHaDOActiveHA/FHaDOActiveHA";
import FHaDOInActiveHA from "./FHaDOInActiveHA/FHaDOInActiveHA";
import FHaDOPortfolioReadyHA from "./FHaDOPortfolioReadyHA/FHaDOPortfolioReadyHA";
import FHaDOReadyForHA from "./FHaDOReadyForHA/FHaDOReadyForHA";

const FHaDOverview = () => {
  // root store context
  const rootStore = useContext(RootStoreContext);
  const { fetchHAs, isHaListCacheValid, isFetchingHAs, haList } =
    rootStore.haStore;

  useEffect(() => {
    if (!isHaListCacheValid) {
      fetchHAs();
    }
  }, [isHaListCacheValid, fetchHAs]);

  if (isFetchingHAs) {
    return <Loading message={"Fetching HAs..."} />;
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
          <div className="flex w-full pr-3">
            <div className="flex w-full  pt-1  bg-white">
              <FHaDOReadyForHA
                hitAssessments={haList.filter(
                  (item) => item.status === "ReadyForHA"
                )}
              />
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
          <div className="flex w-full pr-3">
            <div className="flex w-full  pt-1 bg-white">
              <FHaDOActiveHA
                hitAssessments={haList.filter(
                  (item) => item.status === "Active"
                )}
              />
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
          <div className="flex w-full pr-3">
            <div className="flex w-full  pt-1  bg-white">
              <FHaDOInActiveHA
                hitAssessments={haList.filter(
                  (item) =>
                    item.status === "IncorrectMz" ||
                    item.status === "KnownLiability" ||
                    item.status === "CompleteFailed"
                )}
              />
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
              <b>COMPLETE - SUCCESS</b>
            </div>
          </div>
          <div className="flex w-full pr-3 ">
            <div className="flex w-full  pt-1 bg-white">
              <FHaDOPortfolioReadyHA
                hitAssessments={haList.filter(
                  (item) => item.status === "CompleteSuccess"
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(FHaDOverview);
