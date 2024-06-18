import { observer } from "mobx-react-lite";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Sidebar } from "primereact/sidebar";
import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Loading from "../../../../Library/Loading/Loading";
import SecHeading from "../../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../../RootStore";
import { AppOrgResolver } from "../../../../Shared/VariableResolvers/AppOrgResolver";
import { appColors } from "../../../../constants/colors";
import AD_UM_OrgAdd from "./components/AD_UM_OrgAdd";
const AD_UM_Orgs = () => {
  const rootStore = useContext(RootStoreContext);
  const { fetchOrgs, orgList, isFetchingOrgs } =
    rootStore.adminUserManagementStore;

  const navigate = useNavigate();
  const { getOrgAliasById } = AppOrgResolver();

  const [displayAddSideBar, setDisplayAddSideBar] = useState(false);

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
          heading="Orgs Management"
          color={appColors.admin.userManagement.orgs}
          customButtons={[
            {
              label: "New Org",
              icon: "pi pi-plus",
              action: () => setDisplayAddSideBar(true),
            },
          ]}
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
            body={(rowData) => (
              <NavLink to={`/admin/user-management/orgs/${rowData.id}`}>
                {rowData.name}
              </NavLink>
            )}
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
      <Sidebar
        visible={displayAddSideBar}
        position="right"
        onHide={() => setDisplayAddSideBar(false)}
        className="p-sidebar-sm"
        header={"Add Org"}
      >
        <AD_UM_OrgAdd closeSideBar={() => setDisplayAddSideBar(false)} />
      </Sidebar>
    </div>
  );
};

export default observer(AD_UM_Orgs);
