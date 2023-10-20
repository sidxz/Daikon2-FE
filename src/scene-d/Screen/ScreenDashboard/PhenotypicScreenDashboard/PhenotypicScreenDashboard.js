import { observer } from "mobx-react-lite";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import ScreenStatus from "../../../../app/common/ScreenStatus/ScreenStatus";
import { RootStoreContext } from "../../../../app/stores/rootStore";

/**
 * Dashboard for phenotypic screens.
 * Fetches phenotypic screens data and renders a data table.
 */

const PhenotypicScreenDashboard = () => {
  // Extracting necessary properties from the screenPStore
  const rootStore = useContext(RootStoreContext);
  const {
    isLoadingPhenotypicScreens,
    phenotypicScreens,
    isPhenCacheValid,
    fetchPhenotypicScreens,
  } = rootStore.screenPStore;

  // Ref for the DataTable component
  const dt = useRef(null);

  const [defaultNotesFilter, setDefaultNotesFilter] = useState({
    value: "Imported from SharePoint",
    matchMode: "notContains",
  });

  // On component mount, fetch phenotypic screens if not fetched previously or if cache is invalid
  useEffect(() => {
    if (phenotypicScreens.length === 0 || !isPhenCacheValid)
      fetchPhenotypicScreens();

    // Set default filter for notes column
    if (dt && dt.current) {
      dt.current.filter(
        defaultNotesFilter.value,
        "notes",
        defaultNotesFilter.matchMode
      );
    }
  }, [
    phenotypicScreens,
    fetchPhenotypicScreens,
    isPhenCacheValid,
    dt,
    defaultNotesFilter,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  const PhenotypicScreenNameBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Target</span>
        <NavLink to={"./phenotypic/" + rowData.id}>
          {rowData.screenName}
        </NavLink>
      </React.Fragment>
    );
  };

  const StatusBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <ScreenStatus id={rowData.id} status={rowData.status} readOnly={true} />
      </React.Fragment>
    );
  };

  const NotesBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Notes</span>
        {rowData.notes}
      </React.Fragment>
    );
  };

  return (
    <>
      <DataTable
        ref={dt}
        value={phenotypicScreens}
        paginator
        rows={20}
        className="p-datatable-screens"
        //globalFilter={globalFilter}
        emptyMessage="No Phenotypic Screens found."
        filterDisplay="row"
        loading={isLoadingPhenotypicScreens}
        showGridlines={true}
      >
        <Column
          field="screenName"
          header="Name"
          body={PhenotypicScreenNameBodyTemplate}
          filter
          filterMatchMode="contains"
          filterPlaceholder="Search by Screen Name"
          className="min-w-max"
          // style={{minWidth: "50rem"}}
        />

        <Column
          field="status"
          header="Status"
          body={StatusBodyTemplate}
          // style={{minWidth: "50rem"}}
        />

        <Column
          field="notes"
          header="Notes"
          body={NotesBodyTemplate}
          filter
          filterMatchMode="contains"
          filterPlaceholder="Search by"
          filterFunction={(value, filter) =>
            filter.matchMode === "notContains"
              ? !value.includes(filter.value)
              : value.includes(filter.value)
          } // Add the filter function
        />
      </DataTable>
    </>
  );
};

export default observer(PhenotypicScreenDashboard);
