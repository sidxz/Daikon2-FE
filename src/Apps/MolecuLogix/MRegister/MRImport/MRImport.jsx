// src/features/Molecule/components/MRegister/MRImport/MRImport.jsx
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { ProgressBar } from "primereact/progressbar";
import { Tag } from "primereact/tag";
import { useCallback, useContext, useMemo, useRef, useState } from "react";
import { RootStoreContext } from "../../../../RootStore";

const CHUNK_SIZE = 500;

// CSV helpers
const csvEscape = (v) => {
  if (v === null || v === undefined) return "";
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const rowsToCSV = (rows) => {
  const headers = ["moleculeName", "status", "message", "registrationId"];
  const lines = [headers.join(",")];
  for (const r of rows) {
    const row = [
      csvEscape(r.moleculeName),
      csvEscape(r.__status || ""),
      csvEscape(r.__message || ""),
      csvEscape(r.registrationId || ""),
    ].join(",");
    lines.push(row);
  }
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

const toGuidOrOmit = (v) => {
  const s = (v ?? "").toString().trim();
  if (!s) return undefined; // omit -> server gets Guid.Empty
  return s;
};

// Map a full input row → server command (NO client-side ids!)
const mapToRegisterCommand = (row) => {
  const cmd = {
    // id: (omit)
    // registrationId: (omit)
    name: row.moleculeName ?? row.name ?? "",
    smiles: row.smiles ?? row.SMILES ?? "",
    synonyms: row.synonyms ?? "",
    disclosureStage: row.disclosureStage ?? "",
    disclosureScientist: row.disclosureScientist ?? "",
    disclosureOrgId: toGuidOrOmit(row.orgId ?? row.disclosureOrgId),
    disclosureReason: row.disclosureReason ?? "",
    disclosureNotes: row.disclosureNotes ?? "",
    literatureReferences: row.literatureReferences ?? "",
    // structureDisclosedDate: row.structureDisclosedDate ?? undefined,
  };
  return cmd;
};

const MRImport = ({ inputs = [], previewResults = [] }) => {
  const root = useContext(RootStoreContext);
  const { moleculeStore } = root;

  const [importing, setImporting] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const [importError, setImportError] = useState(null);
  const [summary, setSummary] = useState({ total: 0, success: 0, failed: 0 });
  const [importRows, setImportRows] = useState([]);

  const abortRef = useRef(null);

  // Valid names from preview
  const okNames = useMemo(
    () =>
      (previewResults || [])
        .filter((r) => r?.isValid)
        .map((r) => r.moleculeName),
    [previewResults]
  );

  // Full payload rows from inputs by moleculeName
  const rowsToImport = useMemo(() => {
    if (!inputs?.length || !okNames?.length) return [];
    const byName = new Map(inputs.map((r) => [r?.moleculeName, r]));
    return okNames.map((name) => byName.get(name)).filter(Boolean);
  }, [inputs, okNames]);

  const disabled = !rowsToImport.length;

  const handleCancel = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setImporting(false);
    setProgressMsg("Canceled.");
  };

  const handleDownload = (type) => {
    const now = new Date().toISOString().replace(/[:.]/g, "-");
    if (type === "all") {
      downloadCSV(`register-import_${now}.csv`, importRows);
    } else {
      downloadCSV(
        `register-import_failures_${now}.csv`,
        importRows.filter(
          (r) => r.__status !== "SUCCESS" && r.__status !== "ALREADY_REGISTERED"
        )
      );
    }
  };

  // Sequential batch import using MoleculeStore
  const handleImport = useCallback(async () => {
    if (!rowsToImport.length) return;

    setImportError(null);
    setImportRows([]);
    setSummary({ total: rowsToImport.length, success: 0, failed: 0 });
    setProgressPct(0);
    setProgressMsg("Preparing import…");
    setImporting(true);

    // Build commands (no ids/registrationId)
    const allCommands = rowsToImport.map(mapToRegisterCommand);

    // Cancel support
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // Chunk
    const chunks = [];
    for (let i = 0; i < allCommands.length; i += CHUNK_SIZE) {
      chunks.push(allCommands.slice(i, i + CHUNK_SIZE));
    }

    let completed = 0;
    let success = 0;
    let failed = 0;

    try {
      for (let idx = 0; idx < chunks.length; idx++) {
        if (controller.signal.aborted) break;

        const chunk = chunks[idx];
        setProgressMsg(
          `Importing rows ${idx * CHUNK_SIZE + 1}-${Math.min(
            (idx + 1) * CHUNK_SIZE,
            allCommands.length
          )}…`
        );

        try {
          // NOTE: MoleculeStore -> API client posts { commands } per your current frontend.
          const resp = await moleculeStore.registerMoleculeBatch(chunk, {
            signal: controller.signal,
          });

          // Normalize using response; correlate by Name (server also returns RegistrationId we can log)
          const normalized = (resp || []).map((r) => ({
            moleculeName: r?.name ?? "", // correlation by unique name
            registrationId: r?.registrationId ?? "", // server-generated
            __status: r?.wasAlreadyRegistered
              ? "ALREADY_REGISTERED"
              : "SUCCESS",
            __message: "",
          }));

          success += normalized.filter(
            (x) =>
              x.__status === "SUCCESS" || x.__status === "ALREADY_REGISTERED"
          ).length;
          setImportRows((prev) => [...prev, ...normalized]);
        } catch (err) {
          if (controller.signal.aborted) break;

          // Entire chunk failed — mark each row as failed (correlate by name we sent)
          const failedRows = chunk.map((c) => ({
            moleculeName: c.name,
            registrationId: "",
            __status: "FAILED",
            __message: "import-failed-chunk",
          }));
          failed += failedRows.length;
          setImportRows((prev) => [...prev, ...failedRows]);

          setImportError(
            (p) => p || (err?.message ?? "One or more chunks failed")
          );
          console.error("Import chunk failed:", err);
        } finally {
          completed += chunk.length;
          setSummary({ total: allCommands.length, success, failed });
          setProgressPct(Math.round((completed / allCommands.length) * 100));
        }
      }

      if (!controller.signal.aborted) {
        setProgressMsg("Import complete.");
      }
    } finally {
      if (!controller.signal.aborted) setImporting(false);
    }
  }, [rowsToImport, moleculeStore]);

  return (
    <div className="flex flex-column gap-3">
      <div className="flex justify-content-between align-items-center flex-wrap gap-2">
        <div className="flex align-items-center gap-2 flex-wrap">
          <Tag value={`Ready: ${rowsToImport.length}`} />
          <Tag severity="success" value={`Imported: ${summary.success}`} />
          <Tag severity="danger" value={`Failed: ${summary.failed}`} />
          {importError && (
            <Tag severity="warning" value={`Warning: ${importError}`} />
          )}
        </div>

        <div className="flex gap-2">
          <Button
            label="Import OK Rows"
            icon="pi pi-cloud-upload"
            onClick={handleImport}
            disabled={disabled || importing}
          />
          <Button
            label="Cancel"
            icon="pi pi-times"
            severity="danger"
            onClick={handleCancel}
            disabled={!importing}
          />
          <Button
            label="Download Results (CSV)"
            icon="pi pi-download"
            outlined
            onClick={() =>
              downloadCSV(
                `register-import_${new Date()
                  .toISOString()
                  .replace(/[:.]/g, "-")}.csv`,
                importRows
              )
            }
            disabled={!importRows.length}
          />
          <Button
            label="Download Failures (CSV)"
            icon="pi pi-download"
            severity="warning"
            outlined
            onClick={() =>
              downloadCSV(
                `register-import_failures_${new Date()
                  .toISOString()
                  .replace(/[:.]/g, "-")}.csv`,
                importRows.filter(
                  (r) =>
                    r.__status !== "SUCCESS" &&
                    r.__status !== "ALREADY_REGISTERED"
                )
              )
            }
            disabled={
              !importRows.some(
                (r) =>
                  r.__status !== "SUCCESS" &&
                  r.__status !== "ALREADY_REGISTERED"
              )
            }
          />
        </div>
      </div>

      <div
        style={{
          opacity: importing || summary.success + summary.failed > 0 ? 1 : 0,
          transition: "opacity .2s ease",
        }}
      >
        <ProgressBar value={progressPct} />
        <div className="text-sm mt-1">
          {progressMsg} — {(summary.success + summary.failed).toLocaleString()}{" "}
          / {summary.total.toLocaleString()}
        </div>
      </div>

      <div className="text-color-secondary text-sm">
        Import matches by <b>moleculeName</b> and omits any client-generated
        IDs; the server assigns <code>Id</code> and <code>RegistrationId</code>.
        Returned <code>registrationId</code> is captured in the CSV.
      </div>
    </div>
  );
};

export default observer(MRImport);
