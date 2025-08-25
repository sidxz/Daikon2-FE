import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { ProgressBar } from "primereact/progressbar";
import { Tag } from "primereact/tag";
import { useMemo } from "react";
import SecHeading from "../SecHeading/SecHeading";

/**
 * BulkDataImportProgress
 *
 * Props:
 * - visible: boolean
 * - onHide: () => void
 * - onProceed: (rowsToSave) => void
 * - onCancel: () => void
 * - isUploading?: boolean
 * - bulkProgress?: { total, done, percent, failedCount, currentBatch, totalBatches, isCancelled?, lastError? }
 * - data: any[]
 * - existingData: any[]
 * - headerMap: Record<string,string>
 * - comparatorKey?: string
 * - comparatorFn?: (incomingRow, existingRow) => boolean
 * - requiredFields?: string[]
 * - structureFields?: string[]
 * - fieldFlatteners?: Record<string,(arr:any[])=>string>
 */
const BulkDataImportProgress = ({
  visible,
  onHide,
  onProceed,
  onCancel,
  isUploading = false,
  bulkProgress = {
    total: 0,
    done: 0,
    percent: 0,
    failedCount: 0,
    currentBatch: 0,
    totalBatches: 0,
    isCancelled: false,
    lastError: null,
  },
  data = [],
  existingData = [],
  headerMap = {},
  comparatorKey = "id",
  comparatorFn = null,
  requiredFields = [],
  structureFields = [],
  fieldFlatteners = {},
}) => {
  const isEmpty = (v) => v === null || v === undefined || v === "";

  // Build status-map for rows
  const dataWithStatus = useMemo(() => {
    const rows = Array.isArray(data) ? data : [];
    const existing = Array.isArray(existingData) ? existingData : [];

    return rows.map((originalRow) => {
      const flattened = { ...originalRow };

      // Apply flatteners to incoming arrays (so we compare like-for-like)
      Object.entries(fieldFlatteners).forEach(([field, fn]) => {
        if (field in originalRow && Array.isArray(originalRow[field])) {
          flattened[field] = fn(originalRow[field]);
        }
      });

      // Find existing row: prefer key match, or custom comparatorFn fallback
      let existingRow = null;
      if (comparatorFn) {
        existingRow = existing.find(
          (d) =>
            d?.[comparatorKey] === originalRow?.[comparatorKey] ||
            comparatorFn(originalRow, d)
        );
      } else {
        existingRow = existing.find(
          (d) => d?.[comparatorKey] === originalRow?.[comparatorKey]
        );
      }

      // If matched but uploaded row is missing comparatorKey, copy it
      // (Only copy when the source truly had it blank)
      if (existingRow && isEmpty(flattened[comparatorKey])) {
        flattened[comparatorKey] = existingRow[comparatorKey];
      }

      if (!existingRow)
        return { ...flattened, _originalRow: originalRow, status: "New" };

      const keys = Object.keys(flattened);
      let modified = false;

      for (const key of keys) {
        if (key === "_originalRow") continue;

        // Skip comparing the comparator field if it was missing in the upload
        if (key === comparatorKey && isEmpty(originalRow[comparatorKey])) {
          continue;
        }

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

      return {
        ...flattened,
        _originalRow: originalRow,
        status: modified ? "Modified" : "Unchanged",
      };
    });
  }, [data, existingData, comparatorKey, comparatorFn, fieldFlatteners]);

  // Dashboard stats
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
        // Note: if id was blank originally but matched, we copied it above only in the flattened.
        // If you want that id persisted into the outgoing row for saving, also copy it here:
        if (isEmpty(base[comparatorKey]) && !isEmpty(r[comparatorKey])) {
          base[comparatorKey] = r[comparatorKey];
        }
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
  }, [
    dataWithStatus,
    headerMap,
    requiredFields,
    structureFields,
    comparatorKey,
  ]);

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
      {isUploading ? (
        <Button
          icon="pi pi-stop"
          label="Stop after this batch"
          className="p-button-danger p-button-outlined"
          onClick={onCancel}
        />
      ) : (
        <>
          <Button
            icon="pi pi-times"
            label="Close"
            className="p-button-text"
            onClick={onHide}
          />
          <Button
            icon="pi pi-upload"
            label="Proceed to Bulk Upload"
            onClick={() => onProceed(stats.rowsToSave)}
            disabled={stats.total === 0}
          />
        </>
      )}
    </div>
  );

  const showProgress = isUploading || (bulkProgress?.percent ?? 0) > 0;

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

        {/* Stats */}
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

        {/* Column list */}
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

        {/* Required-field health */}
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

        {/* Progress hook-up */}
        {showProgress && (
          <>
            <Divider />
            <div className="flex flex-column gap-2">
              <div className="text-600 text-sm">Upload Progress</div>
              <ProgressBar value={bulkProgress.percent || 0} />
              <div className="text-sm">
                {bulkProgress.done}/{bulkProgress.total} items • Batch{" "}
                {Math.min(
                  bulkProgress.currentBatch || 0,
                  bulkProgress.totalBatches || 0
                )}{" "}
                of {bulkProgress.totalBatches || 0}
                {bulkProgress.failedCount
                  ? ` • Failed: ${bulkProgress.failedCount}`
                  : ""}
                {bulkProgress.isCancelled
                  ? " • Stopping after this batch…"
                  : ""}
              </div>
              {bulkProgress.lastError ? (
                <div className="text-xs text-red-600">
                  Last error: {String(bulkProgress.lastError)}
                </div>
              ) : null}
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
};

export default BulkDataImportProgress;
