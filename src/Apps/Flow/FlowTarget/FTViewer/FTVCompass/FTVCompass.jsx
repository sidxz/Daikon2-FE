import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { Fieldset } from "primereact/fieldset";
import React, { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../../../RootStore";
import { appColors } from "../../../../../constants/colors";
import * as Helper from "./FTVCompassHelper";
import FTVCompassQuad from "./FTVCompassQuad";

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
    <div className="flex flex-column min-w-full fadein animation-duration-500 m-2">
      <div className="flex w-full">
        <BreadCrumb model={Helper.breadCrumbItems(selectedTarget, navigate)} />
      </div>
      <div className="flex w-full">
        <SecHeading
          icon="icon icon-common icon-target"
          heading={"Target - " + selectedTarget.name}
          color={appColors.sectionHeadingBg.target}
          displayHorizon={true}
        />
      </div>

      <div className="flex w-full">
        <Fieldset className="m-0 w-full" legend="General information">
          <div className="flex gap-5">
            <div className="flex border-1 border-50 p-2">
              Bucket: {selectedTarget.bucket}
            </div>
            <div className="flex border-1 border-50 p-2">
              Associated Genes: {selectedTarget.associatedGenesFlattened}
            </div>
            <div className="flex border-1 border-50 p-2">
              Target Type: {selectedTarget.targetType}
            </div>
          </div>
        </Fieldset>
      </div>

      <div className="flex w-full">
        <FTVCompassQuad />
      </div>
    </div>
  );
};

export default observer(FTVCompass);
