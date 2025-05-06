export function GroupMolecules(data) {
  const grouped = data.reduce((acc, item) => {
    const key = item.moleculeName;

    if (!acc[key]) {
      acc[key] = {
        id: item.id,
        moleculeName: item.moleculeName,
        smiles: "",
        library: "",
        librarySource: "",
        iC50: "",
        mic: "",
        clusterGroup: "",
        notes: item.notes,
        doseResponses: [],
      };
    }

    // Fill other fields only if currently empty and new value is non-empty
    if (!acc[key].id && item.id) acc[key].id = item.id;
    if (!acc[key].smiles && item.smiles) acc[key].smiles = item.smiles;
    if (!acc[key].library && item.library) acc[key].library = item.library;
    if (!acc[key].notes && item.notes) acc[key].notes = item.notes;
    if (!acc[key].librarySource && item.librarySource)
      acc[key].librarySource = item.librarySource;
    if (!acc[key].iC50 && item.iC50) acc[key].iC50 = item.iC50;
    if (!acc[key].mic && item.mic) acc[key].mic = item.mic;
    if (!acc[key].clusterGroup && item.clusterGroup)
      acc[key].clusterGroup = item.clusterGroup;

    // Validate concentration and inhibition before pushing
    const concentration = Number(item.concentration);
    const response = Number(item.response);

    if (!isNaN(concentration) && !isNaN(response)) {
      acc[key].doseResponses.push({
        concentration,
        response,
      });
    }

    return acc;
  }, {});

  return Object.values(grouped);
}
