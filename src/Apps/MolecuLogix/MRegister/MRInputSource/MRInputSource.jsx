import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { ProgressBar } from "primereact/progressbar";

import { useContext, useMemo, useRef, useState } from "react";
import SmilesView from "../../../../Library/SmilesView/SmilesView";
import { RootStoreContext } from "../../../../RootStore";
import ImportFromExcel from "../../../../Shared/Excel/ImportFromExcel";
import InputOrgAlias from "../../../../Shared/InputEditors/InputOrgAlias";
import InputScientist from "../../../../Shared/InputEditors/InputScientist";
import { AppOrgResolver } from "../../../../Shared/VariableResolvers/AppOrgResolver";
import { DtFieldsToExcelColumnMapping } from "../MRConstants";

const CHUNK_SIZE = 1000; // tune: 500–2000 works well in browsers

const MRInputSource = ({ onDataReady }) => {
  const [dataProcessed, setDataProcessed] = useState([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0); // 0–100
  const [progressMsg, setProgressMsg] = useState("");
  const [totalRows, setTotalRows] = useState(0);

  const rootStore = useContext(RootStoreContext);
  const { user } = rootStore.authStore;
  const { fuzzyMatchOrgByName, getOrgAliasById } = AppOrgResolver();
  const tableRef = useRef();

  const [metaDataScientist] = useState(
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim()
  );
  const [metaDataOrgID] = useState(user?.appOrgId || "");

  const normalize = (s) => (s ?? "").toString().trim();

  // ---------- Column Editors ----------
  const textEditor = (options) => (
    <InputText
      className="w-full"
      value={options.value ?? ""}
      onChange={(e) => options.editorCallback(e.target.value)}
    />
  );

  const scientistEditor = (options) => (
    <InputScientist
      id={`scientist-editor-${options?.rowIndex ?? 0}`}
      value={options.value}
      onChange={(e) => options.editorCallback(e.value)}
      placeholder="Select Scientist"
    />
  );

  const textareaEditor = (options) => (
    <InputTextarea
      className="w-full"
      rows={3}
      autoResize
      value={options.value ?? ""}
      onChange={(e) => options.editorCallback(e.target.value)}
    />
  );

  const orgEditor = (options) => (
    <InputOrgAlias
      id={`org-editor-${options?.rowIndex ?? 0}`}
      value={options.value}
      onChange={(e) => options.editorCallback(e.value)}
      placeholder="Select Org"
    />
  );

  const stageEditor = (options) => (
    <Dropdown
      options={[
        { label: "Screening", value: "Screening" },
        { label: "Hit Assessment (HA)", value: "HA" },
        { label: "Hit to Lead (H2L)", value: "H2L" },
        { label: "Lead Optimization (LO)", value: "LO" },
        { label: "Selection Phase (SP)", value: "SP" },
        { label: "Investigational New Drug (IND)", value: "IND" },
        { label: "Phase 1 (P1)", value: "P1" },
      ]}
      optionLabel="label"
      optionValue="value"
      placeholder="Select Stage"
      id={`stage-editor-${options?.rowIndex ?? 0}`}
      value={options.value}
      onChange={(e) => options.editorCallback(e.value)}
    />
  );

  // ---------- Non-editing cell bodies ----------
  const structureBody = (rowData) => (
    <div className="flex flex-column" style={{ width: 250, height: 290 }}>
      <div className="flex w-full h-full">
        <SmilesView smiles={rowData?.smiles} width={250} height={270} />
      </div>
    </div>
  );

  // ---------- Row edit commit ----------
  const onRowEditComplete = (e) => {
    const { newData } = e;
    setDataProcessed((prev) => {
      const idx = prev.findIndex((r) => r.__rid === newData.__rid);
      if (idx === -1) return prev;
      const next = [...prev];
      next[idx] = newData;
      onDataReady?.(next);
      return next;
    });
  };

  // ---------- Chunk helpers ----------
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const enrichRow = (r) => {
    const row = { ...r };
    if (!normalize(row.disclosureScientist))
      row.disclosureScientist = metaDataScientist;

    if (normalize(row.disclosureOrg)) {
      const res = fuzzyMatchOrgByName(row.disclosureOrg);
      if (res?.id) row.orgId = res.id;
    }
    if (!normalize(row.orgId)) row.orgId = metaDataOrgID;

    return row;
  };

  const processInChunks = async (rows) => {
    setBusy(true);
    setProgress(0);
    setProgressMsg("Preparing data…");
    setTotalRows(rows.length);

    const cleaned = [];
    const total = rows.length;

    // filter first in one pass (fast)
    const filtered = rows.filter((r) => normalize(r.moleculeName));

    for (let i = 0; i < filtered.length; i += CHUNK_SIZE) {
      const chunk = filtered.slice(i, i + CHUNK_SIZE);

      // enrich chunk
      const enriched = chunk.map(enrichRow);
      cleaned.push(...enriched);

      // let the browser paint (prevents freeze)
      await sleep(0);

      const pct = Math.round(((i + chunk.length) / total) * 100);
      setProgress(pct);
      setProgressMsg(
        `Processed ${Math.min(i + chunk.length, total)} of ${total} rows`
      );
    }

    // assign __rid sequentially
    let rid = 0;
    const withIds = cleaned.map((row) => ({ __rid: ++rid, ...row }));

    setProgressMsg("Finalizing…");
    setDataProcessed(withIds);
    onDataReady?.(withIds);
    setBusy(false);
  };

  // ---------- File import & row prep ----------
  const handleUpload = async (e) => {
    const file = e.files?.[0];
    if (!file) return;

    setBusy(true);
    setProgress(0);
    setProgressMsg("Reading Excel…");

    try {
      // If your ImportFromExcel supports progress, pass a callback.
      const raw = await ImportFromExcel({
        file,
        headerMap: DtFieldsToExcelColumnMapping,
        onProgress: (pct, msg) => {
          setProgress(Math.max(1, Math.min(99, Math.floor(pct))));
          if (msg) setProgressMsg(msg);
        },
      });

      // clear selected file in UI
      e.files = null;
      e.options?.clear?.();

      // Now chunked enrich to avoid blocking
      await processInChunks(raw);
    } catch (err) {
      console.error(err);
      setBusy(false);
    }
  };

  // ---------- DataTable perf knobs ----------
  const totalRecords = dataProcessed.length;
  const rowsPerPage = 100; // UX sweet spot
  const itemSize = 72; // row height for virtual scroller (tune if needed)

  const header = useMemo(
    () => (
      <div className="flex justify-content-between align-items-center w-full">
        <span className="text-sm text-color-secondary">
          {totalRecords.toLocaleString()} rows loaded
        </span>
      </div>
    ),
    [totalRecords]
  );

  return (
    <div className="flex flex-column w-full h-full">
      {/* Progress dialog */}
      <Dialog
        header="Processing Excel"
        visible={busy}
        closable={false}
        modal
        style={{ width: "32rem", maxWidth: "90vw" }}
      >
        <div className="flex flex-column gap-3">
          <ProgressBar value={progress}></ProgressBar>
          <div className="text-sm">{progressMsg}</div>
          {totalRows > 0 && (
            <div className="text-xs text-color-secondary">
              Tip: you can keep this tab in the background while we process.
            </div>
          )}
        </div>
      </Dialog>

      <div className="flex flex-column w-full h-full">
        <FileUpload
          name="excelFile"
          accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          maxFileSize={50_000_000} // bump for big files if needed
          mode="basic"
          chooseLabel="Browse and Select File"
          chooseOptions={{
            icon: "icon icon-common icon-plus-circle",
            className: "p-button-text p-button-md",
          }}
          className="p-button-text p-button-secondary"
          customUpload
          uploadHandler={handleUpload}
          auto
        />
      </div>

      <div className="flex flex-column w-full h-full">
        <DataTable
          ref={tableRef}
          value={dataProcessed}
          dataKey="__rid"
          className="w-full h-full"
          header={header}
          editMode="row"
          onRowEditComplete={onRowEditComplete}
          scrollable
          scrollHeight="70vh"
          paginator
          rows={rowsPerPage}
          rowsPerPageOptions={[50, 100, 250, 500]}
          // virtualScrollerOptions={{ itemSize, autoSize: true }}
        >
          <Column header="#" body={(data, options) => options.rowIndex + 1} />
          <Column field="smiles" header="Structure" body={structureBody} />
          <Column
            field="moleculeName"
            header="Molecule Name"
            style={{ minWidth: "14rem" }}
          />
          <Column
            field="disclosureScientist"
            header="Disclosure Scientist"
            editor={scientistEditor}
          />
          <Column
            field="orgId"
            header="Disclosure Org"
            body={(row) => getOrgAliasById(row.orgId)}
            editor={orgEditor}
          />
          <Column
            field="disclosureStage"
            header="Disclosure Stage"
            editor={stageEditor}
          />
          <Column
            field="disclosureReason"
            header="Disclosure Reason"
            editor={textareaEditor}
          />
          <Column
            field="disclosureNotes"
            header="Disclosure Notes"
            editor={textareaEditor}
          />
          <Column
            field="literatureReferences"
            header="Literature References"
            editor={textareaEditor}
          />
          <Column
            rowEditor
            header="Edit"
            headerStyle={{ width: "8rem" }}
            bodyStyle={{ textAlign: "center" }}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default MRInputSource;
