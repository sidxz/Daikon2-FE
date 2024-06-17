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
    activeINDProjects,
    activeP1Projects,
    allINDProjects,
    allP1Projects,
  } = rootStore.projectStore;

  useEffect(() => {
    if (!isProjectListCacheValid) {
      fetchProjects();
    }
  }, [isProjectListCacheValid, fetchProjects]);

  if (isFetchingProjects) {
    return <Loading message={"Fetching Projects..."} />;
  }

  //console.log("projectList", projectList);

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
                  {activeINDProjects.length} / {allINDProjects.length}
                </b>
              </div>
            </div>
          </div>

          <div className="flex w-full  pr-3">
            <div className="flex w-full pt-1 bg-white">
              <FPPDOIND />
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
                  {activeP1Projects.length} / {allP1Projects.length}
                </b>
              </div>
            </div>
          </div>

          <div className="flex w-full pr-3">
            <div className="flex w-full pt-1  bg-white">
              <FPPDOP1 />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(FPPDOverview);
