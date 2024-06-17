import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import { FaFlask } from "react-icons/fa";
import { FcClock } from "react-icons/fc";
import { GiTestTubes } from "react-icons/gi";
import { IoMdList } from "react-icons/io";
import Loading from "../../../../../Library/Loading/Loading";
import { RootStoreContext } from "../../../../../RootStore";
import FPDOH2L from "./FPDOH2L/FPDOH2L";
import FPDOLO from "./FPDOLO/FPDOLO";
import FPDOReady from "./FPDOReady/FPDOReady";
import FPDOSP from "./FPDOSP/FPDOSP";

const FPDOverview = () => {
  const rootStore = useContext(RootStoreContext);

  const {
    fetchProjects,
    isProjectListCacheValid,
    projectList,
    isFetchingProjects,
    activeH2LProjects,
    activeLOProjects,
    activeSPProjects,
    allH2LProjects,
    allLOProjects,
    allSPProjects,
    readyForPortfolio,
  } = rootStore.projectStore;

  const { fetchHAs, isHaListCacheValid, isFetchingHAs, haPortfolioReadyList } =
    rootStore.haStore;

  useEffect(() => {
    if (!isHaListCacheValid) {
      fetchHAs();
    }

    if (!isProjectListCacheValid) {
      fetchProjects();
    }
  }, [isHaListCacheValid, isProjectListCacheValid]);

  if (isFetchingProjects) {
    return <Loading message={"Fetching Projects..."} />;
  }

  //console.log("projectList", projectList);

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
              <FcClock />
            </div>
            <div className="flex gap-2">
              <div className="flex">
                <b style={{ color: "#3c83bd" }}>READY FOR PORTFOLIO -</b>
              </div>
              <div className="flex">
                <b style={{ color: "#00A86B" }}>{readyForPortfolio.length}</b>
              </div>
            </div>
          </div>
          <div className="flex w-full pr-3">
            <div className="flex w-full  pt-1  bg-white">
              <FPDOReady />
            </div>
          </div>
        </div>

        <div className="flex w-full flex-column text-sm ">
          <div
            className="flex p-1 align-items-center justify-content-center w-full text-lg gap-2"
            style={{
              color: "#3c83bd",
            }}
          >
            <div className="flex">
              <GiTestTubes />
            </div>
            <div className="flex gap-2">
              <div className="flex">
                <b style={{ color: "#3c83bd" }}>H2L -</b>
              </div>
              <div className="flex">
                <b style={{ color: "#00A86B" }}>
                  {activeH2LProjects.length} / {allH2LProjects.length}
                </b>
              </div>
            </div>
          </div>
          <div className="flex w-full pr-3">
            <div className="flex w-full  pt-1  bg-white">
              <FPDOH2L />
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
              <FaFlask />
            </div>

            <div className="flex gap-2">
              <div className="flex">
                <b style={{ color: "#3c83bd" }}>LO -</b>
              </div>
              <div className="flex">
                <b style={{ color: "#00A86B" }}>
                  {activeLOProjects.length} / {allLOProjects.length}
                </b>
              </div>
            </div>
          </div>

          <div className="flex w-full pr-3">
            <div className="flex w-full  pt-1 bg-white">
              <FPDOLO />
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
              <IoMdList />
            </div>

            <div className="flex gap-2">
              <div className="flex">
                <b style={{ color: "#3c83bd" }}>SP -</b>
              </div>
              <div className="flex">
                <b style={{ color: "#00A86B" }}>
                  {activeSPProjects.length} / {allSPProjects.length}
                </b>
              </div>
            </div>
          </div>

          <div className="flex w-full pr-3">
            <div className="flex w-full  pt-1  bg-white">
              <FPDOSP />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(FPDOverview);
