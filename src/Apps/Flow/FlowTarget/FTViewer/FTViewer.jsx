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
import NotFound from "../../../../Library/NotFound/NotFound";
import { RootStoreContext } from "../../../../RootStore";
import { AppRoleResolver } from "../../../../Shared/VariableResolvers/AppRoleResolver";
import { TargetAdminRoleName } from "../constants/roles";
import FTImpactValues from "./FTImpactValues/FTImpactValues";
import FTVComments from "./FTVComments/FTVComments";
import FTVCompass from "./FTVCompass/FTVCompass";
import FTVPromotionQ from "./FTVPromotionQ/FTVPromotionQ";
import FTVScorecard from "./FTVScorecard/FTVScorecard";
import FTVSettings from "./FTVSettings/FTVSettings";
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

  const { isUserInAnyOfRoles } = AppRoleResolver();

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
      <div className="flex gap-2 w-full">
        <div className="flex">
          <Menu model={Helper.sidePanelItems(navigate)} />
        </div>
        <div className="flex w-full">
          <Routes>
            <Route index element={<Navigate replace to="compass/" />} />
            <Route path="scorecard/" element={<FTVScorecard />} />
            <Route path="compass/" element={<FTVCompass />} />
            <Route
              path="promotion-questionnaire/"
              element={<FTVPromotionQ />}
            />
            {isUserInAnyOfRoles([TargetAdminRoleName]) && (
              <Route path="impact/" element={<FTImpactValues />} />
            )}
            {isUserInAnyOfRoles([TargetAdminRoleName]) && (
              <Route path="settings/" element={<FTVSettings />} />
            )}
            <Route
              path="discussion/"
              element={<FTVComments selectedTarget={selectedTarget} />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    );
  }

  return <div>FTViewer</div>;
};

export default observer(FTViewer);
