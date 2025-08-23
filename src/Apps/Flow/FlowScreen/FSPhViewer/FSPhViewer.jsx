import { observer } from "mobx-react-lite";
import { Menu } from "primereact/menu";
import { useContext, useEffect } from "react";
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
import FSPhComments from "./FSPhComments/FSPhComments";
import FSPhDocs from "./FSPhDocs/FSPhDocs";
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

  const { fetchHitCollectionsOfScreen, selectedHitCollection } =
    rootStore.hitCollectionStore;

  const { isUserInAnyOfRoles } = AppRoleResolver();

  useEffect(() => {
    if (
      selectedScreen === undefined ||
      selectedScreen?.id !== params?.id ||
      !isScreenRegistryCacheValid
    ) {
      fetchScreen(params.id);
    }
  }, [params.id, fetchScreen, selectedScreen?.id, isScreenRegistryCacheValid]);

  useEffect(() => {
    if (selectedScreen && selectedScreen?.id === params?.id) {
      fetchHitCollectionsOfScreen(selectedScreen.id);
    }
  }, [selectedScreen?.id, params.id, fetchHitCollectionsOfScreen]);

  if (isFetchingScreen) {
    return <Loading message={"Fetching Screen..."} />;
  }

  let renderAdminModules = isUserInAnyOfRoles([ScreenAdminRoleName]);

  if (selectedScreen && selectedScreen?.id === params?.id) {
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
                model={Helper.sidePanelItems(navigate, renderAdminModules)}
              />
            </div>
            <div className="flex">{panelInfoToRender()}</div>
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
                path="docs/*"
                element={<FSPhDocs selectedScreen={selectedScreen} />}
              />

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
