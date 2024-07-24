import React, { useContext, useEffect } from "react";
import { RootStoreContext } from "../../../../../RootStore";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import Loading from "../../../../../Library/Loading/Loading";
import { Menu } from "primereact/menu";

import * as Helper from "./FTImportDataHelper";
import { observer } from "mobx-react-lite";
import FTIDCompass from "./FTIDCompass/FTIDCompass";
import FTIDSafetyAssessment from "./FTIDSafetyAssessment/FTIDSafetyAssessment";

const FTImportData = () => {
  const navigate = useNavigate();
  
  
    return (
      <div className="flex gap-2 w-full">
        <div className="flex">
          <Menu model={Helper.sidePanelItems(navigate)} />
        </div>
        <div className="flex w-full">
          <Routes>
            <Route path="compass/" element={<FTIDCompass />} />
            <Route
              path="safety-assessment/"
              element={<FTIDSafetyAssessment />}
            />
          </Routes>
        </div>
      </div>
    );
  }


export default observer(FTImportData);
