export const getUniqueMoleculeNames = (rowData) => {
  // Get the molecule name and synonyms
  const moleculeName = rowData?.molecule?.name || null;
  const moleculeSynonyms = rowData?.molecule?.synonyms
    ? rowData.molecule.synonyms.split(",").map((s) => s.trim())
    : [];

  // Combine the name and synonyms
  const allNames = moleculeName
    ? [moleculeName, ...moleculeSynonyms]
    : moleculeSynonyms;

  // Create a set to remove duplicates and return as a string
  const uniqueNames = [...new Set(allNames)];

  // If there are no unique names, return requestedMoleculeName
  return uniqueNames.length > 0
    ? uniqueNames.join(", ")
    : rowData?.requestedMoleculeName || "";
};
