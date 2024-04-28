import { observer } from "mobx-react-lite";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useContext, useEffect } from "react";
import Loading from "../../../../../Library/Loading/Loading";
import { RootStoreContext } from "../../../../../RootStore";
import * as Helper from "./FHaDAllProjectsHelper";

const FHaDAllProjects = () => {
  const rootStore = useContext(RootStoreContext);
  const { fetchHAs, isHaListCacheValid, haList, isFetchingHAs } =
    rootStore.haStore;

  useEffect(() => {
    if (!isHaListCacheValid) {
      fetchHAs();
    }
  }, [isHaListCacheValid, fetchHAs]);

  if (isFetchingHAs) {
    return <Loading message={"Fetching HAs..."} />;
  }

  console.log("haList", haList);

  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500">
      <div className="flex w-full">
        <DataTable
          className="w-full"
          value={haList}
          paginator
          rows={10}
          filterDisplay="row"
        >
          <Column
            body={Helper.nameBodyTemplate}
            field="name"
            header="Project Name"
            filter
            filterMatchMode="contains"
            filterPlaceholder="Search"
            className="narrow-column"
            sortable
          />

          <Column
            field="primaryOrgName"
            header="Primary Org"
            body={Helper.orgBodyTemplate}
            filter
            // filterField="primaryOrgName"
            // filterElement={(options) => Helper.orgFilter(haList, options)}
            showFilterMenu={false}
            filterMatchMode="in"
            className="narrow-column"
          />

          <Column
            field="status"
            header="HA Status"
            filter
            filterField="status"
            filterElement={(options) => Helper.statusFilter(haList, options)}
            showFilterMenu={false}
            filterMatchMode="in"
            className="narrow-column"
            body={Helper.statusBodyTemplate}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default observer(FHaDAllProjects);
