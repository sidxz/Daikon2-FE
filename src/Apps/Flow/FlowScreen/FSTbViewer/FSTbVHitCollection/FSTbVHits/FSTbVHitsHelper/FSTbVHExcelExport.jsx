import { toast } from "react-toastify";
import exportToExcel from "../../../../../../../Shared/Excel/ExportToExcel";

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
  const jsonData = selectedHitCollection.hits.map((hit) => ({
    id: hit.id,
    smiles: hit.molecule?.smiles ?? "",
    library: hit.library ?? "",
    source: hit.librarySource ?? "",
    name: hit.molecule?.name ?? "",
    iC50: hit.iC50 ?? "",
    mic: hit.mic ?? "",
    cluster: hit.clusterGroup ?? "",
  }));

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
