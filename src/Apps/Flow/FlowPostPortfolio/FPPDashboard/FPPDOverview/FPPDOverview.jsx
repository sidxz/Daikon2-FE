import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import { FcCollect, FcFilledFilter, FcOvertime } from "react-icons/fc";
import Loading from "../../../../../Library/Loading/Loading";
import { RootStoreContext } from "../../../../../RootStore";

const FPPDOverview = () => {
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

  let loActiveProjects = projectList.filter(
    (item) => item.stage === "LO" && item.isProjectRemoved === false
  );
  let loProjects = projectList.filter((item) => item.stage === "LO");

  let spActiveProjects = projectList.filter(
    (item) => item.stage === "SP" && item.isProjectRemoved === false
  );
  let spProjects = projectList.filter((item) => item.stage === "SP");

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
              <FcOvertime />
            </div>
            <div className="flex gap-2">
              <div className="flex">
                <b style={{ color: "#3c83bd" }}>READY FOR POST PORTFOLIO -</b>
              </div>
              <div className="flex">
                <b style={{ color: "#00A86B" }}>
                  {h2lActiveProjects.length} / {h2lProjects.length}
                </b>
              </div>
            </div>
          </div>
          <div className="flex w-full pr-3">
            <div className="flex w-full  pt-1  bg-white">
              {/* <FPDOReady projects={h2lActiveProjects} /> */}
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
              <FcFilledFilter />
            </div>

            <div className="flex gap-2">
              <div className="flex">
                <b style={{ color: "#3c83bd" }}>IND -</b>
              </div>
              <div className="flex">
                <b style={{ color: "#00A86B" }}>
                  {loActiveProjects.length} / {loProjects.length}
                </b>
              </div>
            </div>
          </div>

          <div className="flex w-full pr-3">
            <div className="flex w-full  pt-1 bg-white">
              {/* <FPDOLO projects={loActiveProjects} /> */}
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
              <FcCollect />
            </div>

            <div className="flex gap-2">
              <div className="flex">
                <b style={{ color: "#3c83bd" }}>P1 -</b>
              </div>
              <div className="flex">
                <b style={{ color: "#00A86B" }}>
                  {spActiveProjects.length} / {spProjects.length}
                </b>
              </div>
            </div>
          </div>

          <div className="flex w-full pr-3">
            <div className="flex w-full  pt-1  bg-white">
              {/* <FPDOSP projects={spActiveProjects} /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(FPPDOverview);
