// Severity = "good" | "caution" | "risk" | "info"
// direction tells the reader which way is favorable.

const between = (v, lo, hi) => v >= lo && v <= hi;

// Tag severities for PrimeReact `Tag` and `Badge`
export const SEVERITY_TO_TAG = {
  good: "success",
  caution: "warning",
  risk: "danger",
  info: "info",
};

// Worst-of helper: collapse many child severities into a bucket verdict.
const SEVERITY_RANK = { info: 0, good: 0, caution: 1, risk: 2 };
export const worstSeverity = (severities) => {
  let worst = "good";
  for (const s of severities) {
    if (SEVERITY_RANK[s] > SEVERITY_RANK[worst]) worst = s;
  }
  return worst;
};

export const ADMET_BUCKETS = [
  { id: "drugLikeness", label: "Drug-likeness" },
  { id: "absorption", label: "Absorption" },
  { id: "distribution", label: "Distribution" },
  { id: "metabolism", label: "Metabolism (DDI)" },
  { id: "excretion", label: "Excretion / PK" },
  { id: "toxicity", label: "Toxicity" },
];

// Property descriptors. `classify(v)` returns severity from the raw value.
// Thresholds reflect early-stage TB drug-discovery conventions:
//   - oral, long-duration dosing
//   - HIV co-medication (avoid strong CYP3A4 inhibition/induction)
//   - hERG / DILI / AMES are kill-criteria
//   - BBB penetration is informational (not penalised) unless target requires
export const ADMET_PROPERTIES = [
  // ---------- Drug-likeness / physchem ----------
  {
    key: "QED",
    label: "QED",
    description: "Quantitative Estimate of Drug-likeness (0–1, higher = better)",
    bucket: "drugLikeness",
    unit: "",
    direction: "higher-better",
    format: (v) => v.toFixed(2),
    classify: (v) => (v >= 0.67 ? "good" : v >= 0.5 ? "caution" : "risk"),
  },
  {
    key: "Lipinski",
    label: "Lipinski Ro5 (rules passed)",
    description: "Rules of Five passed (0–4). 4 = fully compliant",
    bucket: "drugLikeness",
    unit: "/ 4",
    direction: "higher-better",
    format: (v) => v.toFixed(0),
    classify: (v) => (v >= 4 ? "good" : v >= 3 ? "caution" : "risk"),
  },
  {
    key: "molecular_weight",
    label: "Molecular Weight",
    description:
      "Da. TB-tuned: lead-like 200–550 (bedaquiline 555, delamanid 534 are clinically successful)",
    bucket: "drugLikeness",
    unit: "Da",
    direction: "range",
    format: (v) => v.toFixed(1),
    classify: (v) =>
      between(v, 200, 550)
        ? "good"
        : between(v, 150, 650)
          ? "caution"
          : "risk",
  },
  {
    key: "logP",
    label: "cLogP",
    description:
      "Computed octanol/water partition. TB-tuned: 2–5 favours granuloma/macrophage penetration (bedaquiline 7.3, delamanid 5.6, rifampicin 4.0)",
    bucket: "drugLikeness",
    unit: "",
    direction: "range",
    format: (v) => v.toFixed(2),
    classify: (v) =>
      between(v, 2, 5) ? "good" : between(v, 1, 6) ? "caution" : "risk",
  },
  {
    key: "tpsa",
    label: "TPSA",
    description: "Topological polar surface area. Oral: ≤140 Å²",
    bucket: "drugLikeness",
    unit: "Å²",
    direction: "lower-better",
    format: (v) => v.toFixed(1),
    classify: (v) => (v <= 140 ? "good" : v <= 180 ? "caution" : "risk"),
  },
  {
    key: "hydrogen_bond_donors",
    label: "H-bond Donors",
    description: "Lipinski cut-off: ≤5",
    bucket: "drugLikeness",
    unit: "",
    direction: "lower-better",
    format: (v) => v.toFixed(0),
    classify: (v) => (v <= 5 ? "good" : v <= 7 ? "caution" : "risk"),
  },
  {
    key: "hydrogen_bond_acceptors",
    label: "H-bond Acceptors",
    description: "Lipinski cut-off: ≤10",
    bucket: "drugLikeness",
    unit: "",
    direction: "lower-better",
    format: (v) => v.toFixed(0),
    classify: (v) => (v <= 10 ? "good" : v <= 12 ? "caution" : "risk"),
  },
  {
    key: "Solubility_AqSolDB",
    label: "Aqueous Solubility (logS)",
    description: "log mol/L. >-4 = soluble; <-6 = poorly soluble",
    bucket: "drugLikeness",
    unit: "log mol/L",
    direction: "higher-better",
    format: (v) => v.toFixed(2),
    classify: (v) => (v > -4 ? "good" : v > -6 ? "caution" : "risk"),
  },
  {
    key: "Lipophilicity_AstraZeneca",
    label: "Lipophilicity (logD)",
    description:
      "Distribution coefficient at physiological pH. TB-tuned: 1–4 (AbbVie AB-MPS optimal ≈ 3 for oral exposure)",
    bucket: "drugLikeness",
    unit: "",
    direction: "range",
    format: (v) => v.toFixed(2),
    classify: (v) =>
      between(v, 1, 4) ? "good" : between(v, 0, 5) ? "caution" : "risk",
  },
  {
    key: "HydrationFreeEnergy_FreeSolv",
    label: "Hydration Free Energy",
    description: "kcal/mol. More negative = more polar/hydrated",
    bucket: "drugLikeness",
    unit: "kcal/mol",
    direction: "info",
    format: (v) => v.toFixed(2),
    classify: () => "info",
  },
  {
    key: "stereo_centers",
    label: "Stereo Centers",
    description: "Synthetic complexity proxy. ≤2 keeps SAR tractable",
    bucket: "drugLikeness",
    unit: "",
    direction: "lower-better",
    format: (v) => v.toFixed(0),
    classify: (v) => (v <= 2 ? "good" : v <= 4 ? "caution" : "risk"),
  },

  // ---------- Absorption ----------
  {
    key: "HIA_Hou",
    label: "Human Intestinal Absorption",
    description: "Probability of >30% absorption. >0.7 = likely absorbed",
    bucket: "absorption",
    unit: "prob",
    direction: "higher-better",
    format: (v) => v.toFixed(2),
    classify: (v) => (v > 0.7 ? "good" : v > 0.5 ? "caution" : "risk"),
  },
  {
    key: "Bioavailability_Ma",
    label: "Oral Bioavailability",
    description: "Probability of F ≥ 50%. Critical for oral TB regimens",
    bucket: "absorption",
    unit: "prob",
    direction: "higher-better",
    format: (v) => v.toFixed(2),
    classify: (v) => (v > 0.7 ? "good" : v > 0.5 ? "caution" : "risk"),
  },
  {
    key: "PAMPA_NCATS",
    label: "PAMPA Permeability",
    description: "Probability of passive membrane permeability",
    bucket: "absorption",
    unit: "prob",
    direction: "higher-better",
    format: (v) => v.toFixed(2),
    classify: (v) => (v > 0.7 ? "good" : v > 0.5 ? "caution" : "risk"),
  },
  {
    key: "Caco2_Wang",
    label: "Caco-2 Permeability",
    description: "log Papp (cm/s). > −5.15 = high permeability",
    bucket: "absorption",
    unit: "log cm/s",
    direction: "higher-better",
    format: (v) => v.toFixed(2),
    classify: (v) => (v > -5.15 ? "good" : v > -6 ? "caution" : "risk"),
  },
  {
    key: "Pgp_Broccatelli",
    label: "P-gp Substrate",
    description: "Probability of P-glycoprotein efflux. Lower = better absorption",
    bucket: "absorption",
    unit: "prob",
    direction: "lower-better",
    format: (v) => v.toFixed(2),
    classify: (v) => (v < 0.3 ? "good" : v < 0.5 ? "caution" : "risk"),
  },

  // ---------- Distribution ----------
  {
    key: "BBB_Martins",
    label: "Blood-Brain Barrier",
    description:
      "Probability of BBB penetration. Informational: desirable only for CNS targets (TB meningitis)",
    bucket: "distribution",
    unit: "prob",
    direction: "info",
    format: (v) => v.toFixed(2),
    classify: () => "info",
  },
  {
    key: "PPBR_AZ",
    label: "Plasma Protein Binding",
    description: "% bound. >99% = very little free drug at target",
    bucket: "distribution",
    unit: "%",
    direction: "lower-better",
    format: (v) => v.toFixed(1),
    classify: (v) => (v < 90 ? "good" : v < 99 ? "caution" : "risk"),
  },
  {
    key: "VDss_Lombardo",
    label: "Volume of Distribution (Vdss)",
    description:
      "log L/kg. Informational for TB. High VDss is desirable for tissue/granuloma partitioning (bedaquiline ≈ +2.2)",
    bucket: "distribution",
    unit: "log L/kg",
    direction: "info",
    format: (v) => v.toFixed(2),
    classify: () => "info",
  },

  // ---------- Metabolism (DDI) ----------
  {
    key: "CYP3A4_Veith",
    label: "CYP3A4 Inhibition",
    description:
      "Probability of inhibition. Critical for HIV co-meds (PIs, NNRTIs). Lower = safer",
    bucket: "metabolism",
    unit: "prob",
    direction: "lower-better",
    format: (v) => v.toFixed(2),
    classify: (v) => (v < 0.3 ? "good" : v < 0.6 ? "caution" : "risk"),
  },
  {
    key: "CYP2D6_Veith",
    label: "CYP2D6 Inhibition",
    description: "Probability of CYP2D6 inhibition",
    bucket: "metabolism",
    unit: "prob",
    direction: "lower-better",
    format: (v) => v.toFixed(2),
    classify: (v) => (v < 0.3 ? "good" : v < 0.6 ? "caution" : "risk"),
  },
  {
    key: "CYP2C9_Veith",
    label: "CYP2C9 Inhibition",
    description: "Probability of CYP2C9 inhibition",
    bucket: "metabolism",
    unit: "prob",
    direction: "lower-better",
    format: (v) => v.toFixed(2),
    classify: (v) => (v < 0.3 ? "good" : v < 0.6 ? "caution" : "risk"),
  },
  {
    key: "CYP2C19_Veith",
    label: "CYP2C19 Inhibition",
    description: "Probability of CYP2C19 inhibition",
    bucket: "metabolism",
    unit: "prob",
    direction: "lower-better",
    format: (v) => v.toFixed(2),
    classify: (v) => (v < 0.3 ? "good" : v < 0.6 ? "caution" : "risk"),
  },
  {
    key: "CYP1A2_Veith",
    label: "CYP1A2 Inhibition",
    description: "Probability of CYP1A2 inhibition",
    bucket: "metabolism",
    unit: "prob",
    direction: "lower-better",
    format: (v) => v.toFixed(2),
    classify: (v) => (v < 0.3 ? "good" : v < 0.6 ? "caution" : "risk"),
  },
  {
    key: "CYP3A4_Substrate_CarbonMangels",
    label: "CYP3A4 Substrate",
    description: "Probability of being CYP3A4 substrate (informational)",
    bucket: "metabolism",
    unit: "prob",
    direction: "info",
    format: (v) => v.toFixed(2),
    classify: () => "info",
  },
  {
    key: "CYP2D6_Substrate_CarbonMangels",
    label: "CYP2D6 Substrate",
    description: "Probability of being CYP2D6 substrate (informational)",
    bucket: "metabolism",
    unit: "prob",
    direction: "info",
    format: (v) => v.toFixed(2),
    classify: () => "info",
  },
  {
    key: "CYP2C9_Substrate_CarbonMangels",
    label: "CYP2C9 Substrate",
    description: "Probability of being CYP2C9 substrate (informational)",
    bucket: "metabolism",
    unit: "prob",
    direction: "info",
    format: (v) => v.toFixed(2),
    classify: () => "info",
  },

  // ---------- Excretion / PK ----------
  {
    key: "Half_Life_Obach",
    label: "Half-Life",
    description:
      "Hours. TB-tuned: 8–72 h supports QD dosing and is often beneficial for long-duration TB therapy (bedaquiline terminal t½ ~5 months in tissue)",
    bucket: "excretion",
    unit: "h",
    direction: "range",
    format: (v) => v.toFixed(1),
    classify: (v) =>
      between(v, 8, 72)
        ? "good"
        : between(v, 4, 8) || between(v, 72, 168)
          ? "caution"
          : "risk",
  },
  {
    key: "Clearance_Hepatocyte_AZ",
    label: "Hepatocyte Clearance",
    description: "µL/min/10⁶ cells. <30 = low clearance",
    bucket: "excretion",
    unit: "µL/min/10⁶",
    direction: "lower-better",
    format: (v) => v.toFixed(1),
    classify: (v) => (v < 30 ? "good" : v < 60 ? "caution" : "risk"),
  },
  {
    key: "Clearance_Microsome_AZ",
    label: "Microsomal Clearance",
    description: "µL/min/mg. <30 = low intrinsic clearance",
    bucket: "excretion",
    unit: "µL/min/mg",
    direction: "lower-better",
    format: (v) => v.toFixed(1),
    classify: (v) => (v < 30 ? "good" : v < 60 ? "caution" : "risk"),
  },

  // ---------- Toxicity ----------
  {
    key: "hERG",
    label: "hERG Blockade",
    description:
      "Cardiotoxicity (QT prolongation). Kill-criterion in TB; bedaquiline, delamanid all flagged here",
    bucket: "toxicity",
    unit: "prob",
    direction: "lower-better",
    format: (v) => v.toFixed(2),
    classify: (v) => (v < 0.3 ? "good" : v < 0.5 ? "caution" : "risk"),
  },
  {
    key: "DILI",
    label: "Drug-Induced Liver Injury",
    description:
      "Hepatotoxicity. Major TB-drug failure mode (INH, RIF, PZA all hepatotoxic)",
    bucket: "toxicity",
    unit: "prob",
    direction: "lower-better",
    format: (v) => v.toFixed(2),
    classify: (v) => (v < 0.3 ? "good" : v < 0.5 ? "caution" : "risk"),
  },
  {
    key: "AMES",
    label: "Mutagenicity (AMES)",
    description: "Probability of AMES positive. Genotoxicity flag",
    bucket: "toxicity",
    unit: "prob",
    direction: "lower-better",
    format: (v) => v.toFixed(2),
    classify: (v) => (v < 0.3 ? "good" : v < 0.5 ? "caution" : "risk"),
  },
  {
    key: "Carcinogens_Lagunin",
    label: "Carcinogenicity",
    description: "Probability of carcinogenic potential",
    bucket: "toxicity",
    unit: "prob",
    direction: "lower-better",
    format: (v) => v.toFixed(2),
    classify: (v) => (v < 0.3 ? "good" : v < 0.5 ? "caution" : "risk"),
  },
  {
    key: "ClinTox",
    label: "Clinical Toxicity",
    description: "Probability of FDA clinical-trial toxicity failure",
    bucket: "toxicity",
    unit: "prob",
    direction: "lower-better",
    format: (v) => v.toFixed(2),
    classify: (v) => (v < 0.3 ? "good" : v < 0.5 ? "caution" : "risk"),
  },
  {
    key: "LD50_Zhu",
    label: "Acute Oral Toxicity (LD50)",
    description: "-log mol/kg. Higher = less acutely toxic",
    bucket: "toxicity",
    unit: "-log mol/kg",
    direction: "higher-better",
    format: (v) => v.toFixed(2),
    classify: (v) => (v > 2.5 ? "good" : v > 2.0 ? "caution" : "risk"),
  },
  {
    key: "Skin_Reaction",
    label: "Skin Sensitization",
    description: "Probability of skin reaction",
    bucket: "toxicity",
    unit: "prob",
    direction: "lower-better",
    format: (v) => v.toFixed(2),
    classify: (v) => (v < 0.3 ? "good" : v < 0.5 ? "caution" : "risk"),
  },
  {
    key: "PAINS_alert",
    label: "PAINS Alert",
    description: "Pan-assay interference structural alert (0 = clean)",
    bucket: "toxicity",
    unit: "flag",
    direction: "lower-better",
    format: (v) => (v ? "1 (flagged)" : "0 (clean)"),
    classify: (v) => (v ? "risk" : "good"),
  },
  {
    key: "BRENK_alert",
    label: "Brenk Alert",
    description: "Brenk substructure alert (0 = clean)",
    bucket: "toxicity",
    unit: "flag",
    direction: "lower-better",
    format: (v) => (v ? "1 (flagged)" : "0 (clean)"),
    classify: (v) => (v ? "risk" : "good"),
  },
  {
    key: "NIH_alert",
    label: "NIH Alert",
    description: "NIH MLSMR exclusion structural alert (0 = clean)",
    bucket: "toxicity",
    unit: "flag",
    direction: "lower-better",
    format: (v) => (v ? "1 (flagged)" : "0 (clean)"),
    classify: (v) => (v ? "risk" : "good"),
  },

  // ---------- Tox21 panel (collapsed under toxicity, classified) ----------
  ...[
    ["NR-AR", "Androgen Receptor"],
    ["NR-AR-LBD", "Androgen Receptor (LBD)"],
    ["NR-AhR", "Aryl Hydrocarbon Receptor"],
    ["NR-Aromatase", "Aromatase"],
    ["NR-ER", "Estrogen Receptor"],
    ["NR-ER-LBD", "Estrogen Receptor (LBD)"],
    ["NR-PPAR-gamma", "PPAR-gamma"],
    ["SR-ARE", "ARE Stress Response"],
    ["SR-ATAD5", "ATAD5 Genotoxicity"],
    ["SR-HSE", "Heat Shock Response"],
    ["SR-MMP", "Mitochondrial Membrane Potential"],
    ["SR-p53", "p53 Stress Response"],
  ].map(([key, label]) => ({
    key,
    label: `Tox21 · ${label}`,
    description: "Tox21 panel endpoint. Probability of activity",
    bucket: "toxicity",
    unit: "prob",
    direction: "lower-better",
    format: (v) => v.toFixed(2),
    classify: (v) => (v < 0.3 ? "good" : v < 0.5 ? "caution" : "risk"),
  })),
];

// Group properties by bucket once at module load.
export const propertiesByBucket = ADMET_BUCKETS.reduce((acc, b) => {
  acc[b.id] = ADMET_PROPERTIES.filter((p) => p.bucket === b.id);
  return acc;
}, {});

// Compute per-bucket verdict + the names of the offending properties.
export const bucketVerdict = (bucketId, predictions) => {
  const props = propertiesByBucket[bucketId] ?? [];
  let worst = "good";
  const flagged = [];
  for (const p of props) {
    const v = predictions?.[p.key];
    if (v === undefined || v === null) continue;
    const sev = p.classify(v);
    if (SEVERITY_RANK[sev] > SEVERITY_RANK[worst]) worst = sev;
    if (sev === "risk" || sev === "caution") {
      flagged.push({ label: p.label, severity: sev, value: p.format(v) });
    }
  }
  // surface risk first, then cautions, in the tooltip
  flagged.sort((a, b) => SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity]);
  return { severity: worst, flagged };
};

// --- Radar ------------------------------------------------------------------
// Mirrors the canonical ADMET-AI summary radar: 5 axes, percentile vs the
// ~2,579 DrugBank-approved drugs, scale 0–100. For lower-is-safer properties
// (BBB, hERG, ClinTox) we plot 100 − percentile so outward always = better.
export const RADAR_AXES = [
  {
    label: "Blood-Brain Barrier Safe",
    key: "BBB_Martins_drugbank_approved_percentile",
    invert: true,
    description:
      "Probability the molecule does not cross the blood-brain barrier (1 − BBB Penetration percentile).",
  },
  {
    label: "hERG Safe",
    key: "hERG_drugbank_approved_percentile",
    invert: true,
    description:
      "Probability the molecule does not block the hERG channel (1 − hERG Blocking percentile).",
  },
  {
    label: "Bioavailable",
    key: "Bioavailability_Ma_drugbank_approved_percentile",
    invert: false,
    description:
      "Probability the molecule is orally bioavailable (Oral Bioavailability percentile).",
  },
  {
    label: "Soluble",
    key: "Solubility_AqSolDB_drugbank_approved_percentile",
    invert: false,
    description: "Aqueous solubility of the molecule (Aqueous Solubility percentile).",
  },
  {
    label: "Non-Toxic",
    key: "ClinTox_drugbank_approved_percentile",
    invert: true,
    description:
      "Probability the molecule would not show clinical toxicity (1 − ClinTox percentile).",
  },
];

export const radarSeries = (predictions) =>
  RADAR_AXES.map((a) => {
    const pct = predictions?.[a.key];
    if (pct === undefined || pct === null || Number.isNaN(pct)) return 0;
    return a.invert ? 100 - pct : pct;
  });
