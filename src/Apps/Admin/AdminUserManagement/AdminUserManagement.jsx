import { observer } from "mobx-react-lite";
import { Menu } from "primereact/menu";
import React, { useContext, useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Loading from "../../../Library/Loading/Loading";
import { RootStoreContext } from "../../../RootStore";
import AD_UM_Users from "./AD_UM_Users/AD_UM_Users";
import * as Helper from "./AdminUserManagementHelper";
const AdminUserManagement = () => {
  const rootStore = useContext(RootStoreContext);
  const { fetchUsers, userList, isFetchingUsers } =
    rootStore.adminUserManagementStore;

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (isFetchingUsers) {
    return <Loading message="Fetching users" />;
  }

  return (
    <div className="flex w-full">
      <div className="flex gap-2 w-full">
        <div className="flex">
          <Menu model={Helper.sidePanelItems(navigate)} />
        </div>
        <div className="flex w-full">
          <Routes>
            <Route
              index
              element={<Navigate replace to="user-management/users" />}
            />
            <Route path="user-management/users" element={<AD_UM_Users />} />
            {/* <Route path="user-management/orgs" element={<AD_UM_Orgs />} /> */}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default observer(AdminUserManagement);
