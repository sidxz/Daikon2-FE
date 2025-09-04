import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useContext, useState } from "react";

import { Dropdown } from "primereact/dropdown";
import SmilesView from "../../../../Library/SmilesView/SmilesView";
import { RootStoreContext } from "../../../../RootStore";
import ImportFromExcel from "../../../../Shared/Excel/ImportFromExcel";
import InputOrgAlias from "../../../../Shared/InputEditors/InputOrgAlias";
import InputScientist from "../../../../Shared/InputEditors/InputScientist";
import { AppOrgResolver } from "../../../../Shared/VariableResolvers/AppOrgResolver";
import { DtFieldsToExcelColumnMapping } from "../MRConstants";

const MRInputSource = ({ onDataReady }) => {
  const [dataProcessed, setDataProcessed] = useState([]);
  const rootStore = useContext(RootStoreContext);
  const { user } = rootStore.authStore;
  const { fuzzyMatchOrgByName, getOrgAliasById } = AppOrgResolver();

  const [metaDataScientist] = useState(
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim()
  );
  const [metaDataOrgID] = useState(user?.appOrgId || "");

  const normalize = (s) => (s ?? "").toString().trim();

  // ---------- Column Editors (per PrimeReact docs) ----------
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

  // InputOrg used as a controlled editor; commit value via editorCallback
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
        {
          label: "Hit Assessment (HA)",
          value: "HA",
        },
        { label: "Hit to Lead (H2L)", value: "H2L" },
        { label: "Lead Optimization (LO)", value: "LO" },
        { label: "Selection Phase (SP)", value: "SP" },
        {
          label: "Investigational New Drug (IND)",
          value: "IND",
        },
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

  // ---------- Row edit commit (PrimeReact standard) ----------
  // e = { index, data, newData, type } — we persist newData by dataKey (__rid)
  const onRowEditComplete = (e) => {
    const { newData } = e;
    setDataProcessed((prev) => {
      const idx = prev.findIndex((r) => r.__rid === newData.__rid);
      if (idx === -1) return prev;
      const next = [...prev];
      next[idx] = newData; // persist the whole updated row
      onDataReady?.(next);
      return next;
    });
  };

  // ---------- File import & row prep ----------
  const handleUpload = async (e) => {
    const file = e.files?.[0];
    if (!file) return;

    const raw = await ImportFromExcel({
      file,
      headerMap: DtFieldsToExcelColumnMapping,
    });

    // clear selected file in UI
    e.files = null;
    e.options?.clear?.();

    // Clean + enrich
    const cleaned = raw
      .filter((r) => normalize(r.moleculeName))
      .map((r) => {
        const row = { ...r };

        if (!normalize(row.disclosureScientist)) {
          row.disclosureScientist = metaDataScientist;
        }

        if (normalize(row.disclosureOrg)) {
          const res = fuzzyMatchOrgByName(row.disclosureOrg);
          if (res?.id) row.orgId = res.id;
        }

        if (!normalize(row.orgId)) {
          row.orgId = metaDataOrgID;
        }

        return row;
      });

    // Stamp a stable dataKey for PrimeReact row editing
    let rid = 0;
    const withIds = cleaned.map((row) => ({ __rid: ++rid, ...row }));

    setDataProcessed(withIds);
    onDataReady?.(withIds);
  };

  return (
    <div className="flex flex-column w-full h-full">
      <div className="flex flex-column w-full h-full">
        <FileUpload
          name="excelFile"
          accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          maxFileSize={10_000_000}
          mode="basic"
          chooseLabel="Browse and Select File"
          chooseOptions={{
            icon: "icon icon-common icon-plus-circle",
            className: "p-button-text p-button-md",
          }}
          cancelOptions={{
            label: "Cancel",
            icon: "pi pi-times",
            className: "p-button-danger",
          }}
          className="p-button-text p-button-secondary"
          customUpload
          uploadHandler={handleUpload}
          emptyTemplate={() => (
            <div className="flex align-items-center flex-column">
              <i
                className="pi pi-image mt-3 p-5"
                style={{
                  fontSize: "5em",
                  borderRadius: "50%",
                  backgroundColor: "var(--surface-b)",
                  color: "var(--surface-d)",
                }}
              />
              <span
                style={{
                  fontSize: "1.2em",
                  color: "var(--text-color-secondary)",
                }}
                className="my-5"
              >
                Drag and Drop Hits Excel Here
              </span>
            </div>
          )}
          auto
        />
      </div>

      <div className="flex flex-column w-full h-full">
        <DataTable
          value={dataProcessed}
          dataKey="__rid"
          className="w-full h-full"
          editMode="row"
          onRowEditComplete={onRowEditComplete}
          // (Optional) responsive behavior:
          responsiveLayout="scroll"
        >
          {/* Row number */}
          <Column header="#" body={(data, options) => options.rowIndex + 1} />

          {/* Structure (read-only) */}
          <Column field="smiles" header="Structure" body={structureBody} />

          {/* Molecule name (read-only, change to textEditor if you want editable) */}
          <Column
            field="moleculeName"
            header="Molecule Name"
            style={{ minWidth: "14rem" }}
          />

          {/* Editable: Disclosure Scientist */}
          <Column
            field="disclosureScientist"
            header="Disclosure Scientist"
            editor={scientistEditor}
          />

          {/* Editable: Org with custom selector */}
          <Column
            field="orgId"
            header="Disclosure Org"
            body={(row) => getOrgAliasById(row.orgId)}
            editor={orgEditor}
          />
          {/* Editable: Disclosure Stage */}
          <Column
            field="disclosureStage"
            header="Disclosure Stage"
            editor={stageEditor}
          />

          {/* Editable: Disclosure Reason */}
          <Column
            field="disclosureReason"
            header="Disclosure Reason"
            editor={textareaEditor}
          />

          {/* Editable: Notes */}
          <Column
            field="disclosureNotes"
            header="Disclosure Notes"
            editor={textareaEditor}
          />

          {/* Editable: Literature References */}
          <Column
            field="literatureReferences"
            header="Literature References"
            editor={textareaEditor}
          />

          {/* Row editor control (pencil / save / cancel) */}
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
