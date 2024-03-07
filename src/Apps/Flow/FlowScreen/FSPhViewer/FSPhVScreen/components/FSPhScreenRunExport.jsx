import { toast } from "react-toastify";
import exportToExcel from "../../../../../../Shared/Excel/ExportToExcel";

export const ExportScreenRunsToExcel = (selectedScreen, headerMapper = {}) => {
  // Ensure selectedScreen and its screenRuns are defined
  if (!selectedScreen || !Array.isArray(selectedScreen.screenRuns)) {
    console.error("Invalid Screen collection provided.");
    return;
  }

  if (selectedScreen.screenRuns.length === 0) {
    console.error("No screen runs to export.");
    toast.error("There are no screen runs to export.");
    return;
  }

  // Map and flatten the hit objects for Excel export
  const jsonData = selectedScreen.screenRuns.map((screenRun) => ({
    id: screenRun.id,
    screenId: screenRun.screenId,
    library: screenRun?.library,
    librarySize: screenRun?.librarySize,
    protocol: screenRun?.protocol,
    noOfCompoundsScreened: screenRun?.noOfCompoundsScreened,
    scientist: screenRun?.scientist,
    startDate: screenRun?.startDate,
    endDate: screenRun?.endDate,
    primaryHitCount: screenRun?.primaryHitCount,
    confirmedHitCount: screenRun?.confirmedHitCount,
    hitRate: screenRun?.hitRate,
    notes: screenRun?.notes,
  }));

  // Construct the file name using template literals
  const fileName = `${selectedScreen?.name ?? "Screen"}`;

  // Call the exportToExcel function with the constructed parameters
  return exportToExcel({
    jsonData,
    fileName,
    headerMap: headerMapper,
  });
};
