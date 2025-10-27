// MRPreview.jsx
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { MultiSelect } from "primereact/multiselect";
import { ProgressBar } from "primereact/progressbar";
import { Tag } from "primereact/tag";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SmilesView from "../../../../Library/SmilesView/SmilesView";
import MolDbAPI from "../../api/MolDbAPI";

const CHUNK_SIZE = 500;

const keyOf = (r, idx) => r?.moleculeName ?? r?.__rid ?? idx;

// ---- CSV helpers (no deps) ----
const csvEscape = (v) => {
  if (v === null || v === undefined) return "";
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const rowsToCSV = (rows) => {
  const headers = ["moleculeName", "smiles", "validity", "errors"];
  const lines = [headers.join(",")];
  for (const r of rows) {
    const row = [
      csvEscape(r.moleculeName),
      csvEscape(r.smiles ?? ""),
      csvEscape(r.validity ?? ""),
      csvEscape(Array.isArray(r.errors) ? r.errors.join("; ") : r.errors ?? ""),
    ].join(",");
    lines.push(row);
  }
  // BOM for Excel-friendly UTF-8
  return "\ufeff" + lines.join("\n");
};
const downloadCSV = (filename, rows) => {
  const csv = rowsToCSV(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const MRPreview = ({ inputs = [], previewResults, setPreviewResults }) => {
  // Progress / status
  const [busy, setBusy] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const [apiError, setApiError] = useState(null);
  const [failedChunks, setFailedChunks] = useState(0);
  const [validatedCount, setValidatedCount] = useState(0);
  const [totalToValidate, setTotalToValidate] = useState(0);
  const [dupNames, setDupNames] = useState([]);

  // Filtering
  const [filters, setFilters] = useState({
    validity: { value: null, matchMode: "in" },
  });

  // Cancellation
  const abortRef = useRef(null);

  // --- duplicate check (client-side) ---
  useEffect(() => {
    if (!inputs?.length) {
      setDupNames([]);
      setPreviewResults?.([]);
      return;
    }
    const seen = new Set();
    const dupes = new Set();
    for (const r of inputs) {
      const name = r?.moleculeName?.toString().trim();
      if (!name) continue;
      if (seen.has(name)) dupes.add(name);
      else seen.add(name);
    }
    const dupList = Array.from(dupes);
    setDupNames(dupList);

    if (dupList.length) {
      const marked = inputs.map((r) =>
        dupList.includes(r?.moleculeName)
          ? { ...r, isValid: false, errors: ["Duplicate moleculeName"] }
          : r
      );
      setPreviewResults?.(marked);
    }
  }, [inputs, setPreviewResults]);

  // --- merge helper (by moleculeName; preserves input order) ---
  const mergeResults = useCallback(
    (chunkInput, chunkResp) => {
      const byNameInChunk = new Map(
        chunkInput.map((r, i) => [r?.moleculeName ?? i, r])
      );

      const rowUpdates = (chunkResp || []).map((r, i) => {
        const key = r?.moleculeName ?? i;
        const original = byNameInChunk.get(key) ?? chunkInput[i] ?? {};
        return { ...original, ...r };
      });

      setPreviewResults((prev = []) => {
        const map = new Map((prev || []).map((r, i) => [keyOf(r, i), r]));
        for (const upd of rowUpdates) {
          const k = keyOf(upd, 0);
          map.set(k, { ...(map.get(k) || {}), ...upd });
        }
        const orderKeys = (inputs || []).map((r, i) => keyOf(r, i));
        return orderKeys.map((k) => map.get(k)).filter(Boolean);
      });
    },
    [inputs, setPreviewResults]
  );

  const cancelValidation = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setBusy(false);
    setProgressMsg("Canceled.");
  };

  // --- SEQUENTIAL validation: one chunk at a time ---
  const validateSequential = useCallback(async () => {
    if (!inputs?.length) {
      setPreviewResults?.([]);
      return;
    }
    if (dupNames.length) return;

    // cancel any prior run
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setApiError(null);
    setFailedChunks(0);
    setBusy(true);
    setProgressPct(0);
    setProgressMsg("Preparing validation…");
    setValidatedCount(0);
    setTotalToValidate(inputs.length);

    // slice into chunks
    const chunks = [];
    for (let i = 0; i < inputs.length; i += CHUNK_SIZE) {
      chunks.push(inputs.slice(i, i + CHUNK_SIZE));
    }

    let completed = 0;

    try {
      for (let idx = 0; idx < chunks.length; idx++) {
        if (controller.signal.aborted) break;

        const chunk = chunks[idx];
        setProgressMsg(
          `Validating rows ${idx * CHUNK_SIZE + 1}-${Math.min(
            (idx + 1) * CHUNK_SIZE,
            inputs.length
          )}…`
        );

        try {
          const resp = await MolDbAPI.registerMoleculePreview(chunk, {
            signal: controller.signal,
          });
          mergeResults(chunk, resp || []);
        } catch (err) {
          if (controller.signal.aborted) break;
          console.error("Chunk failed:", err);
          setFailedChunks((c) => c + 1);
          setApiError((p) => p || "One or more chunks failed");

          // mark entire chunk as failed
          const failedResp = chunk.map((r) => ({
            moleculeName: r?.moleculeName,
            isValid: false,
            errors: ["invalid-failed-chunk"],
          }));
          mergeResults(chunk, failedResp);
        } finally {
          completed += chunk.length;
          setValidatedCount(completed);
          setProgressPct(Math.round((completed / inputs.length) * 100));
        }
      }

      if (!controller.signal.aborted) {
        setProgressMsg("Validation complete.");
      }
    } finally {
      if (!controller.signal.aborted) setBusy(false);
    }
  }, [inputs, dupNames.length, mergeResults, setPreviewResults]);

  // auto-run when inputs change
  useEffect(() => {
    if (!inputs?.length) return;
    if (!dupNames.length) validateSequential();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [inputs, dupNames.length, validateSequential]);

  // derive validity label for filtering
  const dataWithValidity = useMemo(() => {
    const toLabel = (row) => {
      if (row?.isValid) return "OK";
      const errs = row?.errors || [];
      return errs.includes("invalid-failed-chunk") ? "Failed Chunk" : "Error";
    };
    return (previewResults || []).map((r) => ({ ...r, validity: toLabel(r) }));
  }, [previewResults]);

  const stats = useMemo(() => {
    const total = dataWithValidity.length || 0;
    const ok = dataWithValidity.filter((r) => r.validity === "OK").length;
    const failed = dataWithValidity.filter(
      (r) => r.validity === "Failed Chunk"
    ).length;
    const err = total - ok - failed;
    return { total, ok, err, failed };
  }, [dataWithValidity]);

  const validityOptions = [
    { label: "OK", value: "OK" },
    { label: "Error", value: "Error" },
    { label: "Failed Chunk", value: "Failed Chunk" },
  ];

  const ValidityBody = (row) => {
    const v = row?.validity;
    if (v === "OK") return <Tag severity="info" value="OK" />;
    if (v === "Failed Chunk")
      return <Tag severity="warning" value="Failed Chunk" />;
    return <Tag severity="danger" value="Error" />;
  };

  const StructureBody = (row) => (
    <div className="flex flex-column" style={{ width: 250, height: 290 }}>
      <div className="flex w-full h-full">
        <SmilesView
          smiles={row?.smiles || row?.requestedSMILES}
          width={250}
          height={270}
        />
      </div>
    </div>
  );

  // show progress while busy OR incomplete
  const showProgress =
    busy || (validatedCount > 0 && validatedCount < totalToValidate);

  // ---- Export handlers ----
  const exportAll = useCallback(() => {
    const filename = `register-preview_${new Date()
      .toISOString()
      .replace(/[:.]/g, "-")}.csv`;
    downloadCSV(filename, dataWithValidity);
  }, [dataWithValidity]);

  const exportIssues = useCallback(() => {
    const onlyIssues = dataWithValidity.filter((r) => r.validity !== "OK");
    const filename = `register-preview_issues_${new Date()
      .toISOString()
      .replace(/[:.]/g, "-")}.csv`;
    downloadCSV(filename, onlyIssues);
  }, [dataWithValidity]);

  const tableHeader = (
    <div
      className="flex flex-column gap-2 w-full"
      style={{ position: "sticky", top: 0, zIndex: 2 }}
    >
      <div className="flex justify-content-between align-items-center flex-wrap gap-2">
        <div className="flex align-items-center gap-2 flex-wrap">
          <Tag value={`Total: ${stats.total}`} />
          <Tag severity="success" value={`OK: ${stats.ok}`} />
          <Tag severity="danger" value={`Errors: ${stats.err}`} />
          <Tag severity="warning" value={`Failed Chunks: ${stats.failed}`} />
          {failedChunks > 0 && (
            <Tag severity="warning" value={`Ignored chunks: ${failedChunks}`} />
          )}
          {apiError && (
            <Tag severity="warning" value={`Warning: ${apiError}`} />
          )}
          {dupNames.length > 0 && (
            <Tag
              severity="warning"
              value={`Duplicate names (${dupNames.length}) — fix in Input step`}
            />
          )}
        </div>

        <div className="flex align-items-center gap-2">
          <Button
            label="Download All (CSV)"
            icon="pi pi-download"
            size="small"
            onClick={exportAll}
          />
          <Button
            label="Download Issues (CSV)"
            icon="pi pi-download"
            severity="warning"
            size="small"
            onClick={exportIssues}
            disabled={stats.err + stats.failed === 0}
          />
          <Button
            label="Revalidate"
            icon="pi pi-refresh"
            outlined
            size="small"
            onClick={validateSequential}
            disabled={busy || !inputs?.length || dupNames.length > 0}
          />
          <Button
            label="Cancel"
            icon="pi pi-times"
            severity="danger"
            size="small"
            onClick={cancelValidation}
            disabled={!busy}
          />
        </div>
      </div>

      <div
        style={{
          opacity: showProgress ? 1 : 0,
          transition: "opacity .2s ease",
        }}
      >
        <ProgressBar value={progressPct} />
        <div className="text-sm mt-1">
          {progressMsg} — {validatedCount.toLocaleString()} /{" "}
          {totalToValidate.toLocaleString()}
        </div>
      </div>
    </div>
  );

  const validityFilterElement = (
    <MultiSelect
      value={filters?.validity?.value || null}
      options={validityOptions}
      onChange={(e) =>
        setFilters((f) => ({
          ...f,
          validity: { ...f.validity, value: e.value },
        }))
      }
      placeholder="Filter"
      display="chip"
      className="p-column-filter"
      maxSelectedLabels={1}
      showClear
    />
  );

  return (
    <div className="flex flex-column gap-2 w-full">
      <div className="flex flex-column w-full gap-1">
        <div className="flex w-full">
          <p className="text-2xl p-0 m-0">Registration Data Preview</p>
        </div>
        <div className="flex w-full">
          <p className="text-md p-0 m-0">
            This table validates your input. Only rows marked <b>OK</b> will be
            submitted for registration.
          </p>
        </div>
      </div>

      <div className="flex w-full border-1 border-50 border-round surface-ground">
        <DataTable
          value={dataWithValidity}
          dataKey="moleculeName"
          className="w-full h-full"
          tableStyle={{ minWidth: "100rem" }}
          header={tableHeader}
          scrollable
          scrollHeight="70vh"
          paginator
          rows={100}
          rowsPerPageOptions={[50, 100, 250, 500]}
          filterDisplay="row"
          filters={filters}
          onFilter={(e) => setFilters(e.filters)}
          loading={busy}
        >
          <Column header="#" body={(data, opts) => (opts.rowIndex ?? 0) + 1} />
          <Column header="Structure" body={StructureBody} />
          <Column
            field="moleculeName"
            header="Name"
            body={(r) => (
              <span title="Merge key: moleculeName">{r?.moleculeName}</span>
            )}
            style={{ minWidth: "14rem" }}
          />
          <Column
            field="smiles"
            header="SMILES"
            className="flex-wrap text-wrap white-space-normal"
          />
          <Column
            field="validity"
            header="Validity"
            body={ValidityBody}
            filter
            filterField="validity"
            showFilterMenu={false}
            filterElement={validityFilterElement}
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="errors"
            header="Errors"
            body={(row) =>
              Array.isArray(row?.errors) && row.errors.length
                ? row.errors.join(", ")
                : "No Errors"
            }
            className="flex-wrap text-wrap white-space-normal"
            style={{ wordWrap: "break-word" }}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default observer(MRPreview);
