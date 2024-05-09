import { observer } from "mobx-react-lite";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../../../Library/Loading/Loading";
import SecHeading from "../../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../../RootStore";
import { AppOrgResolver } from "../../../../Shared/VariableResolvers/AppOrgResolver";
import { RoleResolver } from "../../../../Shared/VariableResolvers/RoleResolver";
import { appColors } from "../../../../constants/colors";
const AD_UM_Users = () => {
  const rootStore = useContext(RootStoreContext);
  const { fetchUsers, userList, isFetchingUsers } =
    rootStore.adminUserManagementStore;

  const navigate = useNavigate();
  const { getOrgAliasById } = AppOrgResolver();
  const { getRoleNameById } = RoleResolver();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (isFetchingUsers) {
    return <Loading message="Fetching users" />;
  }

  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500">
      <div className="flex w-full">
        <SecHeading
          icon="pi pi-fw pi-user-plus"
          heading="User Management"
          color={appColors.admin.userManagement.users}
        />
      </div>
      <div className="flex w-full">
        <DataTable value={userList} paginator rows={10} filterDisplay="row">
          <Column
            field="email"
            header="Email"
            filter
            filterMatchMode="contains"
            filterPlaceholder="Search"
            className="narrow-column"
            sortable
          />
          <Column
            field="firstName"
            header="First Name"
            filter
            filterMatchMode="contains"
            filterPlaceholder="Search"
            className="narrow-column"
            sortable
          />
          <Column
            field="lastName"
            header="Last Name"
            filter
            filterMatchMode="contains"
            filterPlaceholder="Search"
            className="narrow-column"
            sortable
          />
          <Column
            field="appOrgId"
            header="App Org"
            // filter
            // filterMatchMode="contains"
            // filterPlaceholder="Search"
            className="narrow-column"
            body={(rowData) => getOrgAliasById(rowData.appOrgId)}
            sortable
          />
          <Column
            field="isOIDCConnected"
            header="OIDC Connected?"
            filter
            filterMatchMode="contains"
            filterPlaceholder="Search"
            className="narrow-column"
            sortable
          />
          <Column
            field="appRoleIds"
            header="Role Ids"
            // filter
            // filterMatchMode="contains"
            // filterPlaceholder="Search"

            className="narrow-column"
            body={(rowData) => {
              return rowData.appRoleIds
                .map((roleId) => getRoleNameById(roleId))
                .join(", ");
            }}
            sortable
          />
          <Column
            field="isUserLocked"
            header="User Locked?"
            filter
            filterMatchMode="contains"
            filterPlaceholder="Search"
            className="narrow-column"
            sortable
          />
        </DataTable>
      </div>
    </div>
  );
};

export default observer(AD_UM_Users);
