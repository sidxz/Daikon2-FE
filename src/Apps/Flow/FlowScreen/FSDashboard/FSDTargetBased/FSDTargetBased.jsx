import { observer } from "mobx-react-lite";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Loading from "../../../../../Library/Loading/Loading";
import { RootStoreContext } from "../../../../../RootStore";

const FSDTargetBased = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    fetchScreens,
    isScreenListCacheValid,
    screenListTargetBased,
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
      <NavLink to={"../../viewer/tb/" + rowData.id}>{rowData.name}</NavLink>
    );
  };

  let associateTargetBodyTemplate = (rowData) => {
    if (!rowData.associatedTargets) return <div></div>;
    // loop across key value pairs in rowData.associatedTargets and display value

    return (
      <div>
        {Object.entries(rowData.associatedTargets).map(([key, value]) => (
          <div key={key} className="flex">
            <div className="flex">{value}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500">
      <div className="flex w-full">
        <DataTable
          value={screenListTargetBased}
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
            // field="name"
            header="Target"
            body={associateTargetBodyTemplate}
            filter
            filterMatchMode="contains"
            filterPlaceholder="Search"
            className="narrow-column"
            sortable
          />

          <Column
            field="method"
            header="Method"
            filter
            filterMatchMode="contains"
            filterPlaceholder="Search"
            className="narrow-column"
          />

          <Column
            field="primaryOrgName"
            header="Primary Org"
            filter
            filterMatchMode="contains"
            filterPlaceholder="Search"
            className="narrow-column"
            //body={ProductBodyTemplate}
          />

          <Column
            field="status"
            header="Status"
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

export default observer(FSDTargetBased);
