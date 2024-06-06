import { observer } from "mobx-react-lite";
import { Menu } from "primereact/menu";
import React, { useContext, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Loading from "../../../Library/Loading/Loading";
import { RootStoreContext } from "../../../RootStore";
import AD_RM_Roles from "./AD_RM_Roles/AD_RM_Roles";
import * as Helper from "./AdminRoleManagementHelper";

const AdminRoleManagement = () => {
  const rootStore = useContext(RootStoreContext);

  const { fetchRoles, roleList, isFetchingRoles } =
    rootStore.adminRoleManagementStore;

  const navigate = useNavigate();

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  if (isFetchingRoles) {
    return <Loading message="Fetching roles" />;
  }

  console.log("AdminUserManagement -> Render");
  console.log(roleList);

  return (
    <div className="flex w-full">
      <div className="flex gap-2 w-full">
        <div className="flex">
          <Menu model={Helper.sidePanelItems(navigate)} />
        </div>
        <div className="flex w-full">
          <Routes>
            {/* <Route path="users/:id/*" element={<AD_UM_UserEdit />} /> */}
            <Route path="roles" element={<AD_RM_Roles />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default observer(AdminRoleManagement);
