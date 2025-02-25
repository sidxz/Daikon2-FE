import { toast } from "react-toastify";
import exportToExcel from "../../../../Shared/Excel/ExportToExcel";

export const FlowDashEventUpdatesExport = (
  mostRecentEventsRef,
  headerMapper = {}
) => {
  if (mostRecentEventsRef.length === 0) {
    console.error("No recent events to export.");
    toast.error("There are no recent events to export.");
    return;
  }

  // Map the data for Excel export
  const jsonData = mostRecentEventsRef.current.map((event) => ({
    timeStamp: event.timeStamp,
    eventType: event.eventType,
    eventMessage: event.eventMessage,
  }));

  //   // Construct the file name dynamically
  //   const fileName = `${mostRecentEventsRef?.name ?? "Recent Events"}`;

  // Call the exportToExcel function with the constructed parameters
  return exportToExcel({
    jsonData,
    fileName,
    headerMap: headerMapper,
  });
};
