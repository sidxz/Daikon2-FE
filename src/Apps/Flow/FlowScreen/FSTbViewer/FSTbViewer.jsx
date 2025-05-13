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
import { ScreenAdminRoleName } from "../constants/roles";
import FSTbComments from "./FSTbComments/FSTbComments";
import FSTbDocs from "./FSTbDocs/FSTbDocs";
import FSTbVHitCollection from "./FSTbVHitCollection/FSTbVHitCollection";
import FSTbVHitCollectionSelection from "./FSTbVHitCollection/FSTbVHitCollectionSelection";
import FSTbVScreen from "./FSTbVScreen/FSTbVScreen";
import FSTbVSettings from "./FSTbVSettings/FSTbVSettings";
import * as Helper from "./FSTbViewerHelper";
const FSTbViewer = () => {
  const params = useParams();
  const navigate = useNavigate();
  const rootStore = useContext(RootStoreContext);
  const {
    fetchScreen,
    fetchScreens,
    selectedScreen,
    isFetchingScreen,
    isScreenRegistryCacheValid,
  } = rootStore.screenStore;

  const { fetchHitCollectionsOfScreen, selectedHitCollection } =
    rootStore.hitCollectionStore;

  const { isUserInAnyOfRoles } = AppRoleResolver();

  useEffect(() => {
    // console.log(
    //   "FSTbViewer -> useEffect -> fetchScreen",
    //   params.id,
    //   selectedScreen?.id,
    //   isScreenRegistryCacheValid
    // );
    if (
      selectedScreen === undefined ||
      selectedScreen?.id !== params?.id ||
      !isScreenRegistryCacheValid
    ) {
      //console.log("FSTbViewer -> useEffect -> fetchScreen FETCHING", params.id);
      fetchScreens();
      fetchScreen(params.id);
    }
  }, [
    params.id,
    fetchScreen,
    selectedScreen,
    isScreenRegistryCacheValid,
    fetchScreens,
  ]);

  useEffect(() => {
    if (selectedScreen && selectedScreen?.id === params?.id) {
      fetchHitCollectionsOfScreen(selectedScreen.id, false, false);
    }
  }, [selectedScreen, params.id, fetchHitCollectionsOfScreen]);

  if (isFetchingScreen) {
    return <Loading message={"Fetching Screen..."} />;
  }
  let renderAdminModules = isUserInAnyOfRoles([ScreenAdminRoleName]);

  if (selectedScreen && selectedScreen?.id === params?.id) {
    let getRelatedScreens = () => {
      // Find out other screens having the same target in associatedTargets
      let relatedScreens = [];
      if (selectedScreen.associatedTargets) {
        let targetIds = Object.keys(selectedScreen.associatedTargets);
        for (let targetId of targetIds) {
          let screen = rootStore.screenStore.screenListTargetBased
            .filter((screen) => screen.id !== selectedScreen.id)
            .filter((screen) =>
              Object.keys(screen.associatedTargets).includes(targetId)
            );
          relatedScreens.push(...screen);
        }
      }
      // sort relatedScreens by name
      relatedScreens.sort((a, b) => a.name.localeCompare(b.name));
      return relatedScreens;
    };

    let panelInfoToRender = () => {
      let url = window.location.href;
      let isHits = url.includes("hits");
      if (isHits) {
        return (
          <PageInfoPanel
            dateCreated={selectedHitCollection?.dateCreated}
            createdById={selectedHitCollection?.createdById}
            dateUpdated={selectedHitCollection?.pageLastUpdatedDate}
            updatedById={selectedHitCollection?.pageLastUpdatedUser}
            heading="Hit Collection Info"
          />
        );
      } else {
        return (
          <PageInfoPanel
            dateCreated={selectedScreen?.dateCreated}
            createdById={selectedScreen?.createdById}
            dateUpdated={selectedScreen?.pageLastUpdatedDate}
            updatedById={selectedScreen?.pageLastUpdatedUser}
            heading="Screen Info"
          />
        );
      }
    };

    return (
      <div className="flex w-full">
        <div className="flex gap-2 w-full">
          <div className="flex flex-column border-1 border-50 p-1 border-round-md gap-2">
            <div className="flex">
              <Menu
                model={Helper.sidePanelItems(
                  navigate,
                  getRelatedScreens,
                  renderAdminModules
                )}
              />
            </div>
            <div className="flex">{panelInfoToRender()}</div>
          </div>

          <div className="flex w-full">
            <Routes>
              <Route index element={<Navigate replace to="screens/" />} />
              <Route
                path="hits/:hitCollectionId/"
                element={<FSTbVHitCollection selectedScreen={selectedScreen} />}
              />
              <Route
                path="hits/"
                element={
                  <FSTbVHitCollectionSelection
                    selectedScreen={selectedScreen}
                  />
                }
              />
              <Route
                path="screens/"
                element={<FSTbVScreen selectedScreen={selectedScreen} />}
              />
              {renderAdminModules && (
                <Route
                  path="settings/"
                  element={<FSTbVSettings selectedScreen={selectedScreen} />}
                />
              )}
              <Route
                path="docs/*"
                element={<FSTbDocs selectedScreen={selectedScreen} />}
              />
              <Route
                path="discussion/"
                element={<FSTbComments selectedScreen={selectedScreen} />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </div>
    );
  }

  return <div>FSTbViewer</div>;
};

export default observer(FSTbViewer);
