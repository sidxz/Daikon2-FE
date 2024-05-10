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
const AD_UM_Orgs = () => {
  const rootStore = useContext(RootStoreContext);
  const { fetchOrgs, orgList, isFetchingOrgs } =
    rootStore.adminUserManagementStore;

  const navigate = useNavigate();
  const { getOrgAliasById } = AppOrgResolver();
  const { getRoleNameById } = RoleResolver();

  useEffect(() => {
    fetchOrgs();
  }, [fetchOrgs]);

  if (isFetchingOrgs) {
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
        <DataTable value={orgList} paginator rows={50} filterDisplay="row">
          <Column
            field="name"
            header="Name"
            filter
            filterMatchMode="contains"
            filterPlaceholder="Search"
            className="narrow-column"
            sortable
          />
          <Column
            field="alias"
            header="ALIAS"
            filter
            filterMatchMode="contains"
            filterPlaceholder="Search"
            className="narrow-column"
            sortable
          />
          <Column
            field="address"
            header="Address"
            filter
            filterMatchMode="contains"
            filterPlaceholder="Search"
            className="narrow-column"
            sortable
          />
          <Column
            field="phone"
            header="Phone"
            // filter
            // filterMatchMode="contains"
            // filterPlaceholder="Search"
            className="narrow-column"
            body={(rowData) => getOrgAliasById(rowData.appOrgId)}
            sortable
          />
          <Column
            field="isInternal"
            header="Is internal?"
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

export default observer(AD_UM_Orgs);
