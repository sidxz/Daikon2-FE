import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import Loading from "../../../../../Library/Loading/Loading";
import { RootStoreContext } from "../../../../../RootStore";
import FHaDPCard from "./FHaDPCard";

const FHaDPaused = () => {
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
          <div className="flex w-full pr-3 ">
            <div className="flex w-full  pt-1  bg-white">
              <FHaDPCard
                hitAssessments={haList.filter(
                  (item) => item.status === "Paused"
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(FHaDPaused);
