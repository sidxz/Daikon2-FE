import "./DataPreviewDialog.css";

import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import React, { useMemo } from "react";
import SecHeading from "../SecHeading/SecHeading";

const DataPreviewDialog = ({
  headerMap,
  data,
  existingData,
  visible,
  onHide,
  onSave,
  isSaving = false,
  comparatorKey = "id",
  fieldFlatteners = {}, // <-- NEW: pass in dynamic flattening behavior
  customBodyTemplates = {}, // <-- NEW
}) => {
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
            const rowsToSave = dataWithStatus
              .filter((d) => d.status !== "Unchanged")
              .map((d) => {
                // Merge the original row and attach the status field
                const row = d._originalRow ? { ...d._originalRow } : { ...d };
                row.status = d.status; // Add the computed status
                return row;
              });

            onSave(rowsToSave);
            onHide();
          }}
        />
      </div>
    </div>
  );

  const dataWithStatus = useMemo(() => {
    if (!existingData || !Array.isArray(existingData)) {
      existingData = [];
    }

    if (!data || !Array.isArray(data)) {
      data = [];
    }

    return data.map((originalRow) => {
      const flattened = { ...originalRow };

      // Dynamically flatten any fields using provided flatteners
      Object.entries(fieldFlatteners).forEach(([field, flattenFn]) => {
        if (field in originalRow && Array.isArray(originalRow[field])) {
          flattened[field] = flattenFn(originalRow[field]);
        }
      });

      // Keep original version
      flattened._originalRow = originalRow;

      const existingRow = existingData.find(
        (d) => d[comparatorKey] === originalRow[comparatorKey]
      );

      let status = "";
      let className = "";

      if (!existingRow) {
        status = "New";
        className = "new-row";
      } else {
        for (let key of Object.keys(flattened).filter(
          (k) => k !== "_originalRow"
        )) {
          const originalValue = flattened[key];
          let existingValue = existingRow[key];

          // Apply the same flattening to existing value if needed
          if (fieldFlatteners[key] && Array.isArray(existingValue)) {
            existingValue = fieldFlatteners[key](existingValue);
          }

          if (
            (originalValue === null ||
              originalValue === undefined ||
              originalValue === "") &&
            (existingValue === null ||
              existingValue === undefined ||
              existingValue === "")
          ) {
            continue;
          }

          if (String(originalValue) !== String(existingValue)) {
            console.log(
              `Field ${key} changed from ${String(existingValue)} to ${String(
                originalValue
              )}`
            );
            status = "Modified";
            break;
          }
        }
      }

      return { ...flattened, status, className };
    });
  }, [data, existingData, fieldFlatteners]);

  const rowClassName = (rowData) => {
    return rowData.className ? { [rowData.className]: true } : {};
  };

  const cellClassName = (rowData, field) => {
    const existingRow = existingData.find(
      (d) => d[comparatorKey] === rowData[comparatorKey]
    );

    if (
      existingRow &&
      String(rowData[field]) !== String(existingRow[field]) &&
      rowData.status === "Modified"
    ) {
      return "flex w-full p-1 m-0 changed-cell border-1 border-yellow-700";
    }

    return "";
  };

  // const bodyTemplate = (field) => {
  //   return (rowData) => {
  //     return (
  //       <div
  //         style={{ height: "100%", width: "100%" }}
  //         className={cellClassName(rowData, field)}
  //       >
  //         {rowData[field]}
  //       </div>
  //     );
  //   };
  // };

  const bodyTemplate = (field) => {
    return (rowData) => {
      // Use custom body template if available
      if (customBodyTemplates[field]) {
        return (
          <div
            style={{ height: "100%", width: "100%" }}
            className={cellClassName(rowData, field)}
          >
            {customBodyTemplates[field](rowData)}
          </div>
        );
      }

      // Otherwise, use default rendering
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

  const filteredHeaderMap = useMemo(() => {
    if (!headerMap || dataWithStatus.length === 0) return {};

    return Object.entries(headerMap).reduce((acc, [key, label]) => {
      const hasValidValue = dataWithStatus.some(
        (row) => row[key] !== null && row[key] !== undefined && row[key] !== ""
      );
      if (hasValidValue) {
        acc[key] = label;
      }
      return acc;
    }, {});
  }, [headerMap, dataWithStatus]);

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
          <SecHeading
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
            />
            {filteredHeaderMap &&
              Object.keys(filteredHeaderMap).map((headerKey) => (
                <Column
                  field={headerKey}
                  header={filteredHeaderMap[headerKey]}
                  key={headerKey}
                  body={bodyTemplate(headerKey)}
                />
              ))}
          </DataTable>
        </div>
      </div>
    </Dialog>
  );
};

export default DataPreviewDialog;
