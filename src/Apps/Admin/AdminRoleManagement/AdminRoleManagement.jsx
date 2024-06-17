import { observer } from "mobx-react-lite";
import { Menu } from "primereact/menu";
import React, { useContext } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { RootStoreContext } from "../../../RootStore";
import AD_RM_Roles from "./AD_RM_Roles/AD_RM_Roles";
import AD_RM_Roles_Edit from "./AD_RM_Roles/AD_RM_Roles_Edit/AD_RM_Roles_Edit";
import * as Helper from "./AdminRoleManagementHelper";

const AdminRoleManagement = () => {
  const rootStore = useContext(RootStoreContext);

  const { fetchRoles, roleList, isFetchingRoles } =
    rootStore.adminRoleManagementStore;

  const navigate = useNavigate();

  return (
    <div className="flex w-full">
      <div className="flex gap-2 w-full">
        <div className="flex">
          <Menu model={Helper.sidePanelItems(navigate)} />
        </div>
        <div className="flex w-full">
          <Routes>
            <Route path="roles/:id/*" element={<AD_RM_Roles_Edit />} />
            <Route path="roles" element={<AD_RM_Roles />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default observer(AdminRoleManagement);
