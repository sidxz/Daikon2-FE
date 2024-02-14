import { observer } from "mobx-react-lite";
import { Menu } from "primereact/menu";
import React, { useContext, useEffect } from "react";
import { Navigate, Route, Routes, useNavigate, useParams } from "react-router";
import Loading from "../../../../Library/Loading/Loading";
import { RootStoreContext } from "../../../../RootStore";
import FGVPublic from "./FGVPublic/FGVPublic";
import * as Helper from "./FGViewerHelper";
const FGViewer = () => {
  const params = useParams();
  const navigate = useNavigate();

  const rootStore = useContext(RootStoreContext);
  const { fetchGene, selectedGene, isFetchingGene } = rootStore.geneStore;

  useEffect(() => {
    if (selectedGene === undefined || selectedGene?.id !== params?.id) {
      fetchGene(params.id);
    }
  }, [params.id, fetchGene, selectedGene]);

  if (isFetchingGene) {
    return <Loading message={"Fetching Gene..."} />;
  }

  if (selectedGene) {
    return (
      <div className="flex w-full">
        <div className="flex gap-2 w-full">
          <div className="flex">
            <Menu model={Helper.sidePanelItems(navigate)} />
          </div>
          <div className="flex w-full">
            <Routes>
              <Route index element={<Navigate replace to="public/" />} />
              <Route
                path="public/*"
                element={<FGVPublic selectedGene={selectedGene} />}
              />
            </Routes>
          </div>
        </div>
      </div>
    );
  }

  return <div></div>;
};

export default observer(FGViewer);
