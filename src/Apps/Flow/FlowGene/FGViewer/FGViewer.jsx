import { observer } from "mobx-react-lite";
import { Menu } from "primereact/menu";
import React, { useContext, useEffect } from "react";
import { Navigate, Route, Routes, useNavigate, useParams } from "react-router";
import Loading from "../../../../Library/Loading/Loading";
import PageInfoPanel from "../../../../Library/PageInfoPanel/PageInfoPanel";
import { RootStoreContext } from "../../../../RootStore";
import FGVComments from "./FGVComments/FGVComments";
import FGVDocs from "./FGVDocs/FGVDocs";
import FGVPrivate from "./FGVPrivate/FGVPrivate";
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
          <div className="flex flex-column border-1 border-50 p-1 border-round-md gap-2">
            <div className="flex">
              <Menu model={Helper.sidePanelItems(navigate)} />
            </div>
            <div className="flex">
              <PageInfoPanel
                dateCreated={selectedGene?.dateCreated}
                createdById={selectedGene?.createdById}
                dateUpdated={selectedGene?.pageLastUpdatedDate}
                updatedById={selectedGene?.pageLastUpdatedUser}
              />
            </div>
          </div>
          <div className="flex border-0" style={{ width: "88%" }}>
            <Routes>
              <Route index element={<Navigate replace to="public/" />} />
              <Route
                path="public/*"
                element={<FGVPublic selectedGene={selectedGene} />}
              />
              <Route
                path="private/*"
                element={<FGVPrivate selectedGene={selectedGene} />}
              />
              <Route
                path="docs/*"
                element={<FGVDocs selectedGene={selectedGene} />}
              />
              <Route
                path="discussion/*"
                element={<FGVComments selectedGene={selectedGene} />}
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
