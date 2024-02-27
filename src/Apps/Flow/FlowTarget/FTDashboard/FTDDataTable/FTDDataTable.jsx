import { observer } from "mobx-react-lite";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { SelectButton } from "primereact/selectbutton";
import React from "react";
import "./FTDDataTable.css";

const FTDDataTable = () => {
  const priority = ["Yes", "All"];

  const priorityFilter = (options) => (
    <SelectButton
      value={options.value}
      options={priority}
      onChange={(e) => options.filterApplyCallback(e.value)}
      className="p-column-filter p-button-sm"
    />
  );
  return (
    <div>
      <div className="card">
        <DataTable
          paginator
          rows={15}
          // header={header}
          className="datatable-targets"
          //globalFilter={globalFilter}
          emptyMessage="No Targets found."
          filterDisplay="row"
          scrollable
          scrollHeight="400px"
        >
          <Column
            field="name"
            header="Target Name"
            filter
            filterMatchMode="contains"
            filterPlaceholder="Search by Target"
            className="narrow-column"
            sortable
          />

          <Column
            field="associatedGenes"
            filterField="targetGenesAccessionNumbers"
            header="Associated Genes"
            filter
            filterMatchMode="contains"
            filterPlaceholder="Search by Accession No."
            className="narrow-column"
          />
          <Column
            field="tbdaPriorityTarget"
            header="TBDA Priority Target"
            filter
            filterElement={priorityFilter}
            style={{ width: "250px" }}
            showFilterMenu={false}
          />

          <Column
            field="impactScore"
            header="Biological Impact Score"
            sortable
          />
          <Column field="likeScore" header="Likelihood Score" sortable />
          <Column field="bucket" header="Bucket Score" sortable />
        </DataTable>
      </div>
    </div>
  );
};

export default observer(FTDDataTable);
