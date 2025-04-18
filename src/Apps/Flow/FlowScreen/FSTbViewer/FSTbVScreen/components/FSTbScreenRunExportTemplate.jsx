import exportToExcel from "../../../../../../Shared/Excel/ExportToExcel";

export const ExportTemplateExcel = (selectedScreen, headerMapper = {}) => {
  // Define the headers for the template

  // Generate an empty data structure based on headers
  const jsonData = [
    {
      library: "",
      protocol: "",
      concentration: "",
      noOfCompoundsScreened: "",
      scientist: "",
      startDate: "",
      endDate: "",
      primaryHitCount: "",
      confirmedHitCount: "",
      notes: "",
    },
  ]; // No data, just headers for the template

  // Construct a default file name
  const fileName = "TargetBased_ScreenRuns_Template";

  // Call the exportToExcel function with the constructed parameters
  return exportToExcel({
    includeId: false,
    jsonData,
    fileName,
    headerMap: headerMapper,
  });
};
