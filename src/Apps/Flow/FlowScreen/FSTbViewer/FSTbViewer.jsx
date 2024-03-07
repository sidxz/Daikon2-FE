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
    selectedScreen,
    isFetchingScreen,
    isScreenRegistryCacheValid,
  } = rootStore.screenStore;

  useEffect(() => {
    if (
      selectedScreen === undefined ||
      selectedScreen?.id !== params?.id ||
      !isScreenRegistryCacheValid
    ) {
      fetchScreen(params.id);
    }
  }, [params.id, fetchScreen, selectedScreen, isScreenRegistryCacheValid]);

  if (isFetchingScreen) {
    return <Loading message={"Fetching Screen..."} />;
  }

  if (selectedScreen) {
    return (
      <div className="flex w-full">
        <div className="flex gap-2 w-full">
          <div className="flex">
            <Menu model={Helper.sidePanelItems(navigate)} />
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
              <Route
                path="settings/"
                element={<FSTbVSettings selectedScreen={selectedScreen} />}
              />
            </Routes>
          </div>
        </div>
      </div>
    );
  }

  return <div>FSTbViewer</div>;
};

export default observer(FSTbViewer);
