import { toJS } from "mobx";
import { toast } from "react-toastify";
import exportToExcel from "../../../../../../../Shared/Excel/ExportToExcel";

export function UngroupMolecules(groupedData) {
  const ungrouped = [];

  groupedData.forEach((group) => {
    const { doseResponses = [], ...sharedFields } = group;

    if (doseResponses.length === 0) {
      ungrouped.push({
        ...sharedFields,
        // Fill with blank/default dose response fields
        concentration: "",
        concentrationUnit: "",
        response: "",
        responseUnit: "",
        responseType: "",
        isControl: "",
        timePoint: "",
        comment: "",
      });
    } else {
      doseResponses.forEach((dose) => {
        ungrouped.push({
          ...sharedFields,
          ...dose, // This works if `dose` already contains the correct keys
        });
      });
    }
  });

  return ungrouped;
}

export const ExportHitsToExcel = (
  selectedHitCollection = { hits: [], name: "", hitCollectionType: "" },
  selectedScreen = { name: "" },
  headerMapper = {}
) => {
  // Ensure selectedHitCollection and its hits are defined
  if (!selectedHitCollection || !Array.isArray(selectedHitCollection.hits)) {
    console.error("Invalid hit collection provided.");
    return;
  }

  if (selectedHitCollection.hits.length === 0) {
    console.error("No hits to export.");
    toast.error("There are no hits to export.");
    return;
  }

  // Map and flatten the hit objects for Excel export

  const groupedHits = toJS(selectedHitCollection.hits);
  console.log("groupedHits", groupedHits);
  const ungroupedHits = UngroupMolecules(groupedHits);
  console.log("ungroupedHits", ungroupedHits);

  ungroupedHits.map((hit) => {
    // Ensure each hit has a unique ID
    console.log("hit", hit);
  });

  const jsonData = ungroupedHits.map((hit) => ({
    ...hit,
    id: hit.id,
    smiles: hit.molecule?.smiles ?? "",
    moleculeName: hit.molecule?.name ?? "",
  }));

  console.log("jsonData", jsonData);

  // Construct the file name using template literals
  const fileName = `${selectedScreen?.name ?? "Screen"}-${
    selectedHitCollection.name
  }-${selectedHitCollection.hitCollectionType}`;

  // Call the exportToExcel function with the constructed parameters
  return exportToExcel({
    jsonData,
    fileName,
    headerMap: headerMapper,
  });
};
