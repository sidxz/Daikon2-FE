import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import { InputTextarea } from "primereact/inputtextarea";
import { ProgressBar } from "primereact/progressbar";

import { observer } from "mobx-react-lite";
import { Message } from "primereact/message";
import { MeterGroup } from "primereact/metergroup";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import SmilesView from "../../../../Library/SmilesView/SmilesView";
import { RootStoreContext } from "../../../../RootStore";
import ImportFromExcel from "../../../../Shared/Excel/ImportFromExcel";
import InputOrgAlias from "../../../../Shared/InputEditors/InputOrgAlias";
import InputScientist from "../../../../Shared/InputEditors/InputScientist";
import SmilesJsmeRowEditor from "../../../../Shared/TableRowEditors/SmilesJsmeRowEditor";
import { AppOrgResolver } from "../../../../Shared/VariableResolvers/AppOrgResolver";
import {
  dedupeByName,
  enrichRowFactory,
  normalize,
  processInChunks,
} from "../helpers/MLRStep1Helper";
import { DtFieldsToExcelColumnMapping } from "../MLogixRegistrationConstants";

const CHUNK_SIZE = 1000; // tune: 500–2000 works well in browsers

const MLRegistrationStep1 = ({
  onDataReady,
  initialRows = [],
  autoApplyInitialRows = false,
}) => {
  const [dataProcessed, setDataProcessed] = useState([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0); // 0–100
  const [progressMsg, setProgressMsg] = useState("");
  const [totalRows, setTotalRows] = useState(0);
  const [initialRowsInExcel, setInitialRowsInExcel] = useState(0);

  const [editingRows, setEditingRows] = useState({});
  const autoEditSingleRowRef = useRef(false);

  const rootStore = useContext(RootStoreContext);
  const { user } = rootStore.authStore;
  const { fuzzyMatchOrgByName, getOrgAliasById } = AppOrgResolver();
  const tableRef = useRef();

  const [metaDataScientist] = useState(
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
  );
  const [metaDataOrgID] = useState(user?.appOrgId || "");

  const enrichRow = useMemo(
    () =>
      enrichRowFactory({
        metaDataScientist,
        metaDataOrgID,
        fuzzyMatchOrgByName,
      }),
    [metaDataScientist, metaDataOrgID, fuzzyMatchOrgByName],
  );

  const seedKey = useMemo(
    () => (initialRows?.length ? JSON.stringify(initialRows) : ""),
    [initialRows],
  );
  console.log("seedKey", seedKey);
  const seededRef = useRef(new Set());

  const hasOpenEditors = useMemo(
    () => Object.keys(editingRows || {}).length > 0,
    [editingRows],
  );

  useEffect(() => {
    if (!autoApplyInitialRows || !initialRows?.length) return;
    if (seededRef.current.has(seedKey)) return;
    console.log("Seeding initial rows into MLR Step 1", initialRows);

    seededRef.current.add(seedKey);

    console.log("auto-applying initial rows to MLR Step 1");
    console.log("seedKey", seedKey);

    // Only seed if dataProcessed is empty (so we don't overwrite user-imported data)
    setDataProcessed((prev) => {
      if (prev.length > 0) return prev;

      const seeded = initialRows.map((r) => {
        // IMPORTANT: normalize only strings, not the row object
        const row = {
          ...r,
          name: (r?.name ?? "").trim(),
          smiles: normalize(r?.smiles ?? ""), // normalize SMILES string
        };

        return enrichRow(row); // enrichRow should preserve existing fields via {...row, ...meta}
      });

      onDataReady?.(seeded);
      return seeded;
    });
  }, [autoApplyInitialRows, initialRows, seedKey, enrichRow, onDataReady]);

  // Auto open editor if there is only one row
  useEffect(() => {
    // Only auto-edit once
    if (autoEditSingleRowRef.current) return;
    console.log("Checking for auto-edit single row...");

    if (dataProcessed.length === 1) {
      console.log("Auto-editing single row...");
      const row = dataProcessed[0];

      if (row?.name) {
        setEditingRows({ [row.name]: true });
        autoEditSingleRowRef.current = true;
      }
    }
  }, [dataProcessed]);

  console.log("dataProcessed", dataProcessed);

  // ---------- Column Editors ----------
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

  const smilesEditor = (options) => <SmilesJsmeRowEditor options={options} />;

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
      const key = (newData?.name ?? "").trim();
      if (!key) return prev;

      const idx = prev.findIndex((r) => (r?.name ?? "").trim() === key);
      if (idx === -1) return prev;

      const next = [...prev];
      next[idx] = newData;
      onDataReady?.(next);
      return next;
    });
  };

  // ---------- File import & row prep ----------
  const handleUpload = async (e) => {
    const file = e.files?.[0];
    if (!file) return;

    setBusy(true);
    setProgress(0);
    setProgressMsg("Reading Excel…");

    try {
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

      const deduped = dedupeByName(raw);

      setInitialRowsInExcel(raw.length);
      setProgressMsg(
        `Removed ${raw.length - deduped.length} duplicate rows by name`,
      );

      await processInChunks({
        rows: deduped,
        chunkSize: CHUNK_SIZE,
        normalizeFn: normalize,
        enrichRow,
        setBusy,
        setProgress,
        setProgressMsg,
        setTotalRows,
        setDataProcessed,
        onDataReady,
      });
    } catch (err) {
      console.error(err);
      setBusy(false);
    }
  };

  // ---------- DataTable perf knobs ----------
  const totalRecords = dataProcessed.length;
  const rowsWithStructure = dataProcessed.filter((r) =>
    normalize(r.smiles),
  ).length;
  const rowsWithoutStructure = totalRecords - rowsWithStructure;
  const rowsPerPage = 100; // UX sweet spot

  const header = useMemo(
    () => (
      <div className="w-full flex gap-3 bg-surface-50 border-round-lg">
        {/* Initial Rows */}

        <div className="flex align-items-center gap-2 px-3 py-2 border-round-md bg-white">
          <i className="pi pi-file-excel text-green-600 text-xl" />
          <div className="flex flex-column">
            <span className="text-500 text-xs uppercase tracking-wide">
              Rows in Excel
            </span>
            <span className="text-900 font-semibold text-lg">
              {initialRowsInExcel}
            </span>
          </div>
        </div>

        {/* Total Records */}
        <div className="flex align-items-center gap-2 px-3 py-2 border-round-md bg-white">
          <i className="pi pi-database text-primary text-xl" />
          <div className="flex flex-column">
            <span className="text-500 text-xs uppercase tracking-wide">
              Valid Rows
            </span>
            <span className="text-900 font-semibold text-lg">
              {totalRecords}
            </span>
          </div>
        </div>

        {/* Meter Group */}
        <div className="flex-grow min-w-20rem px-3 py-2 border-round-md bg-white">
          <div className="flex align-items-center justify-content-between mb-2">
            <span className="text-500 text-xs uppercase tracking-wide">
              Structure Coverage
            </span>
            <i className="pi pi-chart-bar text-400" />
          </div>

          <MeterGroup
            className="w-full"
            values={[
              {
                label: "With Structure",
                value: (rowsWithStructure / (totalRecords || 1)) * 100,
                color: "var(--green-500)",
              },
              {
                label: "Without Structure",
                value: (rowsWithoutStructure / (totalRecords || 1)) * 100,
                color: "var(--blue-500)",
              },
            ]}
          />
        </div>
      </div>
    ),
    [totalRecords],
  );

  return (
    <div className="flex flex-column w-full h-full">
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

      <div className="flex flex w-full h-full bg-blue-50 justify-content-end">
        <div className="flex w-auto">
          {hasOpenEditors && (
            <Message
              severity="error"
              text="You have unsaved changes in the table. Please save or discard them using the options in the row before proceeding."
            />
          )}
        </div>
        <div className="flex w-auto">
          <FileUpload
            name="excelFile"
            accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            maxFileSize={50_000_000}
            mode="basic"
            chooseLabel="Select Excel File to Import"
            chooseOptions={{
              icon: "icon icon-common icon-plus-circle",
              className: "m-1 p-button p-button-primary",
            }}
            className="p-button-text p-button-secondary align-self-end mr-1"
            customUpload
            uploadHandler={handleUpload}
            auto
          />
        </div>
      </div>

      <div className="flex flex-column w-full h-full">
        <DataTable
          stripedRows
          ref={tableRef}
          value={dataProcessed}
          dataKey="name"
          className="w-full h-full"
          header={header}
          editMode="row"
          editingRows={editingRows}
          onRowEditChange={(e) => {
            setEditingRows(e.data);
          }}
          onRowEditComplete={onRowEditComplete}
          scrollable
          scrollHeight="70vh"
          paginator
          rows={rowsPerPage}
          rowsPerPageOptions={[50, 100, 250, 500]}
        >
          <Column header="#" body={(data, options) => options.rowIndex + 1} />
          <Column
            field="smiles"
            header="Structure"
            body={structureBody}
            editor={smilesEditor}
            filter
          />
          <Column
            field="name"
            header="Molecule Name"
            style={{ minWidth: "14rem" }}
            filter
            sortable
          />
          <Column
            field="disclosureScientist"
            header="Disclosure Scientist"
            editor={scientistEditor}
            filter
            sortable
          />
          <Column
            field="disclosureOrgId"
            header="Disclosure Org"
            body={(row) => getOrgAliasById(row.disclosureOrgId)}
            editor={orgEditor}
            filter
            filterMatchMode="custom"
            filterFunction={(value, filter) => {
              const orgAlias = (getOrgAliasById(value) || "").toLowerCase();
              const f = (filter || "").toLowerCase();
              return orgAlias.includes(f);
            }}
            sortable
          />
          <Column
            field="disclosureStage"
            header="Disclosure Stage"
            editor={stageEditor}
            filter
            sortable
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

export default observer(MLRegistrationStep1);
