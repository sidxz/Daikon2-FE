import exportToExcel from "../../../../../../../Shared/Excel/ExportToExcel";

export const ExportTemplateExcel = (
  selectedHitCollection,
  selectedScreen,
  headerMapper = {}
) => {
  // Define the headers for the template

  // Generate an empty data structure based on headers
  const jsonData = [
    {
      smiles: "",
      library: "",
      librarySource: "",
      moleculeName: "",
      iC50: "",
      mic: "",
      clusterGroup: "",
    },
  ]; // No data, just headers for the template

  // Construct a default file name
  const fileName = "TargetBased_Hits_Template";

  // Call the exportToExcel function with the constructed parameters
  return exportToExcel({
    includeId: false,
    jsonData,
    fileName,
    headerMap: headerMapper,
  });
};
