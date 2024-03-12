import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../../../RootStore";
import { appColors } from "../../../../../constants/colors";

const FTVCompass = () => {
  const navigate = useNavigate();
  const rootStore = useContext(RootStoreContext);
  const params = useParams();

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
    <div className="flex flex-column min-w-full fadein animation-duration-500">
      <div className="flex w-full">
        <SecHeading
          icon="icon icon-common icon-target"
          heading="Targets"
          color={appColors.sectionHeadingBg.target}
          displayHorizon={true}
        />
      </div>
    </div>
  );
};

export default observer(FTVCompass);
