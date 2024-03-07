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
import FSPhVHitCollection from "./FSPhVHitCollection/FSPhVHitCollection";
import FSPhVHitCollectionSelection from "./FSPhVHitCollection/FSPhVHitCollectionSelection";
import FSPhVScreen from "./FSPhVScreen/FSPhVScreen";
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
            </Routes>
          </div>
        </div>
      </div>
    );
  }

  return <div>FSPhViewer</div>;
};

export default observer(FSPhViewer);
