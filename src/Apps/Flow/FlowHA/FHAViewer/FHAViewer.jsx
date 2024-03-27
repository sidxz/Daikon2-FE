import { observer } from "mobx-react-lite";
import { Menu } from "primereact/menu";
import React, { useContext, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../../Library/Loading/Loading";
import { RootStoreContext } from "../../../../RootStore";
import FHaVInformation from "./FHaVInformation/FHaVInformation";
import * as Helper from "./FHaViewerHelper";

const FHaViewer = () => {
  const params = useParams();
  const navigate = useNavigate();
  const rootStore = useContext(RootStoreContext);
  const { fetchHA, selectedHA, isFetchingHA, isHARegistryCacheValid } =
    rootStore.haStore;

  useEffect(() => {
    if (
      selectedHA === undefined ||
      selectedHA?.id !== params?.id ||
      !isHARegistryCacheValid
    ) {
      fetchHA(params.id);
    }
  }, [params.id, fetchHA, selectedHA, isHARegistryCacheValid]);

  if (isFetchingHA) {
    return <Loading message={"Fetching HA..."} />;
  }

  console.log("FHAViewer -> selectedHA", selectedHA);

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
              <Route path="information/*" element={<FHaVInformation />} />
            </Routes>
          </div>
        </div>
      </div>
    );
  }
};

export default observer(FHaViewer);
