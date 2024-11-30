import { observer } from "mobx-react-lite";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";
import { FcDownload } from "react-icons/fc";
import TableRowBodyDVar from "../../../Shared/DVariable/TableRowBodyDVar";
import PDTStructures from "./components/PDTStructures";
const ParsedDocTable = ({ docs }) => {
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex border-0 justify-content-center flex-wrap">
        <div className="flex border-0 align-items-center">
          <IconField iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Keyword Search"
              size={90}
            />
          </IconField>
        </div>
      </div>
    );
  };

  const header = renderHeader();

  const nameBodyTemplate = (rowData) => {
    const tags = rowData?.tags.map((tag) => (
      <div key={tag} className="flex p-1 border-1 border-50">
        {tag}
      </div>
    ));

    return (
      <div className="flex flex-column">
        <div className="flex flex-column align-items-center justify-content-between">
          {/* File name with text wrapping */}
          <div className="flex align-items-center m-0">
            <p
              className="no-underline font-medium text-wrap w-10rem"
              style={{ wordBreak: "break-all" }}
            >
              {(
                rowData?.name?.split(".").slice(0, -1).join(".") ||
                rowData?.name
              ).replace(/_/g, " ")}
            </p>
          </div>
          <div className="flex align-items-center">
            {/* Download button */}
            <Button
              icon={<FcDownload className="m-1" />}
              label="Download"
              className="p-button-rounded p-button-text p-button-plain"
              onClick={() => window.open(rowData?.externalPath, "_blank")}
              cursor="pointer"
            />
          </div>
        </div>
        {/* Tags */}
        <div className="flex flex-wrap gap-1 text-sm pt-2">{tags}</div>
      </div>
    );
  };

  return (
    <div className="flex w-full w-full">
      <DataTable
        header={header}
        value={docs}
        className="flex flex-column w-full"
        dataKey="id"
        showGridlines
        removableSort
        globalFilterFields={[
          "name",
          "authors.value",
          "title.value",
          "shortSummary.value",
        ]}
        filterDisplay="row"
        filters={filters}
        //resizableColumns
        //columnResizeMode="fit"
        //header={tableHeader}
      >
        <Column
          field="name"
          header="File Name"
          body={nameBodyTemplate}
          className="text-wrap"
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
          header="Preview"
          className="text-justify	line-height-3"
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
