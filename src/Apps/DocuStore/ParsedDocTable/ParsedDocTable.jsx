import { observer } from "mobx-react-lite";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";
import { NavLink } from "react-router-dom";
import TableRowBodyDVar from "../../../Shared/DVariable/TableRowBodyDVar";
import PDTStructures from "./components/PDTStructures";

const ParsedDocTable = ({ docs }) => {
  return (
    <div className="flex w-full">
      <DataTable
        value={docs}
        dataKey="id"
        showGridlines
        removableSort
        //header={tableHeader}
      >
        <Column
          field="name"
          header="Name"
          body={(rowData) => (
            <>
              <NavLink to={rowData?.externalPath}>{rowData?.name}</NavLink>
            </>
          )}
          //editor={(options) => TextAreaRowEditorDVar(options)}
        />
        <Column
          field="authors"
          header="Authors"
          body={(rowData) => <TableRowBodyDVar dVar={rowData?.authors} />}
          //editor={(options) => TextAreaRowEditorDVar(options)}
        />
        <Column
          field="title"
          header="Title"
          body={(rowData) => <TableRowBodyDVar dVar={rowData?.title} />}
          //editor={(options) => TextAreaRowEditorDVar(options)}
        />
        <Column
          field="shortSummary"
          header="Summary"
          body={(rowData) => <TableRowBodyDVar dVar={rowData?.shortSummary} />}
          //editor={(options) => TextAreaRowEditorDVar(options)}
        />
        <Column
          header="Identified Molecules"
          body={(rowData) => (
            <PDTStructures moleculesView={rowData?.moleculeView} />
          )}
          //editor={(options) => TextAreaRowEditorDVar(options)}
        />
      </DataTable>
    </div>
  );
};

export default observer(ParsedDocTable);
