import { observer } from "mobx-react-lite";
import { Sidebar } from "primereact/sidebar";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../../../Library/Loading/Loading";
import SecHeading from "../../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../../RootStore";
import { AppRoleResolver } from "../../../../Shared/VariableResolvers/AppRoleResolver";
import { appColors } from "../../../../constants/colors";
import { TargetIcon } from "../../icons/TargetIcon";
import {
  TargetAdminRoleName,
  TargetPromotionModeratorRoleName,
} from "../constants/roles";
import FTDAddTarget from "./FTDAddTarget";
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

  const [displayAddSideBar, setDisplayAddSideBar] = useState(false);
  const navigate = useNavigate();

  const { isUserInAnyOfRoles } = AppRoleResolver();

  useEffect(() => {
    if (!isTargetListCacheValid) {
      fetchTargets();
    }
  }, [fetchTargets, isTargetListCacheValid]);

  if (isFetchingTargets) {
    return <Loading message={"Fetching Targets..."} />;
  }

  //console.log("FTDashboard -> targetList", targetList);

  const addSideBarHeader = (
    <div className="flex align-items-center gap-2">
      <i className="icon icon-common icon-plus-circle"></i>
      <span className="font-bold">Source Target</span>
    </div>
  );

  var headingButtons = [];
  if (
    isUserInAnyOfRoles([TargetPromotionModeratorRoleName, TargetAdminRoleName])
  ) {
    headingButtons.push({
      label: "Awaiting Approval",
      icon: "pi pi-stopwatch",
      action: () => navigate("sourcing/approval"),
    });
  }
  // headingButtons.push({
  //   label: "Import Data",
  //   icon: "pi pi-plus",
  //   action: () => navigate("sourcing/import")
  // });
  headingButtons.push({
    label: "Add Target",
    icon: "pi pi-plus",
    action: () => setDisplayAddSideBar(true),
  });

  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500">
      <div className="flex w-full">
        <SecHeading
          svgIcon={<TargetIcon size={"25em"} />}
          icon="icon icon-common icon-target"
          heading="Targets"
          color={appColors.sectionHeadingBg.target}
          displayHorizon={false}
          customButtons={headingButtons}
        />
      </div>
      <div className="flex max-w-full p-1">
        <div className="flex" style={{ width: "600px" }}>
          <FTDTargetMap />
        </div>
        <div className="flex w-7">
          <FTDDataTable />
        </div>
      </div>

      <Sidebar
        visible={displayAddSideBar}
        position="right"
        onHide={() => setDisplayAddSideBar(false)}
        className="p-sidebar-sm"
        header={addSideBarHeader}
      >
        <FTDAddTarget closeSideBar={() => setDisplayAddSideBar(false)} />
      </Sidebar>
    </div>
  );
};

export default observer(FTDashboard);
