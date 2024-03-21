import { observer } from "mobx-react-lite";
import { BlockUI } from "primereact/blockui";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { RootStoreContext } from "../../../../../RootStore";
import "./FTDDataTable.css";

const FTDDataTable = ({ targets }) => {
  const rootStore = useContext(RootStoreContext);
  const {
    targetList,
    isFetchingTargets,
    fetchTargets,
    isTargetListCacheValid,
  } = rootStore.targetStore;

  useEffect(() => {
    if (!isTargetListCacheValid) {
      fetchTargets();
    }
  }, [fetchTargets, isTargetListCacheValid]);

  let nameBodyTemplate = (rowData) => {
    return <NavLink to={"viewer/" + rowData.id}>{rowData.name}</NavLink>;
  };

  return (
    <div>
      <div className="flex w-full">
        <BlockUI blocked={isFetchingTargets}>
          <DataTable
            paginator
            rows={15}
            value={targetList}
            // header={header}
            className="w-full"
            //globalFilter={globalFilter}
            emptyMessage="No Targets found."
            filterDisplay="row"
            scrollable
            loading={isFetchingTargets}
          >
            <Column
              field="name"
              header="Target Name"
              body={nameBodyTemplate}
              filter
              filterMatchMode="contains"
              filterPlaceholder="Search by Target"
              className="narrow-column"
              sortable
            />

            <Column
              field="associatedGenesFlattened"
              filterField="associatedGenesFlattened"
              header="Associated Genes"
              filter
              filterMatchMode="contains"
              filterPlaceholder="Search by Accession No."
              className="narrow-column"
            />
            <Column
              field="impactScore"
              header="Biological Impact Score"
              sortable
            />
            <Column field="likeScore" header="Likelihood Score" sortable />
            <Column field="bucket" header="Bucket Score" sortable />
          </DataTable>
        </BlockUI>
      </div>
    </div>
  );
};

export default observer(FTDDataTable);
