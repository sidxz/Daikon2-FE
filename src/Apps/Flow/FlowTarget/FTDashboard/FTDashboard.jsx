import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import Loading from "../../../../Library/Loading/Loading";
import SecHeading from "../../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../../RootStore";
import { appColors } from "../../../../constants/colors";
import FTDDataTable from "./FTDDataTable/FTDDataTable";
import FTDTargetMap from "./FTDTargetMap/FTDTargetMap";
const FTDashboard = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    targetList,
    isFetchingTargets,
    fetchTargets,
    isTargetListCacheValid,
  } = rootStore.targetStore;

  useEffect(() => {
    if (!isTargetListCacheValid) {
      fetchTargets();
    }
  }, [fetchTargets, isTargetListCacheValid]);

  if (isFetchingTargets) {
    return <Loading message={"Fetching Targets..."} />;
  }

  console.log("FTDashboard -> targetList", targetList);

  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500">
      <div className="flex w-full">
        <SecHeading
          icon="icon icon-common icon-target"
          heading="Targets"
          color={appColors.sectionHeadingBg.target}
          displayHorizon={true}
        />
      </div>
      <div className="flex max-w-full p-1">
        <div className="flex w-5">
          <FTDTargetMap />
        </div>
        <div className="flex w-7">
          <FTDDataTable />
        </div>
      </div>
    </div>
  );
};

export default observer(FTDashboard);
