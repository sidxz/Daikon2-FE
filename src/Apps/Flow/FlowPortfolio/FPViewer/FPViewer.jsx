import { observer } from "mobx-react-lite";
import { Menu } from "primereact/menu";
import React, { useContext, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../../Library/Loading/Loading";
import NotFound from "../../../../Library/NotFound/NotFound";
import { RootStoreContext } from "../../../../RootStore";
import { AppRoleResolver } from "../../../../Shared/VariableResolvers/AppRoleResolver";
import { PortfolioAdminRoleName } from "../constants/roles";
import FPVComments from "./FPVComments/FPVComments";
import FPVInformation from "./FPVInformation/FPVInformation";
import FPVSettings from "./FPVSettings/FPVSettings";
import * as Helper from "./FPViewerHelper";

const FPViewer = () => {
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
          <div className="flex">
            <Menu model={Helper.sidePanelItems(navigate)} />
          </div>
          <div className="flex w-full">
            <Routes>
              <Route index element={<Navigate replace to="information/" />} />
              <Route path="information/*" element={<FPVInformation />} />
              <Route
                path="discussion/*"
                element={<FPVComments selectedProject={selectedProject} />}
              />
              {isUserInAnyOfRoles([PortfolioAdminRoleName]) && (
                <Route path="settings/*" element={<FPVSettings />} />
              )}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </div>
    );
  }
};

export default observer(FPViewer);
