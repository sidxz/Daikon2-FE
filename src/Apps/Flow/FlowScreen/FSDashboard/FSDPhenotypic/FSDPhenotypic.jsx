import { observer } from "mobx-react-lite";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Loading from "../../../../../Library/Loading/Loading";
import { RootStoreContext } from "../../../../../RootStore";
import * as Helper from "./FSDPhenotypicHelper";

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
          className="w-full"
          value={screenListPhenotypic}
          paginator
          rows={30}
          filterDisplay="row"
        >
          <Column
            body={Helper.nameBodyTemplate}
            field="name"
            header="Name"
            filter
            filterMatchMode="contains"
            filterPlaceholder="Search"
            className="narrow-column"
            sortable
          />

          <Column
            field="primaryOrgAlias"
            header="Primary Org"
            filter
            filterMatchMode="contains"
            className="narrow-column"
          />

          <Column
            field="status"
            header="Status"
            filter
            filterField="status"
            filterElement={(options) =>
              Helper.screenStatusFilter(screenListPhenotypic, options)
            }
            showFilterMenu={false}
            filterMatchMode="in"
            className="narrow-column"
            body={Helper.statusBodyTemplate}
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
