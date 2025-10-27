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

/**
 * Check if an imported row matches an existing molecule
 * by comparing name, requestedName, or synonyms.
 *
 * @param {object} row - Row from Excel (imported hit).
 * @param {object} existing - Existing hit object with molecule info.
 * @returns {boolean} - True if row matches existing molecule.
 */
export function isSameMoleculeName(row, existing) {
  if (!row || !existing?.molecule) return false;

  const rowNames = [row.moleculeName?.trim()].filter(Boolean);

  const existingNames = [
    existing.molecule?.name?.trim(),
    existing.requestedMoleculeName?.trim(),
    ...(existing.molecule?.synonyms
      ? existing.molecule.synonyms.split(",").map((s) => s.trim())
      : []),
  ].filter(Boolean);

  // Case-insensitive comparison
  return rowNames.some((rn) =>
    existingNames.some((en) => rn?.toLowerCase() === en?.toLowerCase())
  );
}
