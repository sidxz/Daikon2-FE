export const DtFieldsToExcelColumnMapping =
  // Map Data fields to column names of excel sheet
  {
    assayType: "Assay Type",
    clusterGroup: "Cluster Group",
    eC50: "EC50",
    eC50Unit: "EC50 Unit",
    gI50: "GI50",
    gI50Unit: "GI50 Unit",
    iC50: "IC50",
    iC50Unit: "IC50 Unit",
    kd: "Kd",
    kdUnit: "Kd Unit",
    ki: "Ki",
    kiUnit: "Ki Unit",
    lD50: "LD50",
    lD50Unit: "LD50 Unit",

    library: "Library",
    librarySource: "Source",
    miC90: "MIC90",
    miC90Unit: "MIC90 Unit",
    miC90Condition: "MIC90 Condition",
    mic: "MIC",
    micUnit: "MIC Unit",
    micCondition: "MIC Condition",
    tgi: "TGI",
    tgiUnit: "TGI Unit",
    pctInhibition: "%Inh",
    pctInhibitionConcentration: "%Inh Conc",
    pctInhibitionConcentrationUnit: "%Inh Conc Unit",

    moleculeName: "Molecule Name",
    smiles: "SMILES",
    notes: "Notes",

    response: "Response",
    responseUnit: "Response Unit",
    concentration: "Concentration",
    concentrationUnit: "Concentration Unit",
    isControl: "Is Control",
    responseType: "Response Type",
    timePoint: "Time Point",
    comment: "Comment",
  };

export const DtFieldsGroupedColumnMapping =
  // Map Data fields to column names of excel sheet
  {
    assayType: "Assay Type",
    clusterGroup: "Cluster Group",
    eC50: "EC50",
    eC50Unit: "EC50 Unit",
    gI50: "GI50",
    gI50Unit: "GI50 Unit",
    iC50: "IC50",
    iC50Unit: "IC50 Unit",
    kd: "Kd",
    kdUnit: "Kd Unit",
    ki: "Ki",
    kiUnit: "Ki Unit",
    lD50: "LD50",
    lD50Unit: "LD50 Unit",

    library: "Library",
    librarySource: "Source",
    miC90: "MIC90",
    miC90Unit: "MIC90 Unit",
    mic: "MIC",
    micUnit: "MIC Unit",
    micCondition: "MIC Condition",
    tgi: "TGI",
    tgiUnit: "TGI Unit",
    pctInhibition: "% Inhibition",
    pctInhibitionConcentration: "Concentration for % Inhibition",
    pctInhibitionConcentrationUnit: "Concentration Unit for % Inhibition",

    moleculeName: "Molecule Name",
    smiles: "SMILES",
    notes: "Notes",

    doseResponses: "Dose Response",
  };

export const AllTbColumns = [
  "Structure",
  "Library",
  "Source",
  "Assay Type",
  "Cluster",
  "EC50",
  "EC50 Unit",
  "GI50",
  "GI50 Unit",
  "IC50",
  "IC50 Unit",
  "Kd",
  "Kd Unit",
  "Ki",
  "Ki Unit",
  "LD50",
  "LD50 Unit",
  "MIC90",
  "MIC90 Unit",
  "MIC90 Condition",
  "MIC",
  "MIC Unit",
  "MIC Condition",
  "TGI",
  "TGI Unit",
  "%Inh",
  "%Inh Conc",
  "%Inh Conc Unit",
  "Molecule Name",
  "Notes",
  "Dose Response",
  "Vote",
].sort();

export const TbHitsTableType = "TbHits";

export const DoseResponsesFlattener = (arr) =>
  arr
    .map(
      (dp) =>
        `${dp.concentration} ${dp.concentrationUnit} /${dp.response} ${dp.responseUnit}`
    )
    .join("; ");
