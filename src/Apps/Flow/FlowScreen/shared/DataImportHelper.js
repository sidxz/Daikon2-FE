export function GroupMolecules(data) {
  const grouped = data.reduce((acc, item) => {
    const key =
      item.assayType != null && item.assayType !== ""
        ? `${item.moleculeName}__${item.assayType}`
        : item.moleculeName;
    //const key = item.moleculeName;

    if (!acc[key]) {
      acc[key] = {
        id: item.id,
        assayType: "",
        eC50: "",
        eC50Unit: "",
        gI50: "",
        gI50Unit: "",
        kd: "",
        kdUnit: "",
        ki: "",
        kiUnit: "",
        lD50: "",
        lD50Unit: "",
        miC90: "",
        miC90Unit: "",
        miC90Condition: "",
        tgi: "",
        tgiUnit: "",
        mic: "",
        micUnit: "",
        micCondition: "",
        moleculeName: "",
        smiles: "",
        library: "",
        librarySource: "",
        iC50: "",
        iC50Unit: "",
        pctInhibition: "",
        pctInhibitionConcentration: "",
        pctInhibitionConcentrationUnit: "",
        clusterGroup: "",
        notes: "",
        doseResponses: [],
      };
    }

    // Fill other fields only if currently empty and new value is non-empty
    if (!acc[key].id && item.id) acc[key].id = item.id;
    if (!acc[key].moleculeName && item.moleculeName)
      acc[key].moleculeName = item.moleculeName;
    if (!acc[key].assayType && item.assayType)
      acc[key].assayType = item.assayType;
    if (!acc[key].smiles && item.smiles) acc[key].smiles = item.smiles;
    if (!acc[key].library && item.library) acc[key].library = item.library;
    if (!acc[key].notes && item.notes) acc[key].notes = item.notes;
    if (!acc[key].librarySource && item.librarySource)
      acc[key].librarySource = item.librarySource;
    if (!acc[key].clusterGroup && item.clusterGroup)
      acc[key].clusterGroup = item.clusterGroup;
    if (!acc[key].eC50 && item.eC50) acc[key].eC50 = item.eC50;
    if (!acc[key].eC50Unit && item.eC50Unit) acc[key].eC50Unit = item.eC50Unit;
    if (!acc[key].gI50 && item.gI50) acc[key].gI50 = item.gI50;
    if (!acc[key].gI50Unit && item.gI50Unit) acc[key].gI50Unit = item.gI50Unit;
    if (!acc[key].iC50 && item.iC50) acc[key].iC50 = item.iC50;
    if (!acc[key].iC50Unit && item.iC50Unit) acc[key].iC50Unit = item.iC50Unit;
    if (!acc[key].kd && item.kd) acc[key].kd = item.kd;
    if (!acc[key].kdUnit && item.kdUnit) acc[key].kdUnit = item.kdUnit;
    if (!acc[key].ki && item.ki) acc[key].ki = item.ki;
    if (!acc[key].kiUnit && item.kiUnit) acc[key].kiUnit = item.kiUnit;
    if (!acc[key].lD50 && item.lD50) acc[key].lD50 = item.lD50;
    if (!acc[key].lD50Unit && item.lD50Unit) acc[key].lD50Unit = item.lD50Unit;
    if (!acc[key].miC90 && item.miC90) acc[key].miC90 = item.miC90;
    if (!acc[key].miC90Unit && item.miC90Unit)
      acc[key].miC90Unit = item.miC90Unit;
    if (!acc[key].miC90Condition && item.miC90Condition)
      acc[key].miC90Condition = item.miC90Condition;
    if (!acc[key].tgi && item.tgi) acc[key].tgi = item.tgi;
    if (!acc[key].tgiUnit && item.tgiUnit) acc[key].tgiUnit = item.tgiUnit;
    if (!acc[key].mic && item.mic) acc[key].mic = item.mic;
    if (!acc[key].micUnit && item.micUnit) acc[key].micUnit = item.micUnit;
    if (!acc[key].micCondition && item.micCondition)
      acc[key].micCondition = item.micCondition;
    if (!acc[key].pctInhibition && item.pctInhibition)
      acc[key].pctInhibition = item.pctInhibition;
    if (!acc[key].pctInhibitionConcentration && item.pctInhibitionConcentration)
      acc[key].pctInhibitionConcentration = item.pctInhibitionConcentration;
    if (
      !acc[key].pctInhibitionConcentrationUnit &&
      item.pctInhibitionConcentrationUnit
    )
      acc[key].pctInhibitionConcentrationUnit =
        item.pctInhibitionConcentrationUnit;

    // Validate concentration and inhibition before pushing
    const concentration = item?.concentration
      ? Number(item.concentration)
      : null;
    const concentrationUnit = item?.concentrationUnit || null;
    const responseType = item.responseType || null;
    const responseUnit = item.responseUnit || null;
    const isControl = item.isControl || null;
    const timePoint = item.timePoint || null;
    const comment = item?.comment || null;
    const response = item?.response ? Number(item.response) : null;

    if (
      concentration != null &&
      response != null &&
      !isNaN(concentration) &&
      !isNaN(response)
    ) {
      const doseResponse = {};
      doseResponse.concentration = concentration;
      doseResponse.response = response;

      if (concentrationUnit) doseResponse.concentrationUnit = concentrationUnit;
      if (responseType) doseResponse.responseType = responseType;
      if (responseUnit) doseResponse.responseUnit = responseUnit;
      if (isControl != null) doseResponse.isControl = isControl; // include even if false
      if (timePoint) doseResponse.timePoint = timePoint;
      if (comment) doseResponse.comment = comment;

      acc[key].doseResponses.push(doseResponse);
    }

    return acc;
  }, {});

  return Object.values(grouped);
}
