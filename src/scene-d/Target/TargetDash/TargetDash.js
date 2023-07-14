import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import SectionHeading from "../../../app/common/SectionHeading/SectionHeading";
import Loading from "../../../app/layout/Loading/Loading";
import { RootStoreContext } from "../../../app/stores/rootStore";
import { appColors } from "../../../colors";
import TargetDashChart from "./TargetDashChart/TargetDashChart";
import TargetDashTable from "./TargetDashTable/TargetDashTable";
const TargetDash = () => {
  // Get the root store using the RootStoreContext
  const rootStore = useContext(RootStoreContext);
  const { fetchTargetList, displayLoading, targets } = rootStore.targetStore;

  // Fetch the target list when the component mounts

  useEffect(() => {
    // Only fetch the target list if it's not already loaded
    if (targets.length === 0) fetchTargetList();
  }, [fetchTargetList, targets]); // eslint-disable-line react-hooks/exhaustive-deps

  // Render a loading indicator if data is being loaded
  if (displayLoading) {
    return <Loading />;
  }

  // Render the TargetDash component

  return (
    <div className="flex flex-column w-full fadein animation-duration-500">
      <div className="flex w-full">
        <SectionHeading
          icon="icon icon-common icon-target"
          heading="Targets"
          color={appColors.sectionHeadingBg.target}
        />
      </div>
      <div className="flex w-full column-gap-2">
        <div className="flex">
          <TargetDashChart targets={targets} />
        </div>
        <div className="flex">
          <TargetDashTable targets={targets} />
        </div>
      </div>
    </div>
  );
};
// Wrap the TargetDash component with the MobX observer to automatically re-render on store updates
export default observer(TargetDash);
