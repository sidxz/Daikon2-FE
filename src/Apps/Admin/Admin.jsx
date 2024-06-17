import { observer } from "mobx-react-lite";
import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminMenuBar from "./AdminMenuBar/AdminMenuBar";
import AdminRoleManagement from "./AdminRoleManagement/AdminRoleManagement";
import AdminUserManagement from "./AdminUserManagement/AdminUserManagement";
const Admin = () => {
  return (
    <div className="flex flex-column">
      <div className="block mb-2">
        <AdminMenuBar />
      </div>
      <div className="flex w-full pl-3 pr-3 fadein animation-duration-1000">
        <Routes>
          <Route index element={<AdminUserManagement />} />
          <Route path="user-management/*" element={<AdminUserManagement />} />
          <Route path="role-management/*" element={<AdminRoleManagement />} />
        </Routes>
      </div>
    </div>
  );
};

export default observer(Admin);
