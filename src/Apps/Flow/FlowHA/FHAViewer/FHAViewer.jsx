import { observer } from "mobx-react-lite";
import { Menu } from "primereact/menu";
import React, { useContext, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../../Library/Loading/Loading";
import { RootStoreContext } from "../../../../RootStore";
import FHAVInformation from "./FHAVInformation/FHAVInformation";
import * as Helper from "./FHAViewerHelper";

const FHAViewer = () => {
  const params = useParams();
  const navigate = useNavigate();
  const rootStore = useContext(RootStoreContext);
  const {
    fetchHA,
    fetchHAs,
    selectedHA,
    isFetchingHA,
    isHARegistryCacheValid,
  } = rootStore.haStore;

  useEffect(() => {
    if (
      selectedHA === undefined ||
      selectedHA?.id !== params?.id ||
      !isHARegistryCacheValid
    ) {
      fetchHAs();
      fetchHA(params.id);
    }
  }, [params.id, fetchHA, selectedHA, isHARegistryCacheValid, fetchHAs]);

  if (isFetchingHA) {
    return <Loading message={"Fetching HA..."} />;
  }

  if (selectedHA) {
    return (
      <div className="flex w-full">
        <div className="flex gap-2 w-full">
          <div className="flex">
            <Menu model={Helper.sidePanelItems(navigate)} />
          </div>
          <div className="flex w-full">
            <Routes>
              <Route index element={<Navigate replace to="information/" />} />
              <Route
                path="information/*"
                element={<FHAVInformation selectedHA={selectedHA} />}
              />
            </Routes>
          </div>
        </div>
      </div>
    );
  }
};

export default observer(FHAViewer);
