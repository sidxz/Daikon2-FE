import { observer } from "mobx-react-lite";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useContext, useEffect } from "react";
import Loading from "../../../../../Library/Loading/Loading";
import { RootStoreContext } from "../../../../../RootStore";
import { FormatScreeningMethod } from "../../shared/Formatters";
import * as Helper from "./FSDTargetBasedHelper";

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

  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500">
      <div className="flex w-full">
        <DataTable
          className="w-full"
          value={screenListTargetBased}
          paginator
          rows={50}
          filterDisplay="row"
          rowGroupMode="subheader"
          groupRowsBy="associatedTargetsFlattened"
          rowGroupHeaderTemplate={Helper.rowGroupHeaderTemplate}
          sortMode="single"
          sortField="associatedTargetsFlattened"
          sortOrder={1}
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
            field="associatedTargetsFlattened"
            header="Target"
            //body={associateTargetBodyTemplate}
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
            filterField="method"
            filterElement={(options) =>
              Helper.methodFilter(screenListTargetBased, options)
            }
            showFilterMenu={false}
            filterMatchMode="in"
            className="narrow-column"
            body={(rowData) => FormatScreeningMethod(rowData.method)}
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
              Helper.screenStatusFilter(screenListTargetBased, options)
            }
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

export default observer(FSDTargetBased);
