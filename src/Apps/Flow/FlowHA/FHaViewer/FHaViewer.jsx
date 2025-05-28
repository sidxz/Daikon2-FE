import { observer } from "mobx-react-lite";
import { Menu } from "primereact/menu";
import React, { useContext, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../../Library/Loading/Loading";
import NotFound from "../../../../Library/NotFound/NotFound";
import PageInfoPanel from "../../../../Library/PageInfoPanel/PageInfoPanel";
import { RootStoreContext } from "../../../../RootStore";
import { AppRoleResolver } from "../../../../Shared/VariableResolvers/AppRoleResolver";
import { HaAdminRoleName } from "../constants/roles";
import FHaVComments from "./FHaVComments/FHaVComments";
import FHaVDocs from "./FHaVDocs/FHaVDocs";
import * as Helper from "./FHaViewerHelper";
import FHaVInformation from "./FHaVInformation/FHaVInformation";
import FHaVRelations from "./FHaVRelations/FHaVRelations";
import FHaVSettings from "./FHaVSettings/FHaVSettings";

const FHaViewer = () => {
  const params = useParams();
  const navigate = useNavigate();
  const rootStore = useContext(RootStoreContext);
  const { fetchHa, selectedHa, isFetchingHa, isHaRegistryCacheValid } =
    rootStore.haStore;

  const { isUserInAnyOfRoles } = AppRoleResolver();

  useEffect(() => {
    if (
      selectedHa === undefined ||
      selectedHa?.id !== params?.id ||
      !isHaRegistryCacheValid
    ) {
      fetchHa(params.id);
    }
  }, [params.id, fetchHa, selectedHa, isHaRegistryCacheValid]);

  if (isFetchingHa) {
    return <Loading message={"Fetching HA..."} />;
  }

  console.log("FHAViewer -> selectedHa", selectedHa);

  if (selectedHa) {
    return (
      <div className="flex w-full">
        <div className="flex gap-2 w-full">
          <div className="flex flex-column border-1 border-50 p-1 border-round-md gap-2">
            <div className="flex">
              <Menu model={Helper.sidePanelItems(navigate)} />
            </div>
            <div className="flex">
              <PageInfoPanel
                dateCreated={selectedHa?.dateCreated}
                createdById={selectedHa?.createdById}
                dateUpdated={selectedHa?.pageLastUpdatedDate}
                updatedById={selectedHa?.pageLastUpdatedUser}
              />
            </div>
          </div>
          <div className="flex w-full">
            <Routes>
              <Route index element={<Navigate replace to="information/" />} />
              <Route path="information/*" element={<FHaVInformation />} />
              <Route
                path="docs/*"
                element={<FHaVDocs selectedHa={selectedHa} />}
              />
              <Route
                path="discussion/*"
                element={<FHaVComments selectedHa={selectedHa} />}
              />
              {isUserInAnyOfRoles([HaAdminRoleName]) && (
                <Route path="settings/*" element={<FHaVSettings />} />
              )}
              {isUserInAnyOfRoles([HaAdminRoleName]) && (
                <Route path="relations/*" element={<FHaVRelations />} />
              )}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </div>
    );
  }
};

export default observer(FHaViewer);
