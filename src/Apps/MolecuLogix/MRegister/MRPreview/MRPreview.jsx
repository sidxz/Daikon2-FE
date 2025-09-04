import { observer } from "mobx-react-lite";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tag } from "primereact/tag";
import { useEffect, useMemo, useState } from "react";
import SmilesView from "../../../../Library/SmilesView/SmilesView";
import MolDbAPI from "../../api/MolDbAPI";

const MRPreview = ({ inputs = [], previewResults, setPreviewResults }) => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setApiError(null);
      if (!inputs || inputs.length === 0) {
        setPreviewResults?.([]);
        return;
      }
      setLoading(true);
      try {
        // NOTE: implement this in your API similar to discloseMoleculePreview
        const res = await MolDbAPI.registerMoleculePreview(inputs);
        if (cancelled) return;

        // Prefer matching by __rid if the API echoes it back; fallback to index
        const byRid = new Map(inputs.map((r) => [r.__rid, r]));
        const enriched = res.map((r, i) => {
          const original =
            (r && r.__rid && byRid.get(r.__rid)) || inputs[i] || {};
          return { ...original, ...r };
        });

        setPreviewResults?.(enriched);
      } catch (err) {
        console.error("Error fetching register preview:", err);
        setApiError(err?.message || "Failed to load preview");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [inputs, setPreviewResults]);

  const stats = useMemo(() => {
    const total = previewResults?.length || 0;
    const ok = (previewResults || []).filter((r) => r?.isValid).length;
    const bad = total - ok;
    return { total, ok, bad };
  }, [previewResults]);

  const ValidityBody = (row) =>
    row?.isValid ? (
      <Tag severity="info" value="OK" />
    ) : (
      <Tag severity="danger" value="Error" />
    );

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

  if (loading) return <div>Loading preview…</div>;

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

        <div className="flex flex-wrap gap-2 align-items-center">
          <Tag value={`Total: ${stats.total}`} />
          <Tag severity="success" value={`OK: ${stats.ok}`} />
          <Tag severity="danger" value={`Errors: ${stats.bad}`} />
          {apiError && <Tag severity="warning" value={`API: ${apiError}`} />}
        </div>
      </div>

      <div className="flex w-full border-1 border-50 border-round surface-ground">
        <DataTable
          value={previewResults || []}
          tableStyle={{ minWidth: "100rem" }}
          className="w-full"
        >
          <Column header="#" body={(data, opts) => (opts.rowIndex ?? 0) + 1} />
          <Column header="Structure" body={StructureBody} />
          <Column field="moleculeName" header="Name" />
          <Column
            field="smiles"
            header="SMILES"
            className="flex-wrap text-wrap white-space-normal"
          />
          <Column header="Validity" body={ValidityBody} />
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
          {/* Optional: duplicates or normalization echoes from API */}
          {/*
          <Column field="duplicateOf" header="Duplicate Of" />
          <Column field="normalizedSmiles" header="Canonical SMILES" />
          */}
        </DataTable>
      </div>
    </div>
  );
};

export default observer(MRPreview);
