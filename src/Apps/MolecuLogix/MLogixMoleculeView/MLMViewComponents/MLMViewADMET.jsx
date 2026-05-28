import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { Chart } from "primereact/chart";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Fieldset } from "primereact/fieldset";
import { Tag } from "primereact/tag";
import { Tooltip } from "primereact/tooltip";
import { useState } from "react";
import { ML_GENERATED_TOOLTIP } from "../../../../constants/strings";
import {
  ADMET_BUCKETS,
  RADAR_AXES,
  SEVERITY_TO_TAG,
  bucketVerdict,
  propertiesByBucket,
  radarSeries,
} from "./MLMViewADMETHelper";

// Soft background tint per severity. No borders, shadow only, like the
// nuisance chips.
const CHIP_STYLE = {
  good: { bg: "#eef7ee", fg: "#1b5e20" },
  caution: { bg: "#fff8e1", fg: "#7a4f01" },
  risk: { bg: "#fdecec", fg: "#b71c1c" },
  info: { bg: "#e8f1fb", fg: "#0d47a1" },
};

const SEVERITY_LABEL = {
  good: "OK",
  caution: "Caution",
  risk: "Risk",
  info: "Info",
};

const BucketChip = ({ bucket, severity, flagged }) => {
  const style = CHIP_STYLE[severity];
  const tooltipId = `admet-chip-${bucket.id}`;
  const tooltipBody =
    flagged.length === 0
      ? "All sub-properties within acceptable bounds."
      : flagged
          .slice(0, 6)
          .map((f) => `${f.label}: ${f.value} (${SEVERITY_LABEL[f.severity]})`)
          .join("\n") + (flagged.length > 6 ? `\n…and ${flagged.length - 6} more` : "");

  return (
    <>
      <Tooltip
        target={`#${tooltipId}`}
        content={tooltipBody}
        position="bottom"
        style={{ whiteSpace: "pre-line", maxWidth: "20rem" }}
      />
      <div
        id={tooltipId}
        className="flex flex-column align-items-center justify-content-center px-2 py-1 border-round-md shadow-1 text-xs font-medium text-center"
        style={{
          backgroundColor: style.bg,
          color: style.fg,
          width: "8rem",
        }}
      >
        <div>{bucket.label}</div>
        <div className="mt-1 font-bold text-sm">
          {SEVERITY_LABEL[severity]}
        </div>
        {flagged.length > 0 && (
          <div className="opacity-80">
            {flagged.length} flag{flagged.length > 1 ? "s" : ""}
          </div>
        )}
      </div>
    </>
  );
};

const PercentileBar = ({ pct }) => {
  if (pct === undefined || pct === null || Number.isNaN(pct)) {
    return <span className="text-xs text-color-secondary">n/a</span>;
  }
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div
      className="flex align-items-center gap-2"
      style={{ minWidth: "10rem" }}
    >
      <div
        className="border-round-sm"
        style={{
          flex: 1,
          height: "0.5rem",
          backgroundColor: "#eceff1",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${clamped}%`,
            height: "100%",
            background:
              "linear-gradient(90deg, #90caf9 0%, #42a5f5 60%, #1565c0 100%)",
          }}
        />
      </div>
      <span className="text-xs" style={{ minWidth: "2.6rem" }}>
        {clamped.toFixed(0)}%
      </span>
    </div>
  );
};

const renderValueCell = (row) => (
  <span className="font-medium">
    {row.formatted}
    {row.unit ? <span className="text-xs ml-1 opacity-70">{row.unit}</span> : null}
  </span>
);

const renderLabelCell = (row) => {
  const tipId = `admet-row-${row.id}`;
  return (
    <>
      <Tooltip target={`#${tipId}`} content={row.description} position="top" />
      <span id={tipId} style={{ borderBottom: "1px dotted #b0bec5" }}>
        {row.label}
      </span>
    </>
  );
};

const renderVerdictCell = (row) => (
  <Tag
    severity={SEVERITY_TO_TAG[row.severity]}
    value={SEVERITY_LABEL[row.severity]}
  />
);

const renderPercentileCell = (row) => <PercentileBar pct={row.percentile} />;

const buildRows = (bucketId, predictions) =>
  propertiesByBucket[bucketId]
    .map((p, idx) => {
      const raw = predictions?.[p.key];
      if (raw === undefined || raw === null) return null;
      const pct = predictions?.[`${p.key}_drugbank_approved_percentile`];
      return {
        id: `admet-row-${bucketId}-${idx}`,
        label: p.label,
        description: p.description,
        formatted: p.format(raw),
        unit: p.unit,
        percentile: pct,
        severity: p.classify(raw),
      };
    })
    .filter(Boolean);

const ADMETStatusPanel = ({ status }) => (
  <div className="flex flex-column w-full gap-2 p-4 justify-content-center align-items-center surface-400 border-round-md border-1 border-400 text-white">
    {status === "pending" || status === "queued" || status === "running"
      ? "ADMET predictions are still being processed. Please check back later."
      : status === "failed"
        ? "ADMET prediction failed. Re-run from the registration pipeline."
        : "ADMET predictions are not yet available for this molecule."}
  </div>
);

// Split buckets into two columns: PK profile on the left, safety on the right.
const LEFT_COL_BUCKETS = ["drugLikeness", "absorption", "distribution"];
const RIGHT_COL_BUCKETS = ["metabolism", "excretion", "toxicity"];

// Curated key cutoffs for the "Cutoffs & sources" dialog. Kept hand-written
// (rather than auto-derived from classify functions) so the displayed values
// stay easy to red-pen.
const TB_TUNED_CUTOFFS = [
  {
    property: "cLogP",
    good: "2 to 5",
    caution: "1 to 6",
    risk: "outside 1 to 6",
  },
  {
    property: "Lipophilicity (logD)",
    good: "1 to 4",
    caution: "0 to 5",
    risk: "outside 0 to 5",
  },
  {
    property: "Molecular Weight",
    good: "200 to 550 Da",
    caution: "150 to 650 Da",
    risk: "outside 150 to 650",
  },
  {
    property: "Half-Life",
    good: "8 to 72 h",
    caution: "4 to 8 h or 72 to 168 h",
    risk: "< 4 h or > 168 h",
  },
  {
    property: "Vdss",
    good: "informational",
    caution: "",
    risk: "",
  },
  {
    property: "hERG (blockade prob.)",
    good: "< 0.3",
    caution: "0.3 to 0.5",
    risk: "> 0.5",
  },
  {
    property: "DILI (probability)",
    good: "< 0.3",
    caution: "0.3 to 0.5",
    risk: "> 0.5",
  },
  {
    property: "AMES (mutagenicity)",
    good: "< 0.3",
    caution: "0.3 to 0.5",
    risk: "> 0.5",
  },
  {
    property: "CYP3A4 inhibition",
    good: "< 0.3",
    caution: "0.3 to 0.6",
    risk: "> 0.6",
  },
  {
    property: "Oral Bioavailability",
    good: "> 0.7",
    caution: "0.5 to 0.7",
    risk: "< 0.5",
  },
  {
    property: "Aqueous Solubility (logS)",
    good: "> −4",
    caution: "−4 to −6",
    risk: "< −6",
  },
  {
    property: "Plasma Protein Binding",
    good: "< 90 %",
    caution: "90 to 99 %",
    risk: "> 99 %",
  },
];

const SOURCES = [
  {
    title: "ADMET-AI (Swanson et al., Bioinformatics 2024)",
    note: "the underlying TDC ML models",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11226862/",
  },
  {
    title: "The TB Drug Accelerator at Year Ten",
    note: "TBDA consortium methodology",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10478072/",
  },
  {
    title: "Comprehensive physicochemical, PK & activity profiling of anti-TB agents",
    note: "approved/clinical anti-TB drug property landscape",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7714050/",
  },
  {
    title: "Challenging the Drug-Likeness Dogma for TB",
    note: "why TB drug space deviates from Lipinski Ro5",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6037898/",
  },
  {
    title: "Physicochemical properties & M. tuberculosis transporters (RSC MedChem)",
    note: "AB-MPS, PFI, cell-wall transporter considerations",
    url: "https://pubs.rsc.org/en/content/articlehtml/2021/md/d0md00265h",
  },
  {
    title: "DprE1 Inhibitors ADMET Analysis (ACS Omega 2022)",
    note: "modern anti-tubercular ADMET cutoffs",
    url: "https://pubs.acs.org/doi/10.1021/acsomega.2c05307",
  },
  {
    title: "Quantitative cardiac-risk assessment for TB drug development",
    note: "hERG / TdP framing post-bedaquiline",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5953981/",
  },
  {
    title: "Antituberculosis Drugs-induced Hepatotoxicity: An Update (2024)",
    note: "DILI as a major TB-drug attrition driver",
    url: "https://journals.lww.com/tg/fulltext/2024/07000/antituberculosis_drugs_induced_hepatotoxicity__an.1.aspx",
  },
];

const CutoffsAndSourcesDialog = ({ visible, onHide }) => (
  <Dialog
    header="ADMET cutoffs & sources"
    visible={visible}
    onHide={onHide}
    style={{ width: "60rem", maxWidth: "92vw" }}
    contentStyle={{ maxHeight: "75vh" }}
    dismissableMask
  >
    <div className="flex flex-column gap-3">
      <section>
        <p className="m-0 text-sm line-height-3">
          The numeric predictions shown above come from{" "}
          <a
            href="https://pmc.ncbi.nlm.nih.gov/articles/PMC11226862/"
            target="_blank"
            rel="noreferrer"
          >
            ADMET-AI
          </a>{" "}
          /{" "}
          <a
            href="https://tdcommons.ai/"
            target="_blank"
            rel="noreferrer"
          >
            Therapeutics Data Commons
          </a>{" "}
          machine-learning models.
        </p>
      </section>

      <section>
        <div className="font-medium mb-2">Key TB-tuned cutoffs</div>
        <DataTable
          value={TB_TUNED_CUTOFFS}
          size="small"
          stripedRows
          dataKey="property"
        >
          <Column field="property" header="Property" style={{ width: "11rem" }} />
          <Column field="good" header="Good" style={{ width: "7rem" }} />
          <Column field="caution" header="Caution" style={{ width: "9rem" }} />
          <Column field="risk" header="Risk" style={{ width: "8rem" }} />
        </DataTable>
      </section>

      <section>
        <div className="font-medium mb-1">Percentile reference (caveat)</div>
        <p className="m-0 text-sm line-height-3 text-color-secondary">
          The percentile bars are computed against all ~2,579 DrugBank-approved
          drugs.
        </p>
      </section>

      <section>
        <div className="font-medium mb-2">Sources</div>
        <ul className="m-0 pl-4 text-sm line-height-3">
          {SOURCES.map((s) => (
            <li key={s.url} className="mb-1">
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.title}
              </a>{" "}
              <span className="text-color-secondary">({s.note})</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  </Dialog>
);

const MLMViewADMET = ({ selectedMolecule }) => {
  // Independent expansion state per column so they collapse/expand
  // without interfering with each other.
  const [activeLeft, setActiveLeft] = useState([]);
  const [activeRight, setActiveRight] = useState([]);
  const [sourcesVisible, setSourcesVisible] = useState(false);
  const admet = selectedMolecule?.admetPrediction;
  const predictions = admet?.predictions;

  if (!admet || admet.status !== "done" || !predictions) {
    return (
      <div className="flex pt-2 w-full">
        <Fieldset
          className="m-0 flex-grow-1 w-full"
          legend="AI/ML ADMET PREDICTIONS"
        >
          <ADMETStatusPanel status={admet?.status} />
        </Fieldset>
      </div>
    );
  }

  // ---- Top: bucket chips ----
  const bucketVerdicts = ADMET_BUCKETS.map((b) => ({
    bucket: b,
    ...bucketVerdict(b.id, predictions),
  }));

  // ---- Middle: radar + flag list ----
  const radarLabels = RADAR_AXES.map((a) => a.label);
  const radarValues = radarSeries(predictions);
  const radarData = {
    labels: radarLabels,
    datasets: [
      {
        label: "ADMET-AI percentile vs DrugBank approved (outward = better)",
        data: radarValues,
        fill: true,
        borderColor: "#e53935",
        backgroundColor: "rgba(229, 57, 53, 0.2)",
        pointBackgroundColor: "#e53935",
      },
    ],
  };
  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (items) => items[0]?.label ?? "",
          label: (ctx) => {
            const axis = RADAR_AXES[ctx.dataIndex];
            const v = ctx.parsed?.r ?? ctx.raw;
            return `${Number(v).toFixed(0)}%  —  ${axis?.description ?? ""}`;
          },
        },
      },
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: { stepSize: 25, backdropColor: "transparent" },
        pointLabels: { font: { size: 11 } },
      },
    },
  };

  // Surface the highest-priority flags (risks first) into a tidy list.
  const allFlags = bucketVerdicts
    .flatMap((bv) =>
      bv.flagged.map((f) => ({ ...f, bucketLabel: bv.bucket.label })),
    )
    .slice(0, 8);

  const anyExpanded = activeLeft.length > 0 || activeRight.length > 0;

  const renderAccordionTab = (b) => {
    const rows = buildRows(b.id, predictions);
    if (rows.length === 0) return null;
    const verdict = bucketVerdicts.find((bv) => bv.bucket.id === b.id);
    const chipStyle = CHIP_STYLE[verdict.severity];
    return (
      <AccordionTab
        key={b.id}
        headerTemplate={(options) => (
          <a
            tabIndex={0}
            className={options.className}
            onClick={options.onClick}
          >
            <span className={options.iconClassName} />
            <span className="flex align-items-center gap-2 ml-1 flex-grow-1">
              <span className="font-medium">{b.label}</span>
              <span
                className="px-2 py-1 border-round-sm text-xs font-medium"
                style={{
                  backgroundColor: chipStyle.bg,
                  color: chipStyle.fg,
                }}
              >
                {SEVERITY_LABEL[verdict.severity]}
              </span>
              <span className="text-xs text-color-secondary">
                ({rows.length} prop{rows.length > 1 ? "s" : ""})
              </span>
            </span>
          </a>
        )}
      >
        <DataTable value={rows} size="small" stripedRows dataKey="id">
          <Column
            field="label"
            header="Property"
            body={renderLabelCell}
          />
          <Column
            field="formatted"
            header="Value"
            body={renderValueCell}
            style={{ width: "8rem" }}
          />
          <Column
            field="percentile"
            header="Percentile vs approved"
            body={renderPercentileCell}
            style={{ width: "14rem" }}
          />
          <Column
            field="severity"
            header="Verdict"
            body={renderVerdictCell}
            style={{ width: "6rem" }}
          />
        </DataTable>
      </AccordionTab>
    );
  };

  return (
    <div className="flex pt-2 w-full">
      <Fieldset
        className="m-0 flex-grow-1 w-full"
        legend="AI/ML ADMET PREDICTIONS"
      >
        <div className="flex flex-column gap-3 w-full">
          {/* Top band: chips grid | radar | flagged-property pills */}
          <div className="flex flex-wrap align-items-stretch gap-3">
            {/* Chips: 3-col × 2-row grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 8rem)",
                gridAutoRows: "min-content",
                gap: "0.5rem",
                flex: "0 0 auto",
                alignContent: "center",
              }}
            >
              {bucketVerdicts.map(({ bucket, severity, flagged }) => (
                <BucketChip
                  key={bucket.id}
                  bucket={bucket}
                  severity={severity}
                  flagged={flagged}
                />
              ))}
            </div>

            {/* Radar with short labels so 24rem container doesn't clip */}
            <div
              style={{
                width: "24rem",
                height: "22rem",
                flex: "0 0 auto",
                maxWidth: "100%",
              }}
            >
              <Chart
                type="radar"
                data={radarData}
                options={radarOptions}
                style={{ width: "100%", height: "100%" }}
              />
            </div>

            {/* Flagged properties: pills that flex-wrap to fill remaining width */}
            <div
              className="flex flex-column gap-2 p-2"
              style={{ flex: "1 1 22rem", minWidth: "20rem" }}
            >
              <div className="font-medium">Top flagged properties</div>
              {allFlags.length === 0 ? (
                <div className="text-sm text-color-secondary">
                  No properties flagged. Molecule looks clean across all ADMET
                  buckets at current thresholds.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 align-content-start">
                  {allFlags.map((f, i) => (
                    <div
                      key={i}
                      className="flex align-items-center gap-2 px-2 py-1 border-round-md surface-0 shadow-1"
                      style={{ minWidth: "16rem" }}
                    >
                      <Tag
                        severity={SEVERITY_TO_TAG[f.severity]}
                        value={SEVERITY_LABEL[f.severity]}
                      />
                      <div className="flex flex-column">
                        <span className="text-sm font-medium line-height-2">
                          {f.label}
                        </span>
                        <span className="text-xs text-color-secondary line-height-2">
                          {f.bucketLabel} · {f.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Single control toggles every bucket in both columns. */}
          <div className="flex justify-content-end">
            <Button
              label={anyExpanded ? "Collapse all" : "Expand all"}
              icon={anyExpanded ? "pi pi-chevron-up" : "pi pi-chevron-down"}
              severity="secondary"
              size="small"
              text
              onClick={() => {
                if (anyExpanded) {
                  setActiveLeft([]);
                  setActiveRight([]);
                } else {
                  setActiveLeft(LEFT_COL_BUCKETS.map((_, i) => i));
                  setActiveRight(RIGHT_COL_BUCKETS.map((_, i) => i));
                }
              }}
            />
          </div>

          {/* Detail: 2-column accordion grid (PK left, safety right) */}
          <div className="grid m-0">
            <div className="col-12 lg:col-6 p-0 lg:pr-2">
              <Accordion
                multiple
                activeIndex={activeLeft}
                onTabChange={(e) => setActiveLeft(e.index)}
              >
                {LEFT_COL_BUCKETS.map((id) =>
                  renderAccordionTab(
                    ADMET_BUCKETS.find((b) => b.id === id),
                  ),
                )}
              </Accordion>
            </div>
            <div className="col-12 lg:col-6 p-0 lg:pl-2">
              <Accordion
                multiple
                activeIndex={activeRight}
                onTabChange={(e) => setActiveRight(e.index)}
              >
                {RIGHT_COL_BUCKETS.map((id) =>
                  renderAccordionTab(
                    ADMET_BUCKETS.find((b) => b.id === id),
                  ),
                )}
              </Accordion>
            </div>
          </div>

          <div className="flex flex-wrap align-items-center gap-2 text-xs text-color-secondary">
            <span>{ML_GENERATED_TOOLTIP}</span>
            <Button
              label="Cutoffs & sources"
              link
              size="small"
              className="p-0 text-xs"
              onClick={() => setSourcesVisible(true)}
            />
          </div>
        </div>
      </Fieldset>

      <CutoffsAndSourcesDialog
        visible={sourcesVisible}
        onHide={() => setSourcesVisible(false)}
      />
    </div>
  );
};

export default MLMViewADMET;
