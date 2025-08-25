import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { Tag } from "primereact/tag";
import { useMemo } from "react";
import SecHeading from "../SecHeading/SecHeading";

/**
 * BulkDataPreviewDialog
 *
 * Props:
 * - visible: boolean
 * - onHide: () => void
 * - onProceed: (rowsToSave) => void        // gets rows with status !== "Unchanged"
 * - isProcessing?: boolean                 // disable buttons while server busy
 * - data: any[]                            // incoming rows
 * - existingData: any[]                    // existing rows to compare
 * - headerMap: Record<field, label>        // column name map for display
 * - comparatorKey?: string                 // defaults to "id"
 * - requiredFields?: string[]              // e.g., ["moleculeName", "smiles"]
 * - structureFields?: string[]             // e.g., ["smiles", "molblock"]
 * - fieldFlatteners?: Record<field, (arr:any[])=>string>  // optional, like your other dialog
 */
const BulkDataImportProgress = ({
  visible,
  onHide,
  onProceed,
  isProcessing = false,
  data = [],
  existingData = [],
  headerMap = {},
  comparatorKey = "id",
  requiredFields = [],
  structureFields = [],
  fieldFlatteners = {},
}) => {
  // Build dataWithStatus (New / Modified / Unchanged) without rendering a table.
  const dataWithStatus = useMemo(() => {
    const rows = Array.isArray(data) ? data : [];
    const existing = Array.isArray(existingData) ? existingData : [];

    return rows.map((originalRow) => {
      const flattened = { ...originalRow };

      // optional flatten of array fields (to stable strings)
      Object.entries(fieldFlatteners).forEach(([field, fn]) => {
        if (field in originalRow && Array.isArray(originalRow[field])) {
          flattened[field] = fn(originalRow[field]);
        }
      });

      const existingRow = existing.find(
        (d) => d?.[comparatorKey] === originalRow?.[comparatorKey]
      );

      let status = "";
      if (!existingRow) {
        status = "New";
      } else {
        // compare flattened vs existing (also flatten existing if needed)
        const keys = Object.keys(flattened);
        const isEmpty = (v) => v === null || v === undefined || v === "";
        let modified = false;

        for (const key of keys) {
          if (key === "_originalRow") continue;
          const a = flattened[key];
          let b = existingRow[key];
          if (fieldFlatteners[key] && Array.isArray(b)) {
            b = fieldFlatteners[key](b);
          }
          if (isEmpty(a) && isEmpty(b)) continue;
          if (String(a) !== String(b)) {
            modified = true;
            break;
          }
        }
        status = modified ? "Modified" : "Unchanged";
      }

      return { ...flattened, _originalRow: originalRow, status };
    });
  }, [data, existingData, comparatorKey, fieldFlatteners]);

  // Compute dashboard stats
  const stats = useMemo(() => {
    const rows = dataWithStatus;
    const total = rows.length;

    const counts = rows.reduce(
      (acc, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1;
        return acc;
      },
      { New: 0, Modified: 0, Unchanged: 0 }
    );

    const isEmpty = (v) => v === null || v === undefined || v === "";

    const invalidRows = rows.filter((r) =>
      requiredFields.some((f) => isEmpty(r[f]))
    );
    const invalidCount = invalidRows.length;

    const rowsWithStructures = rows.filter((r) =>
      structureFields.length
        ? structureFields.some((f) => !isEmpty(r[f]))
        : false
    ).length;

    const availableCols = headerMap
      ? Object.entries(headerMap)
          .filter(([k]) => rows.some((row) => !isEmpty(row[k])))
          .map(([key, label]) => ({ key, label }))
      : [];

    const rowsToSave = rows
      .filter((r) => r.status !== "Unchanged")
      .map((r) => {
        const base = r._originalRow ? { ...r._originalRow } : { ...r };
        base.status = r.status;
        return base;
      });

    return {
      total,
      newCount: counts.New || 0,
      modifiedCount: counts.Modified || 0,
      unchangedCount: counts.Unchanged || 0,
      invalidCount,
      rowsWithStructures,
      availableCols,
      rowsToSave,
    };
  }, [dataWithStatus, headerMap, requiredFields, structureFields]);

  const StatCard = ({ title, value, icon }) => (
    <div className="p-3 border-1 border-200 border-round surface-card w-full">
      <div className="flex align-items-center justify-content-between mb-2">
        <span className="text-600 text-sm">{title}</span>
        {icon ? <i className={`pi ${icon}`} /> : null}
      </div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );

  const footer = (
    <div className="flex justify-content-end w-full gap-2">
      <Button
        icon="pi pi-times"
        label="Cancel"
        className="p-button-text"
        disabled={isProcessing}
        onClick={onHide}
      />
      <Button
        icon="pi pi-upload"
        label="Proceed to Bulk Upload"
        loading={isProcessing}
        onClick={() => onProceed(stats.rowsToSave)}
        disabled={isProcessing || stats.total === 0}
      />
    </div>
  );

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      footer={footer}
      header={<div>Bulk Upload Summary</div>}
      maximizable
      className="w-9"
    >
      <div className="flex flex-column gap-3">
        <div className="flex">
          <SecHeading
            icon="icon icon-common icon-chart-bar"
            heading="Pre-Upload Dashboard"
            color="#8D99AE"
          />
        </div>

        <div className="grid">
          <div className="col-12 md:col-3">
            <StatCard
              title="Total Rows"
              value={stats.total}
              icon="pi-database"
            />
          </div>
          <div className="col-6 md:col-2">
            <StatCard title="New" value={stats.newCount} icon="pi-plus" />
          </div>
          <div className="col-6 md:col-2">
            <StatCard
              title="Modified"
              value={stats.modifiedCount}
              icon="pi-pencil"
            />
          </div>
          <div className="col-6 md:col-2">
            <StatCard
              title="Unchanged"
              value={stats.unchangedCount}
              icon="pi-equals"
            />
          </div>
          <div className="col-6 md:col-3">
            <StatCard
              title="Invalid Rows"
              value={stats.invalidCount}
              icon="pi-exclamation-triangle"
            />
          </div>
          <div className="col-6 md:col-3">
            <StatCard
              title="Rows w/ Structures"
              value={stats.rowsWithStructures}
              icon="pi-sitemap"
            />
          </div>
          <div className="col-6 md:col-3">
            <StatCard
              title="Columns Detected"
              value={stats.availableCols.length}
              icon="pi-table"
            />
          </div>
        </div>

        <Divider />

        <div className="flex flex-column gap-2">
          <div className="text-600 text-sm">Columns to Upload</div>
          <div className="flex flex-wrap gap-2">
            {stats.availableCols.length > 0 ? (
              stats.availableCols.map((c) => (
                <Tag key={c.key} value={c.label || c.key} />
              ))
            ) : (
              <span className="text-600">No non-empty columns detected.</span>
            )}
          </div>
        </div>

        {requiredFields?.length ? (
          <>
            <Divider />
            <div className="text-600 text-sm">
              Required fields: {requiredFields.join(", ")}
            </div>
            {stats.invalidCount > 0 ? (
              <div className="text-red-600 text-sm">
                {stats.invalidCount} row(s) missing at least one required field.
              </div>
            ) : (
              <div className="text-green-600 text-sm">
                All rows contain required fields.
              </div>
            )}
          </>
        ) : null}
      </div>
    </Dialog>
  );
};

export default BulkDataImportProgress;
