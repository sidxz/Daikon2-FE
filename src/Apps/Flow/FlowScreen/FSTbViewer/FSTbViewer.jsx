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
import FSTbVScreens from "./FSTbVScreens/FSTbVScreens";
import * as Helper from "./FSTbViewerHelper";
const FSTbViewer = () => {
  const params = useParams();
  const navigate = useNavigate();

  const rootStore = useContext(RootStoreContext);
  const { fetchScreen, selectedScreen, isFetchingScreen } =
    rootStore.screenStore;

  useEffect(() => {
    if (selectedScreen === undefined || selectedScreen?.id !== params?.id) {
      fetchScreen(params.id);
    }
  }, [params.id, fetchScreen, selectedScreen]);

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
                path="hits/*"
                element={<FSTbVHitCollection selectedScreen={selectedScreen} />}
              />
              <Route
                path="screens/"
                element={<FSTbVScreens selectedScreen={selectedScreen} />}
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
