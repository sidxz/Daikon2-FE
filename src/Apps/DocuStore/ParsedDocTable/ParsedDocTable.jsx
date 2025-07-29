import { observer } from "mobx-react-lite";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import FDate from "../../../Library/FDate/FDate";
import PDTPreview from "./components/PDTPreview";
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
      <div className="flex border-0 justify-content-end flex-wrap">
        <div className="flex border-0 align-items-center">
          <IconField iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Keyword Search"
              size={35}
            />
          </IconField>
        </div>
      </div>
    );
  };

  const header = renderHeader();

  const tagBodyTemplate = (rowData) => {
    const tags = rowData?.tags.map((tag) => (
      <div
        key={tag}
        className="flex p-1 border-1 border-50 text-sm text-color-secondary"
      >
        {tag}
      </div>
    ));
    return <div className="flex gap-2 flex-wrap">{tags}</div>;
  };

  const nameBodyTemplate = (rowData) => {
    return (
      <div className="flex flex-column">
        <div className="flex flex-column align-items-center justify-content-between">
          {/* File name with text wrapping */}
          <div className="flex align-items-center m-0">
            <p className="no-underline font-semibold	text-wrap capitalize">
              {(
                rowData?.name?.split(".").slice(0, -1).join(".") ||
                rowData?.name
              ).replace(/_/g, " ")}
            </p>
          </div>
          {/* <div className="flex align-items-center border-1 border-round-xl border-blue-300"> */}
          <div className="flex align-items-start border-0 w-full">
            {/* Download button */}
            <Button
              icon="pi pi-download"
              aria-label="Download"
              rounded
              severity="info"
              onClick={() => window.open(rowData?.externalPath, "_blank")}
              cursor="pointer"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex w-full w-full select-text">
      <DataTable
        header={header}
        value={docs}
        className="flex flex-column w-full select-text"
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
        sortField="publicationDate.value"
        sortOrder={-1}
      >
        <Column
          header="#"
          body={(data, options) => options.rowIndex + 1}
        ></Column>
        <Column
          field="name"
          header="File Name"
          body={nameBodyTemplate}
          className="text-wrap"
          //editor={(options) => TextAreaRowEditorDVar(options)}
        />

        <Column
          field="publicationDate.value"
          header="Date"
          body={(rowData) => (
            <FDate timestamp={rowData?.publicationDate?.value} />
          )}
          sortable
          //editor={(options) => TextAreaRowEditorDVar(options)}
        />
        <Column
          field="shortSummary"
          className="select-text"
          header="Summary Preview"
          body={(rowData) => <PDTPreview rowData={rowData} />}
          //editor={(options) => TextAreaRowEditorDVar(options)}
        />
        <Column
          header="Identified Molecules"
          body={(rowData) => (
            <PDTStructures moleculesView={rowData?.moleculeView} />
          )}
          //editor={(options) => TextAreaRowEditorDVar(options)}
        />
        <Column
          className="select-text"
          header="Document Tags"
          body={tagBodyTemplate}
          //editor={(options) => TextAreaRowEditorDVar(options)}
        />
      </DataTable>
    </div>
  );
};

export default observer(ParsedDocTable);
