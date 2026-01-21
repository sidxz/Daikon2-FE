import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { MeterGroup } from "primereact/metergroup";
import { Tag } from "primereact/tag";
import { useEffect, useMemo, useState } from "react";
import SmilesView from "../../../../Library/SmilesView/SmilesView";
import exportToExcel from "../../../../Shared/Excel/ExportToExcel";
import { AppOrgResolver } from "../../../../Shared/VariableResolvers/AppOrgResolver";
import MolDbAPI from "../../api/MolDbAPI";
import {
  computeRejectedByNameOrSynonym,
  statusMeta,
} from "../helpers/MLRStep2Helper";
import { DtFieldsToExcelColumnMapping } from "../MLogixRegistrationConstants";

const EXPORT_TAG_FIELD = "previewTag";
const REJECTED_TAG = "Rejected (Not Returned in Preview)";

const MLRegistrationsStep3 = ({ inputs }) => {
  const [registrationResults, setRegistrationResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getOrgAliasById } = AppOrgResolver();

  useEffect(() => {
    let cancelled = false;

    const sendRegistrationRequest = async () => {
      if (!inputs || inputs.length === 0) {
        if (!cancelled) setRegistrationResults([]); // fix
        return;
      }

      setLoading(true);
      try {
        const registrationResponse =
          await MolDbAPI.registerMoleculeBatch(inputs);

        const results =
          registrationResponse?.results ??
          registrationResponse?.items ??
          registrationResponse ??
          [];

        if (!cancelled) {
          setRegistrationResults(Array.isArray(results) ? results : [results]);
        }
      } catch (err) {
        console.error("Error during dry run request:", err);
        if (!cancelled) setRegistrationResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    sendRegistrationRequest();

    return () => {
      cancelled = true;
    };
  }, [inputs]);

  console.log("Registration results:", registrationResults);

  const structureBody = (rowData) => (
    <div className="flex flex-column" style={{ width: 250, height: 290 }}>
      <div className="flex w-full h-full">
        <SmilesView smiles={rowData?.smiles} width={250} height={270} />
      </div>
    </div>
  );

  const registrationStatusBody = (rowData) => {
    const meta = statusMeta(rowData?.previewStatus);
    return <Tag severity={meta.severity} value={meta.label} />;
  };

  // ---------- Dashboard stats ----------
  const stats = useMemo(() => {
    const sent = inputs?.length ?? 0;
    const returned = registrationResults?.length ?? 0;

    const byStatus = new Map();
    for (const r of registrationResults || []) {
      const key = r?.previewStatus || "UNKNOWN";
      byStatus.set(key, (byStatus.get(key) || 0) + 1);
    }

    const statusRows = Array.from(byStatus.entries())
      .map(([status, count]) => {
        const meta = statusMeta(status);
        return { status, count, ...meta };
      })
      .sort((a, b) => b.count - a.count);

    const meterValues = statusRows.map((s) => ({
      label: `${s.label} (${s.count})`,
      value: (s.count / (returned || 1)) * 100,
      color: s.color,
    }));

    const duplicates =
      (byStatus.get("DUPLICATE_DISCLOSED") || 0) +
      (byStatus.get("DUPLICATE_UNDISCLOSED") || 0);

    const disclosures = byStatus.get("DISCLOSURE") || 0;

    const registrations =
      (byStatus.get("REGISTRATION") || 0) +
      (byStatus.get("REGISTER_UNDISCLOSED") || 0);

    return {
      sent,
      returned,
      duplicates,
      disclosures,
      registrations,
      statusRows,
      meterValues,
    };
  }, [inputs, registrationResults]);

  // rows sent to server but NOT returned in preview (missing tags)
  const rejectedRows = useMemo(
    () => computeRejectedByNameOrSynonym(inputs, registrationResults),
    [inputs, registrationResults],
  );

  // ---------- Excel export rows (with tag) ----------
  const previewExportRows = useMemo(() => {
    return (registrationResults || []).map((r) => {
      const meta = statusMeta(r?.previewStatus);
      return {
        ...r,
        [EXPORT_TAG_FIELD]: meta.label, // human tag
      };
    });
  }, [registrationResults]);

  const rejectedExportRows = useMemo(() => {
    return (rejectedRows || []).map((r) => ({
      ...r,
      [EXPORT_TAG_FIELD]: REJECTED_TAG, // synthesized tag (since missing in preview)
    }));
  }, [rejectedRows]);

  // Add the export tag column to your existing mapping (and keep ordering stable)
  const exportHeaderMapPreview = useMemo(() => {
    return {
      ...DtFieldsToExcelColumnMapping,
      previewStatus: "Preview Status (Raw)",
      [EXPORT_TAG_FIELD]: "Preview Tag",
      previewMessage: "Preview Message",
    };
  }, []);

  const exportHeaderMapRejected = useMemo(() => {
    return {
      ...DtFieldsToExcelColumnMapping,
      [EXPORT_TAG_FIELD]: "Preview Tag",
    };
  }, []);

  const downloadPreviewResults = async () => {
    await exportToExcel({
      jsonData: previewExportRows,
      fileName: `MLRegistration_Results_${new Date()
        .toISOString()
        .slice(0, 10)}`,
      sheetName: "RegistrationResults",
      includeId: true,
      headerMap: exportHeaderMapPreview,
    });
  };

  // failure sheet = only missing tags (sent but not returned)
  const downloadRejected = async () => {
    await exportToExcel({
      jsonData: rejectedExportRows,
      fileName: `MLRegistration_Rejected_${new Date()
        .toISOString()
        .slice(0, 10)}`,
      sheetName: "Rejected",
      includeId: true,
      headerMap: exportHeaderMapRejected,
    });
  };

  const meterValuesRollup = useMemo(() => {
    const total = stats.returned + rejectedRows.length || 1;

    return [
      {
        label: `Registrations (${stats.registrations})`,
        value: (stats.registrations / total) * 100,
        color: "var(--green-500)",
      },
      {
        label: `Disclosures (${stats.disclosures})`,
        value: (stats.disclosures / total) * 100,
        color: "var(--teal-500)",
      },
      {
        label: `Duplicates (${stats.duplicates})`,
        value: (stats.duplicates / total) * 100,
        color: "var(--orange-500)",
      },
      {
        label: `Invalid (${rejectedRows.length})`,
        value: (rejectedRows.length / total) * 100,
        color: "var(--red-500)",
      },
    ];
  }, [
    stats.returned,
    stats.registrations,
    stats.disclosures,
    stats.duplicates,
    rejectedRows.length,
  ]);

  const header = useMemo(() => {
    return (
      <div className="w-full flex flex-column gap-2 bg-surface-50 border-round-lg">
        <div className="w-full flex gap-3 flex-wrap">
          {/* Rows sent */}
          <div className="flex align-items-center gap-2 px-3 py-2 border-round-md bg-white">
            <i className="pi pi-cloud-upload text-primary text-xl" />
            <div className="flex flex-column">
              <span className="text-500 text-xs uppercase tracking-wide">
                Rows sent to server for Registration
              </span>
              <span className="text-900 font-semibold text-lg">
                {stats.sent}
              </span>
            </div>
          </div>

          {/* Rows returned */}
          <div className="flex align-items-center gap-2 px-3 py-2 border-round-md bg-white">
            <i className="pi pi-list text-primary text-xl" />
            <div className="flex flex-column">
              <span className="text-500 text-xs uppercase tracking-wide">
                Rows returned
              </span>
              <span className="text-900 font-semibold text-lg">
                {stats.returned}
              </span>
            </div>
          </div>

          {/* Quick buckets */}
          <div className="flex align-items-center gap-2 px-3 py-2 border-round-md bg-white">
            <i className="pi pi-clone text-400 text-xl" />
            <div className="flex flex-column">
              <span className="text-500 text-xs uppercase tracking-wide">
                Duplicates
              </span>
              <span className="text-900 font-semibold text-lg">
                {stats.duplicates}
              </span>
            </div>
          </div>

          <div className="flex align-items-center gap-2 px-3 py-2 border-round-md bg-white">
            <i className="pi pi-shield text-400 text-xl" />
            <div className="flex flex-column">
              <span className="text-500 text-xs uppercase tracking-wide">
                Disclosures
              </span>
              <span className="text-900 font-semibold text-lg">
                {stats.disclosures}
              </span>
            </div>
          </div>

          <div className="flex align-items-center gap-2 px-3 py-2 border-round-md bg-white">
            <i className="pi pi-check-circle text-400 text-xl" />
            <div className="flex flex-column">
              <span className="text-500 text-xs uppercase tracking-wide">
                Registrations
              </span>
              <span className="text-900 font-semibold text-lg">
                {stats.registrations}
              </span>
            </div>
          </div>

          {/* MeterGroup */}
          <div className="flex-grow min-w-20rem px-3 py-2 border-round-md bg-white">
            <div className="flex align-items-center justify-content-between mb-2">
              <span className="text-500 text-xs uppercase tracking-wide">
                Registration Status Distribution
              </span>
              <i className="pi pi-chart-bar text-400" />
            </div>
            <MeterGroup className="w-full" values={meterValuesRollup} />
          </div>
        </div>

        {/* Tag strip: status + count */}
        <div className="flex gap-2 flex-wrap px-2 pb-2">
          {stats.statusRows.map((s) => (
            <Tag
              key={s.status}
              severity={s.severity}
              value={`${s.label}: ${s.count}`}
            />
          ))}
        </div>

        {/* Download buttons */}
        <div className="w-full flex justify-content-end gap-2 px-2 pb-2">
          <Button
            icon="pi pi-download"
            label="Download Results"
            className="p-button-sm"
            disabled={loading || (registrationResults?.length ?? 0) === 0}
            onClick={downloadPreviewResults}
          />
          <Button
            icon="pi pi-download"
            label={`Download Invalid (${rejectedRows.length})`}
            className="p-button-sm p-button-danger"
            disabled={
              loading ||
              (inputs?.length ?? 0) === 0 ||
              rejectedRows.length === 0
            }
            onClick={downloadRejected}
          />
        </div>
      </div>
    );
  }, [
    stats,
    loading,
    registrationResults?.length,
    inputs?.length,
    rejectedRows.length,
  ]);

  return (
    <div className="flex flex-column w-full">
      <div className="flex flex-column w-full h-full">
        <DataTable
          loading={loading}
          value={registrationResults}
          dataKey="id"
          className="w-full h-full"
          sortField="previewStatus"
          sortOrder={-1}
          header={header}
          scrollable
          scrollHeight="70vh"
          paginator
          rows={100}
          rowsPerPageOptions={[50, 100, 250, 500]}
        >
          <Column header="#" body={(data, options) => options.rowIndex + 1} />
          <Column
            field="previewStatus"
            header="Preview Status"
            body={registrationStatusBody}
          />

          <Column field="smiles" header="Structure" body={structureBody} />
          <Column
            field="name"
            header="Molecule Name"
            style={{ minWidth: "14rem" }}
          />
          <Column field="disclosureScientist" header="Disclosure Scientist" />
          <Column
            field="orgId"
            header="Disclosure Org"
            body={(row) => getOrgAliasById(row.disclosureOrgId)}
          />
          <Column field="disclosureStage" header="Disclosure Stage" />
          <Column field="disclosureReason" header="Disclosure Reason" />
          <Column field="disclosureNotes" header="Disclosure Notes" />
          <Column field="literatureReferences" header="Literature References" />
        </DataTable>
      </div>
    </div>
  );
};

export default observer(MLRegistrationsStep3);
