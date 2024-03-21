import { observer } from "mobx-react-lite";
import { Menu } from "primereact/menu";
import React, { useContext, useEffect } from "react";
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import Loading from "../../../../Library/Loading/Loading";
import { RootStoreContext } from "../../../../RootStore";
import FTImpactValues from "./FTImpactValues/FTImpactValues";
import FTVCompass from "./FTVCompass/FTVCompass";
import FTVPromotionQ from "./FTVPromotionQ/FTVPromotionQ";
import FTVScorecard from "./FTVScorecard/FTVScorecard";
import * as Helper from "./FTViewerHelper";
const FTViewer = () => {
  const navigate = useNavigate();
  const rootStore = useContext(RootStoreContext);
  const params = useParams();

  const {
    fetchTarget,
    selectedTarget,
    isFetchingTarget,
    isTargetRegistryCacheValid,
  } = rootStore.targetStore;

  useEffect(() => {
    if (
      selectedTarget === undefined ||
      selectedTarget?.id !== params?.id ||
      !isTargetRegistryCacheValid
    ) {
      fetchTarget(params.id);
    }
  }, [fetchTarget, selectedTarget, isTargetRegistryCacheValid, params.id]);

  if (isFetchingTarget) {
    return <Loading message={"Fetching Target..."} />;
  }

  if (selectedTarget) {
    console.log("FTViewer -> selectedTarget", selectedTarget);
    return (
      <div className="flex w-full">
        <div className="flex">
          <Menu model={Helper.sidePanelItems(navigate)} />
        </div>
        <div className="flex w-full">
          <Routes>
            <Route index element={<Navigate replace to="compass/" />} />
            <Route
              path="scorecard/"
              element={<FTVScorecard selectedGene={selectedTarget} />}
            />
            <Route
              path="compass/"
              element={<FTVCompass selectedGene={selectedTarget} />}
            />
            <Route
              path="promotion-questionnaire/"
              element={<FTVPromotionQ selectedGene={selectedTarget} />}
            />
            <Route
              path="impact/"
              element={<FTImpactValues selectedGene={selectedTarget} />}
            />
          </Routes>
        </div>
      </div>
    );
  }

  return <div>FTViewer</div>;
};

export default observer(FTViewer);
