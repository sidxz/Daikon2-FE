import "./DataPreviewDialog.css";

import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { useMemo } from "react";
import SecHeading from "../SecHeading/SecHeading";

const StatCard = ({ title, value, icon }) => (
  <div className="p-3 border-1 border-200 border-round surface-card w-full">
    <div className="flex align-items-center justify-content-between mb-2">
      <span className="text-600 text-sm">{title}</span>
      {icon ? <i className={`pi ${icon}`} /> : null}
    </div>
    <div className="text-2xl font-semibold">{value}</div>
  </div>
);

const DataPreviewDialog = ({
  headerMap,
  data,
  existingData,
  visible,
  onHide,
  onSave,
  isSaving = false,
  comparatorKey = "id",
  comparatorFn = null, // optional: (row, existingRow) => boolean
  fieldFlatteners = {}, // optional: { fieldName: (arr) => string }
  customBodyTemplates = {}, // optional: { fieldName: (row) => ReactNode }
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
                const row = d._originalRow ? { ...d._originalRow } : { ...d };
                row.status = d.status;
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
    const safeExisting = Array.isArray(existingData) ? existingData : [];
    const safeData = Array.isArray(data) ? data : [];

    const isEmpty = (v) => v === null || v === undefined || v === "";

    return safeData.map((originalRow) => {
      const flattened = { ...originalRow };

      Object.entries(fieldFlatteners).forEach(([field, flattenFn]) => {
        if (field in originalRow && Array.isArray(originalRow[field])) {
          flattened[field] = flattenFn(originalRow[field]);
        }
      });

      flattened._originalRow = originalRow;

      let existingRow = null;
      if (comparatorFn) {
        existingRow = safeExisting.find(
          (d) =>
            d?.[comparatorKey] === originalRow?.[comparatorKey] ||
            comparatorFn(originalRow, d)
        );
      } else {
        existingRow = safeExisting.find(
          (d) => d?.[comparatorKey] === originalRow?.[comparatorKey]
        );
      }

      if (existingRow && isEmpty(flattened[comparatorKey])) {
        flattened[comparatorKey] = existingRow[comparatorKey];
      }

      let status = "";
      let className = "";

      if (!existingRow) {
        status = "New";
        className = "new-row";
      } else {
        for (const key of Object.keys(flattened)) {
          if (key === "_originalRow") continue;
          if (key === comparatorKey && isEmpty(originalRow[comparatorKey])) {
            continue;
          }

          const a = flattened[key];
          let b = existingRow[key];

          if (fieldFlatteners[key] && Array.isArray(b)) {
            b = fieldFlatteners[key](b);
          }

          if (
            (a === null || a === undefined || a === "") &&
            (b === null || b === undefined || b === "")
          ) {
            continue;
          }

          if (String(a) !== String(b)) {
            status = "Modified";
            break;
          }
        }

        if (!status) status = "Unchanged";
      }

      return { ...flattened, status, className };
    });
  }, [data, existingData, comparatorKey, comparatorFn, fieldFlatteners]);

  // ✅ simple stats for the top bar
  const stats = useMemo(() => {
    const rows = Array.isArray(dataWithStatus) ? dataWithStatus : [];
    const total = rows.length;
    const counts = rows.reduce(
      (acc, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1;
        return acc;
      },
      { New: 0, Modified: 0, Unchanged: 0 }
    );
    return {
      total,
      newCount: counts.New || 0,
      modifiedCount: counts.Modified || 0,
      unchangedCount: counts.Unchanged || 0,
    };
  }, [dataWithStatus]);

  const rowClassName = (rowData) => {
    return rowData.className ? { [rowData.className]: true } : {};
  };

  const cellClassName = (rowData, field) => {
    const isEmpty = (v) => v === null || v === undefined || v === "";

    const existingRow = Array.isArray(existingData)
      ? existingData.find(
          (d) =>
            d?.[comparatorKey] === rowData?.[comparatorKey] ||
            (comparatorFn ? comparatorFn(rowData, d) : false)
        )
      : null;

    if (!existingRow) return "";
    if (field === comparatorKey && isEmpty(rowData[comparatorKey])) return "";

    const a = rowData[field];
    const b = existingRow[field];

    if (rowData.status === "Modified" && String(a) !== String(b)) {
      return "flex w-full p-1 m-0 changed-cell border-1 border-yellow-700";
    }

    return "";
  };

  const bodyTemplate = (field) => {
    return (rowData) => {
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
      if (hasValidValue) acc[key] = label;
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
      <div className="flex flex-column gap-3">
        {/* Top stats bar */}
        <div className="grid">
          <div className="col-12 md:col-3">
            <StatCard title="Total" value={stats.total} icon="pi pi-database" />
          </div>
          <div className="col-6 md:col-3">
            <StatCard title="New" value={stats.newCount} icon="pi pi-plus" />
          </div>
          <div className="col-6 md:col-3">
            <StatCard
              title="Modified"
              value={stats.modifiedCount}
              icon="pi pi-pencil"
            />
          </div>
          <div className="col-6 md:col-3">
            <StatCard
              title="Unchanged"
              value={stats.unchangedCount}
              icon="pi pi-equals"
            />
          </div>
        </div>

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
