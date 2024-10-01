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
import { ScreenAdminRoleName } from "../constants/roles";
import FSPhComments from "./FSPhComments/FSPhComments";
import FSPhVHitCollection from "./FSPhVHitCollection/FSPhVHitCollection";
import FSPhVHitCollectionSelection from "./FSPhVHitCollection/FSPhVHitCollectionSelection";
import FSPhVScreen from "./FSPhVScreen/FSPhVScreen";
import FSPhVSettings from "./FSPhVSettings/FSPhVSettings";
import * as Helper from "./FSPhViewerHelper";

const FSPhViewer = () => {
  const params = useParams();
  const navigate = useNavigate();

  const rootStore = useContext(RootStoreContext);
  const {
    fetchScreen,
    selectedScreen,
    isFetchingScreen,
    isScreenRegistryCacheValid,
  } = rootStore.screenStore;

  const { fetchHitCollectionsOfScreen } = rootStore.hitCollectionStore;

  const { isUserInAnyOfRoles } = AppRoleResolver();

  useEffect(() => {
    if (
      selectedScreen === undefined ||
      selectedScreen?.id !== params?.id ||
      !isScreenRegistryCacheValid
    ) {
      fetchScreen(params.id);
    }
  }, [params.id, fetchScreen, selectedScreen, isScreenRegistryCacheValid]);

  useEffect(() => {
    if (selectedScreen && selectedScreen?.id === params?.id) {
      fetchHitCollectionsOfScreen(selectedScreen.id);
    }
  }, [selectedScreen, params.id, fetchHitCollectionsOfScreen]);

  if (isFetchingScreen) {
    return <Loading message={"Fetching Screen..."} />;
  }

  let renderAdminModules = isUserInAnyOfRoles([ScreenAdminRoleName]);

  if (selectedScreen && selectedScreen?.id === params?.id) {
    return (
      <div className="flex w-full">
        <div className="flex gap-2 w-full">
          <div className="flex">
            <Menu model={Helper.sidePanelItems(navigate, renderAdminModules)} />
          </div>
          <div className="flex w-full">
            <Routes>
              <Route index element={<Navigate replace to="screens/" />} />
              <Route
                path="hits/:hitCollectionId/"
                element={<FSPhVHitCollection selectedScreen={selectedScreen} />}
              />
              <Route
                path="hits/"
                element={
                  <FSPhVHitCollectionSelection
                    selectedScreen={selectedScreen}
                  />
                }
              />
              <Route
                path="screens/"
                element={<FSPhVScreen selectedScreen={selectedScreen} />}
              />

              {renderAdminModules && (
                <Route
                  path="settings/"
                  element={<FSPhVSettings selectedScreen={selectedScreen} />}
                />
              )}

              <Route
                path="discussion/"
                element={<FSPhComments selectedScreen={selectedScreen} />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </div>
    );
  }

  return <div>FSPhViewer</div>;
};

export default observer(FSPhViewer);
