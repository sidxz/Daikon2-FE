import { observer } from "mobx-react-lite";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Sidebar } from "primereact/sidebar";
import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Loading from "../../../../Library/Loading/Loading";
import SecHeading from "../../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../../RootStore";
import { appColors } from "../../../../constants/colors";
import AD_RM_RoleAdd from "./components/AD_RM_RoleAdd";

const AD_RM_Roles = () => {
  const rootStore = useContext(RootStoreContext);
  const { fetchRoles, roleList, isFetchingRoles } =
    rootStore.adminRoleManagementStore;

  const navigate = useNavigate();

  const [displayAddSideBar, setDisplayAddSideBar] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  if (isFetchingRoles) {
    return <Loading message="Fetching roles" />;
  }

  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500">
      <div className="flex w-full">
        <SecHeading
          icon="pi pi-fw pi-user-plus"
          heading="Role Management"
          color={appColors.admin.userManagement.users}
          customButtons={[
            {
              label: "Create Role",
              icon: "pi pi-plus",
              action: () => setDisplayAddSideBar(true),
            },
          ]}
        />
      </div>
      <div className="flex w-full">
        <DataTable value={roleList} paginator rows={50} filterDisplay="row">
          <Column
            field="id"
            header="Id"
            filter
            filterMatchMode="contains"
            filterPlaceholder="Search"
            className="narrow-column"
            sortable
            body={(rowData) => rowData.id.substring(0, 8)}
          />

          <Column
            field="name"
            header="Name"
            filter
            filterMatchMode="contains"
            filterPlaceholder="Search"
            className="narrow-column"
            body={(rowData) => (
              <NavLink to={`/admin/role-management/roles/${rowData.id}`}>
                {rowData.name}
              </NavLink>
            )}
            sortable
          />

          <Column
            field="description"
            header="Description"
            filter
            filterMatchMode="contains"
            filterPlaceholder="Search"
            className="narrow-column"
            sortable
          />

          <Column
            field="selfAccessLevel"
            header="Self Access Level"
            className="narrow-column"
          />

          <Column
            field="organizationAccessLevel"
            header="Organization Access Level"
            className="narrow-column"
          />

          <Column
            field="allAccessLevel"
            header="All Access Level"
            className="narrow-column"
          />
        </DataTable>
      </div>
      <Sidebar
        visible={displayAddSideBar}
        position="right"
        onHide={() => setDisplayAddSideBar(false)}
        className="p-sidebar-md"
        header={"Create Role"}
      >
        <AD_RM_RoleAdd closeSideBar={() => setDisplayAddSideBar(false)} />
      </Sidebar>
    </div>
  );
};

export default observer(AD_RM_Roles);
