import "./DataPreviewDialog.css";

import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import React, { useMemo } from "react";

const DataPreviewDialog = ({
  headerMap,
  data,
  existingData,
  visible,
  onHide,
}) => {
  // Dialog footer with a close button
  const dialogFooter = (
    <button onClick={onHide} className="p-button-text p-button-plain">
      Close
    </button>
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
      let existingRow = existingData.find((d) => d.id === rowData.id);
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
          status = "No Change";
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
    let existingRow = existingData.find((d) => d.id === rowData.id);

    if (
      existingRow &&
      String(rowData[field]) !== String(existingRow[field]) &&
      rowData.status === "Modified"
    ) {
      // Existing cell with changed data
      return "changed-cell";
    }

    // Existing cell with no changes or new row
    return "";
  };

  const bodyTemplate = (field) => {
    return (rowData) => {
      return (
        <span className={cellClassName(rowData, field)}>{rowData[field]}</span>
      );
    };
  };

  return (
    <Dialog visible={visible} onHide={onHide} footer={dialogFooter}>
      <DataTable value={dataWithStatus} rowClassName={rowClassName}>
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
    </Dialog>
  );
};

export default DataPreviewDialog;
