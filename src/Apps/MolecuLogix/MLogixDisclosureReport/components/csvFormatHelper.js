import ExcelJS from "exceljs";
import _ from "lodash";
import { formatBioActivity } from "../../Library/Relationships/BioActivity";

/** Safe date -> yyyy-mm-dd (or empty) */
const fmtDate = (ts) => {
  if (!ts) return "";
  try {
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return "";
    // make stable, sort-friendly date
    return d.toISOString().slice(0, 10);
  } catch {
    return "";
  }
};

/** Flatten Relationships to a readable string */
const fmtRelationships = (associations = [], getOrgAliasById) => {
  if (!Array.isArray(associations) || associations.length === 0) return "";

  const propertiesToInclude = [
    "stage",
    "screenType",
    "status",
    "orgId",
    "relationship",
  ];

  const parts = associations.map((item) => {
    const filtered = _.pick(item?.nodeProperties || {}, propertiesToInclude);

    // orgId -> org alias
    if (filtered.orgId) {
      filtered.org = getOrgAliasById(filtered.orgId) || "Unknown Org";
      delete filtered.orgId;
    }

    const props = Object.entries(filtered)
      .filter(([, v]) => v != null && String(v).trim() !== "")
      .map(([k, v]) => `${_.startCase(k)}: ${_.startCase(String(v))}`)
      .join(", ");

    const head = [_.startCase(item?.nodeType || ""), item?.nodeName]
      .filter(Boolean)
      .join(" - ");

    return props ? `${head} (${props})` : head;
  });

  return parts.join(" ; ");
};

/** Aggregate + format bioactivity like your UI */
const fmtBioActivityAll = (row) => {
  const hits = Array.isArray(row?.hits) ? row.hits : [];
  const has = Array.isArray(row?.haCompoundEvolutions)
    ? row.haCompoundEvolutions
    : [];
  const projects = Array.isArray(row?.projectCompoundEvolution)
    ? row.projectCompoundEvolution
    : [];

  const all = [
    ...hits.flatMap((h) => formatBioActivity(h)),
    ...has.flatMap((h) => formatBioActivity(h)),
    ...projects.flatMap((p) => formatBioActivity(p)),
  ];

  if (all.length === 0) return "";

  // "IC50: 12 nM ; MIC: 1 µg/mL @ 24h" etc.
  return all.map((a) => `${a.label}: ${a.value}`).join(" ; ");
};

/**
 * Turn your complex rows into flat, formatted export rows.
 * Columns match your table headers and use the same formatting logic.
 */
export const formatMDRRowsForExport = (
  rows,
  { DVariableResolver, getOrgAliasById }
) => {
  if (!Array.isArray(rows)) return [];

  return rows.map((r) => ({
    // You can swap SMILES with compoundId if you prefer
    Structure: r?.smiles || "",
    Name: DVariableResolver?.(r?.name) ?? "",
    Organization: getOrgAliasById?.(r?.disclosureOrgId) ?? "",
    "Scientist Name": r?.disclosureScientist ?? "",
    "Disclosed Date": fmtDate(r?.structureDisclosedDate),
    Stage: r?.stage ?? "",
    "Disclosure Reason": r?.disclosureReason ?? "",
    Relations: fmtRelationships(r?.horizonRelations, getOrgAliasById),
    Bioactivity: fmtBioActivityAll(r),
    "Disclosure Notes": r?.disclosureNotes ?? "",
    "Literature References": Array.isArray(r?.literatureReferences)
      ? r.literatureReferences.join(" ; ")
      : r?.literatureReferences ?? "",
  }));
};

const escapeCsv = (v) => {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export const downloadCsv = (rows, filename = "MDR_Table.csv") => {
  if (!rows || rows.length === 0) return;

  const headers = Object.keys(rows[0]);
  const lines = [
    headers.map(escapeCsv).join(","), // header line
    ...rows.map((r) => headers.map((h) => escapeCsv(r[h])).join(",")),
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const downloadExcel = async (rows, filename = "MDR_Table.xlsx") => {
  if (!rows || rows.length === 0) return;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("MDR Table");

  // Add header row with bold style
  const headers = Object.keys(rows[0]);
  worksheet.addRow(headers);
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true };

  // Add data rows
  rows.forEach((row) => {
    worksheet.addRow(headers.map((h) => row[h] ?? ""));
  });

  // Auto-size columns
  worksheet.columns.forEach((col) => {
    let maxLength = 10;
    col.eachCell({ includeEmpty: true }, (cell) => {
      const cellValue = cell.value ? cell.value.toString() : "";
      maxLength = Math.max(maxLength, cellValue.length);
    });
    col.width = maxLength + 2;
  });

  // Save to file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
