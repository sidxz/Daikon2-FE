import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { Fieldset } from "primereact/fieldset";
import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Card } from "primereact/card";
import Loading from "../../../../../Library/Loading/Loading";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../../../RootStore";
import { DVariableResolver } from "../../../../../Shared/DVariable/DVariableResolver";
import { appColors } from "../../../../../constants/colors";
import { TargetIcon } from "../../../icons/TargetIcon";
import FTVSafetyAssessmentGrid from "./FTVSafetyAssessmentGrid";
import * as Helper from "./FTVSafetyAssessmentHelper";
import FTVSafetyAssessmentLegend from "./FTVSafetyAssessmentLegend";

const FTVSafetyAssessment = () => {
  const navigate = useNavigate();
  const rootStore = useContext(RootStoreContext);
  const params = useParams();

  const {
    fetchTarget,
    selectedTarget,
    isFetchingTarget,
    isUpdatingTarget,
    isTargetRegistryCacheValid,
  } = rootStore.targetStore;

  const {
    fetchToxicologyOfTarget,
    toxicologyRegistry,
    isFetchingToxicologyOfTarget,
    toxicologyOfSelectedTarget,
  } = rootStore.targetSafetyAssessmentStore;

  useEffect(() => {
    fetchToxicologyOfTarget(selectedTarget?.id);
  }, [selectedTarget]);

  if (isFetchingTarget) {
    return <Loading message={"Fetching Target..."} />;
  }

  if (isFetchingToxicologyOfTarget) {
    return <Loading message={"Fetching Toxicology..."} />;
  }

  let mammalianOffTarget = DVariableResolver(
    toxicologyOfSelectedTarget.find(
      (item) => DVariableResolver(item.topic) === "mammalian-off-target"
    )?.note
  );

  let mtbDrugBindingDomain = DVariableResolver(
    toxicologyOfSelectedTarget.find(
      (item) => DVariableResolver(item.topic) === "mtb-drug-binding-domain"
    )?.note
  );
  let source = DVariableResolver(
    toxicologyOfSelectedTarget.find(
      (item) => DVariableResolver(item.topic) === "source"
    )?.note
  );

  let headerRender = (
    <>
      <div className="flex w-full">
        <BreadCrumb model={Helper.breadCrumbItems(selectedTarget, navigate)} />
      </div>
      <div className="flex w-full">
        <SecHeading
          svgIcon={<TargetIcon size={"25em"} />}
          heading={"Target - " + selectedTarget.name}
          color={appColors.sectionHeadingBg.target}
          displayHorizon={true}
          entryPoint={selectedTarget?.id}
        />
      </div>
    </>
  );
  let noDataRender = (
    <div className="flex flex-column min-w-full fadein animation-duration-500 gap-0">
      <Card title="Safety Assessment">
        There are no records for this target.
      </Card>
    </div>
  );

  if (toxicologyOfSelectedTarget?.length === 0) {
    return (
      <div className="flex flex-column min-w-full fadein animation-duration-500 gap-0">
        {headerRender}
        {noDataRender}
      </div>
    );
  }

  //console.log("toxicologyOfSelectedTarget", toxicologyOfSelectedTarget);

  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500 gap-0">
      {headerRender}

      <div className="flex w-full">
        <Fieldset className="m-0 w-full" legend="General information">
          <div className="flex gap-5">
            <div className="flex">
              <div className="flex gap-5 m-3 w-full">
                <div className="field flex items-center gap-3">
                  <div className="text-lg pl-2 pr-4 flex align-items-center justify-content-center text-lg">
                    Mammalian off target : {mammalianOffTarget}
                  </div>
                </div>
                <div className="field flex items-center gap-5">
                  <div className="text-lg pl-4 pr-4 flex align-items-center justify-content-center text-lg">
                    Mtb drug binding domain : {mtbDrugBindingDomain}
                  </div>
                </div>
                <div className="field flex items-center gap-3">
                  <div className="text-lg  pl-4 pr-2 flex align-items-center justify-content-center text-lg">
                    Data Source : {source}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Fieldset>
      </div>

      <div className="flex w-full">
        <Fieldset className="m-0 w-full" legend="Risk Matrix">
          <div className="flex w-full gap-2">
            <div className="flex p-2 text-lg">
              <FTVSafetyAssessmentGrid data={toxicologyOfSelectedTarget} />
            </div>
            <div className="flex align-items-top justify-content-end text-lg">
              <FTVSafetyAssessmentLegend />
            </div>
          </div>
        </Fieldset>
      </div>
    </div>
  );
};

export default observer(FTVSafetyAssessment);
