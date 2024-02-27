import { observer } from "mobx-react-lite";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Loading from "../../../../../Library/Loading/Loading";
import { RootStoreContext } from "../../../../../RootStore";

const FSDPhenotypic = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    fetchScreens,
    isScreenListCacheValid,
    screenListPhenotypic,
    isFetchingScreens,
  } = rootStore.screenStore;

  useEffect(() => {
    if (!isScreenListCacheValid) {
      fetchScreens();
    }
  }, [isScreenListCacheValid, fetchScreens]);

  if (isFetchingScreens) {
    return <Loading message={"Fetching Screens..."} />;
  }

  let nameBodyTemplate = (rowData) => {
    return (
      <NavLink to={"../../viewer/ph/" + rowData.id}>{rowData.name}</NavLink>
    );
  };

  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500">
      <div className="flex w-full">
        <DataTable
          value={screenListPhenotypic}
          paginator
          rows={10}
          filterDisplay="row"
        >
          <Column
            body={nameBodyTemplate}
            field="name"
            header="Name"
            filter
            filterMatchMode="contains"
            filterPlaceholder="Search"
            className="narrow-column"
            sortable
          />

          <Column
            field="primaryOrgName"
            header="Primary Org"
            filter
            filterMatchMode="contains"
            filterPlaceholder="Search"
            className="narrow-column"
          />

          <Column
            field="status"
            header="Status"
            filter
            filterMatchMode="contains"
            filterPlaceholder="Search"
            className="narrow-column"
          />

          <Column
            field="notes"
            header="Notes"
            filter
            filterMatchMode="contains"
            filterPlaceholder="Search"
            className="narrow-column"
          />
        </DataTable>
      </div>
    </div>
  );
};

export default observer(FSDPhenotypic);
