import { observer } from "mobx-react-lite";
import { Menu } from "primereact/menu";
import React, { useContext, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../../Library/Loading/Loading";
import NotFound from "../../../../Library/NotFound/NotFound";
import PageInfoPanel from "../../../../Library/PageInfoPanel/PageInfoPanel";
import { RootStoreContext } from "../../../../RootStore";
import { AppRoleResolver } from "../../../../Shared/VariableResolvers/AppRoleResolver";
import { PostPortfolioAdminRoleName } from "../constants/roles";
import FPPVComments from "./FPPVComments/FPPVComments";
import FPPVInformation from "./FPPVInformation/FPPVInformation";
import FPPVSettings from "./FPPVSettings/FPPVSettings";
import * as Helper from "./FPPViewerHelper";

const FPPViewer = () => {
  const params = useParams();
  const navigate = useNavigate();
  const rootStore = useContext(RootStoreContext);
  const {
    fetchProject,
    selectedProject,
    isFetchingProject,
    isProjectRegistryCacheValid,
  } = rootStore.projectStore;

  const { isUserInAnyOfRoles } = AppRoleResolver();

  useEffect(() => {
    if (
      selectedProject === undefined ||
      selectedProject?.id !== params?.id ||
      !isProjectRegistryCacheValid
    ) {
      //console.log("Fetching Project");
      fetchProject(params.id);
    }
  }, [params.id, fetchProject, selectedProject, isProjectRegistryCacheValid]);

  if (isFetchingProject) {
    return <Loading message={"Fetching Project..."} />;
  }

  //console.log("FProjectViewer -> selectedProject", selectedProject);

  if (selectedProject) {
    return (
      <div className="flex w-full">
        <div className="flex gap-2 w-full">
          <div className="flex flex-column border-1 border-50 p-1 border-round-md gap-2">
            <div className="flex">
              <Menu model={Helper.sidePanelItems(navigate)} />
            </div>
            <div className="flex">
              <PageInfoPanel
                dateCreated={selectedProject?.dateCreated}
                createdById={selectedProject?.createdById}
                dateUpdated={selectedProject?.pageLastUpdatedDate}
                updatedById={selectedProject?.pageLastUpdatedUser}
              />
            </div>
          </div>
          <div className="flex w-full">
            <Routes>
              <Route index element={<Navigate replace to="information/" />} />
              <Route path="information/*" element={<FPPVInformation />} />
              <Route
                path="discussion/*"
                element={<FPPVComments selectedProject={selectedProject} />}
              />
              {isUserInAnyOfRoles([PostPortfolioAdminRoleName]) && (
                <Route path="settings/*" element={<FPPVSettings />} />
              )}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </div>
    );
  }
};

export default observer(FPPViewer);
