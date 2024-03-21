import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { RootStoreContext } from "../../../../../RootStore";
import * as Helper from "./FTVImpactHelper";
const FTImpactValues = () => {
  const navigate = useNavigate();
  const rootStore = useContext(RootStoreContext);

  const {
    fetchTarget,
    selectedTarget,
    isFetchingTarget,
    isTargetRegistryCacheValid,
  } = rootStore.targetStore;

  if (isFetchingTarget) {
    return <Loading message={"Fetching Target..."} />;
  }

  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500 m-2 gap-0">
      <div className="flex w-full">
        <BreadCrumb model={Helper.breadCrumbItems(selectedTarget, navigate)} />
      </div>
      <div className="flex w-full">
        {/* <SecHeading
          svgIcon={<TargetAPI size={"25em"} />}
          heading={"Target - " + selectedTarget.name}
          color={appColors.sectionHeadingBg.target}
          displayHorizon={true}
        /> */}
      </div>
    </div>
  );
};

export default observer(FTImpactValues);
