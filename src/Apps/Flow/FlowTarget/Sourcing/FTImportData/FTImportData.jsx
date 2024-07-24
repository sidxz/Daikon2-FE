import React, { useContext, useEffect } from "react";
import { RootStoreContext } from "../../../../../RootStore";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import Loading from "../../../../../Library/Loading/Loading";
import { Menu } from "primereact/menu";

import * as Helper from "./FTImportDataHelper";
import { observer } from "mobx-react-lite";
import FTIDCompass from "./FTIDCompass/FTIDCompass";
import FTIDSafetyAssessment from "./FTIDSafetyAssessment/FTIDSafetyAssessment";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import { appColors } from "../../../../../constants/colors";
import { TargetIcon } from "../../../icons/TargetIcon";
import { BreadCrumb } from "primereact/breadcrumb";

const FTImportData = () => {
  const navigate = useNavigate();
  const rootStore = useContext(RootStoreContext);

  const {
    fetchTarget,
    selectedTarget,
    isFetchingTarget,
    isTargetRegistryCacheValid,
  } = rootStore.targetStore;


  return (



    <div className="flex flex-column min-w-full fadein animation-duration-500 gap-0">
      
      <div className="flex w-full">
        <SecHeading
          svgIcon={<TargetIcon size={"25em"} />}
          heading={"Import Data" }
          color={appColors.sectionHeadingBg.target}
          displayHorizon={true}
          entryPoint={selectedTarget?.id}
        />
      </div>
     
      <div className="flex gap-2 w-full">
        <div className="flex">
          <Menu model={Helper.sidePanelItems(navigate)} />
        </div>
        <div className="flex w-full">
          <Routes>
            <Route path="compass" element={<FTIDCompass />} />
            <Route
              path="safety-assessment"
              element={<FTIDSafetyAssessment />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default observer(FTImportData);
