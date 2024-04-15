import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import { FcCollect, FcFilledFilter } from "react-icons/fc";
import Loading from "../../../../../Library/Loading/Loading";
import { RootStoreContext } from "../../../../../RootStore";
import FPPDOIND from "./FPPDOIND/FPPDOIND";
import FPPDOP1 from "./FPPDOP1/FPPDOP1";

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

  let indActiveProjects = projectList.filter(
    (item) => item.stage === "IND" && item.isProjectRemoved === false
  );
  let indProjects = projectList.filter((item) => item.stage === "IND");

  let p1ActiveProjects = projectList.filter(
    (item) => item.stage === "P1" && item.isProjectRemoved === false
  );
  let p1Projects = projectList.filter((item) => item.stage === "P1");

  return (
    <div className="flex flex-column w-full">
      <div className="flex w-full ">
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
                  {indActiveProjects.length} / {indProjects.length}
                </b>
              </div>
            </div>
          </div>

          <div className="flex pr-3">
            <div className="flex pt-1 bg-white">
              <FPPDOIND projects={indActiveProjects} />
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
                  {p1ActiveProjects.length} / {p1Projects.length}
                </b>
              </div>
            </div>
          </div>

          <div className="flex  pr-3">
            <div className="flex  pt-1  bg-white">
              <FPPDOP1 projects={p1ActiveProjects} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(FPPDOverview);
