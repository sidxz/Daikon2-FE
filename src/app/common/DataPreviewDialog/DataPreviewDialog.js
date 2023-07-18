import "./DataPreviewDialog.css";

import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import React, { useMemo } from "react";
import SectionHeading from "../SectionHeading/SectionHeading";

const DataPreviewDialog = ({
  headerMap,
  data,
  existingData,
  visible,
  onHide,
  onSave,
  isSaving = false,
  comparatorKey = "id",
}) => {
  // Dialog footer with a close button
  const dialogFooter = (
    <div className="flex justify-content-end w-full">
      <div className="flex">
        <Button
          icon="pi pi-times"
          type="submit"
          label="Discard"
          className="p-mt-2"
          loading={isSaving}
          onClick={() => onHide()}
        />
      </div>
      <div className="flex">
        <Button
          icon="icon icon-common icon-database-submit"
          type="submit"
          label="Add to database"
          className="p-mt-2"
          loading={isSaving}
          onClick={() => {
            onSave(dataWithStatus.filter((d) => d.status !== "Unchanged"));
            onHide();
          }}
        />
      </div>
    </div>
  );

  const dataWithStatus = useMemo(() => {
    // Ensure existingData is defined and is an array
    if (!existingData || !Array.isArray(existingData)) {
      existingData = [];
    }

    // Ensure data is defined and is an array
    if (!data || !Array.isArray(data)) {
      data = [];
    }

    return data.map((rowData) => {
      // Find the existing row with the same ID
      let existingRow = existingData.find(
        (d) => d[comparatorKey] === rowData[comparatorKey]
      );
      let status = "";
      let className = "";

      if (!existingRow) {
        // New row
        status = "New";
        className = "new-row";
      } else {
        // Check if any values are different
        for (let key of Object.keys(rowData)) {
          if (String(rowData[key]) !== String(existingRow[key])) {
            // Existing cell with changed data
            status = "Modified";
            break;
          }
        }
        if (!status) {
          // Existing row with no changes
          status = "Unchanged";
        }
      }

      return { ...rowData, status, className };
    });
  }, [data, existingData]);

  const rowClassName = (rowData) => {
    return rowData.className ? { [rowData.className]: true } : {};
  };

  const cellClassName = (rowData, field) => {
    // Find the existing row with the same ID
    let existingRow = existingData.find(
      (d) => d[comparatorKey] === rowData[comparatorKey]
    );

    if (
      existingRow &&
      String(rowData[field]) !== String(existingRow[field]) &&
      rowData.status === "Modified"
    ) {
      // Existing cell with changed data
      return "flex w-full p-1 m-0 changed-cell border-1 border-yellow-700";
    }

    // Existing cell with no changes or new row
    return "";
  };

  const bodyTemplate = (field) => {
    return (rowData) => {
      return (
        <div
          style={{ height: "100%", width: "100%" }}
          className={cellClassName(rowData, field)}
        >
          {rowData[field]}
        </div>
      );
    };
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      footer={dialogFooter}
      header={<div>Excel Import</div>}
      maximizable
      className="w-11"
    >
      <div className="flex flex-column">
        <div className="flex">
          <SectionHeading
            icon="icon icon-common icon-exchange-alt"
            heading="Data Preview: Comparison with Existing Data"
            color="#8D99AE"
          />
        </div>
        <div className="flex">
          <DataTable
            value={dataWithStatus}
            rowClassName={rowClassName}
            size="small"
            resizableColumns
            loading={isSaving}
          >
            <Column
              field="status"
              header="Status"
              body={bodyTemplate("status")}
            ></Column>
            {headerMap &&
              Object.keys(headerMap).map((headerKey) => (
                <Column
                  field={headerKey}
                  header={headerMap[headerKey]}
                  key={headerKey}
                  body={bodyTemplate(headerKey)}
                ></Column>
              ))}
          </DataTable>
        </div>
      </div>
    </Dialog>
  );
};

export default DataPreviewDialog;
