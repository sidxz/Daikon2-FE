import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import React from "react";
import ImportFromExcel from "../../../../Shared/Excel/ImportFromExcel";
const MDInput = ({ inputs, setInputs, moveToPreview }) => {
  const columns = [
    { field: "name", header: "Name" },
    { field: "SMILES", header: "SMILES" },
    { field: "CDDId", header: "CDD Id (Optional)" },
  ];

  const addBlankInput = () => {
    setInputs([
      ...inputs,
      { name: "Click to Edit", SMILES: "Click to Edit", CDDId: "" },
    ]);
  };

  const DtFieldsToExcelColumnMapping = {
    name: "Name",
    SMILES: "SMILES",
    CDDId: "CDD Id (Optional)",
  };

  let onUpload = async (e) => {
    let file = e.files[0];
    const jsonData = await ImportFromExcel({
      file: file,
      headerMap: DtFieldsToExcelColumnMapping,
    });
    e.files = null;

    // This is to clear the file list in the FileUpload component
    e.options.clear();
    // console.log("jsonData", jsonData);
    jsonData.forEach((row) => {
      row.name = row.name ?? "Click to Edit";
      row.SMILES = row.SMILES ?? "Click to Edit";
      row.CDDId = row.CDDId ?? "";
    });
    setInputs(jsonData);
    //hideFileUploadDialog();
  };

  const onCellEditComplete = (e) => {
    let { rowData, newValue, field, originalEvent: event } = e;

    switch (field) {
      default:
        if (newValue.trim().length > 0) rowData[field] = newValue;
        else event.preventDefault();
        break;
    }
  };

  const dataTableHeader = (
    <div className="table-header flex flex-row w-full">
      <div className="flex justify-content-start gap-1">
        <div className="flex flex-grow min-w-max w-full">
          <div className="flex border-0 border-50"></div>
        </div>
      </div>
      <div className="flex justify-content-end gap-2 w-full">
        <div className="flex flex-grow min-w-max">
          <Button
            icon="pi pi-plus"
            className="p-button-text p-button-secondary"
            label="Add Row"
            onClick={addBlankInput}
          />
        </div>
        <div className="flex flex-grow min-w-max">
          <FileUpload
            mode="basic"
            name="excelFile"
            accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            maxFileSize={1000000}
            //url="/api/upload"
            customUpload={true}
            uploadHandler={onUpload}
            auto
            chooseLabel="Import from Excel"
            chooseOptions={{
              icon: "icon icon-common icon-plus-circle",
              className: "p-button-text p-button-md",
            }}
            cancelOptions={{
              label: "Cancel",
              icon: "pi pi-times",
              className: "p-button-danger",
            }}
            className="p-button-text p-button-secondary"
          />
        </div>
      </div>
    </div>
  );

  const textEditor = (options) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
        onKeyDown={(e) => e.stopPropagation()}
      />
    );
  };

  return (
    <div className="flex flex-column justify-content-center align-items-center w-11 gap-2">
      <div className="flex flex-column w-full gap-1">
        <div className="flex w-full">
          <p className="text-2xl p-0 m-0">Disclosure Data</p>
        </div>
        <div className="flex w-full">
          <p className="text-md p-0 m-0">
            Please enter the compound’s Name and its corresponding SMILES
            string. The Name must already be registered in DAIKON’s Moleculogix
            database. Use this form to disclose the chemical structure of
            molecules that are already known to DAIKON but currently have
            'undisclosed' structures. If you need to add a brand-new molecule,
            please register it first in Moleculogix.
          </p>
        </div>
      </div>
      <div className="flex w-full border-1 border-50 border-round surface-ground">
        <DataTable
          className="w-full"
          value={inputs}
          editMode="cell"
          //tableStyle={{ minWidth: "100rem" }}
          header={dataTableHeader}
        >
          {columns.map(({ field, header }) => {
            return (
              <Column
                key={field}
                field={field}
                header={header}
                //body={field === "price" && priceBodyTemplate}
                editor={(options) => textEditor(options)}
                onCellEditComplete={onCellEditComplete}
              />
            );
          })}
        </DataTable>
      </div>
    </div>
  );
};

export default observer(MDInput);
