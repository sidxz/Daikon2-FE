import { startCase } from "lodash";
import { observer } from "mobx-react-lite";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";
const RelationsTable = ({ relations }) => {
  return (
    <div className="flex w-full">
      <DataTable
        value={relations}
        //loading={isGeneListLoading}
        className="w-full"
        emptyMessage="Loading..."
      >
        <Column
          field="nodeName"
          header="Name"
          //body={Helper.accessionNumberBodyTemplate}
          className="narrow-column"
        />
        <Column
          field="nodeType"
          header="Type"
          body={(rowData) => startCase(rowData.nodeType)}
          //body={Helper.accessionNumberBodyTemplate}
          className="narrow-column"
        />

        <Column
          field="nodeRelation"
          header="Relation"
          body={(rowData) => startCase(rowData.nodeRelation.toLowerCase())}
          //body={Helper.accessionNumberBodyTemplate}
          className="narrow-column"
        />
      </DataTable>
    </div>
  );
};

export default observer(RelationsTable);
