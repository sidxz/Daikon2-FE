import React, { useContext, useEffect } from "react";
import { FaFlask } from "react-icons/fa";
import { GiTestTubes } from "react-icons/gi";
import { IoMdList } from "react-icons/io";

import { observer } from "mobx-react-lite";
import Loading from "../../../../../Library/Loading/Loading";
import { RootStoreContext } from "../../../../../RootStore";
import FPDOH2L from "./FPDOH2L/FPDOH2L";
import FPDOLO from "./FPDOLO/FPDOLO";
import FPDOSP from "./FPDOSP/FPDOSP";

const FPDOverview = () => {
  const rootStore = useContext(RootStoreContext);

  const {
    fetchProjects,
    isProjectListCacheValid,
    projectList,
    isFetchingProjects,
  } = rootStore.projectStore;

  // const { filterH2LProjects, filterLOProjects, filterSPProjects } =
  //   rootStore.portfolioStore;

  useEffect(() => {
    if (!isProjectListCacheValid) {
      fetchProjects();
    }
  }, [isProjectListCacheValid, fetchProjects]);

  if (isFetchingProjects) {
    return <Loading message={"Fetching Projects..."} />;
  }

  console.log("projectList", projectList);

  let h2lActiveProjects = projectList.filter(
    (item) => item.stage === "H2L" && item.isProjectRemoved === false
  );
  let h2lProjects = projectList.filter((item) => item.stage === "H2L");

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
              <GiTestTubes />
            </div>
            <div className="flex ">
              <b>H2L</b>
              <b style={{ color: "#00A86B" }}>({h2lActiveProjects.length})</b>
            </div>
            <div className="flex text-xs justify-content-center text-bluegray-400">
              <b> Total ({h2lProjects.length})</b>
            </div>
          </div>
          <div className="flex w-full pr-3">
            <div className="flex w-full  pt-1  bg-white">
              <FPDOH2L projects={h2lActiveProjects} />
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
            <div className="flex ">
              <b> LO - ACTIVE &nbsp;</b>

              {/* <b style={{ color: "#00A86B" }}>({loProjectsCount})</b> */}
            </div>
          </div>
          <div className="flex text-xs justify-content-center text-bluegray-400">
            {/* <b> Total ({loProjects.length})</b> */}
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
            <div className="flex ">
              <b> SP - ACTIVE &nbsp;</b>

              {/* <b style={{ color: "#00A86B" }}>({spProjectsCount})</b> */}
            </div>
          </div>
          <div className="flex text-xs justify-content-center text-bluegray-400">
            {/* <b> Total ({spProjects.length})</b> */}
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
