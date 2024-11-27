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
import PageInfoPanel from "../../../../Library/PageInfoPanel/PageInfoPanel";
import { RootStoreContext } from "../../../../RootStore";
import { AppRoleResolver } from "../../../../Shared/VariableResolvers/AppRoleResolver";
import { TargetAdminRoleName } from "../constants/roles";
import FTImpactValues from "./FTImpactValues/FTImpactValues";
import FTVComments from "./FTVComments/FTVComments";
import FTVCompass from "./FTVCompass/FTVCompass";
import FTVDocs from "./FTVDocs/FTVDocs";
import * as Helper from "./FTViewerHelper";
import FTVPromotionQ from "./FTVPromotionQ/FTVPromotionQ";
import FTVSafetyAssessment from "./FTVSafetyAssessment/FTVSafetyAssessment";
import FTVScorecard from "./FTVScorecard/FTVScorecard";
import FTVSettings from "./FTVSettings/FTVSettings";
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

  const { selectedTQ } = rootStore.targetPQStore;

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
    // console.log("FTViewer -> selectedTarget", selectedTarget);

    let panelInfoToRender = () => {
      let url = window.location.href;
      let isTPQ =
        url.includes("scorecard") || url.includes("promotion-questionnaire");
      if (isTPQ) {
        return (
          <PageInfoPanel
            dateCreated={selectedTQ?.dateCreated}
            createdById={selectedTQ?.createdById}
            dateUpdated={selectedTQ?.pageLastUpdatedDate}
            updatedById={selectedTQ?.pageLastUpdatedUser}
            heading="Questionnaire Page Info"
          />
        );
      } else {
        return (
          <PageInfoPanel
            dateCreated={selectedTarget?.dateCreated}
            createdById={selectedTarget?.createdById}
            dateUpdated={selectedTarget?.pageLastUpdatedDate}
            updatedById={selectedTarget?.pageLastUpdatedUser}
            heading="Target Page Info"
          />
        );
      }
    };

    return (
      <div className="flex gap-2 w-full">
        <div className="flex flex-column border-1 border-50 p-1 border-round-md gap-2">
          <div className="flex">
            <Menu model={Helper.sidePanelItems(navigate)} />
          </div>
          <div className="flex">{panelInfoToRender()}</div>
        </div>
        <div className="flex w-full">
          <Routes>
            <Route index element={<Navigate replace to="compass/" />} />
            <Route path="scorecard/" element={<FTVScorecard />} />
            <Route path="compass/" element={<FTVCompass />} />
            <Route
              path="safety-assessment/"
              element={<FTVSafetyAssessment />}
            />
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
              path="docs/"
              element={<FTVDocs selectedTarget={selectedTarget} />}
            />
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
