import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// Improved function for exporting JSON data to an Excel file
const exportToExcel = async ({
  jsonData = [],
  fileName = "Data",
  sheetName = "Sheet1",
  headerMap = null,
  includeId = true,
}) => {
  // Exit function if no data is provided
  if (jsonData.length === 0) return;

  // Prepare header map if includeId is true
  const effectiveHeaderMap =
    includeId && headerMap ? { id: "Id", ...headerMap } : headerMap;

  // Instantiate a new Excel workbook and add a worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  // Determine headers either from headerMap or the first item keys
  const headers = effectiveHeaderMap
    ? Object.values(effectiveHeaderMap)
    : Object.keys(jsonData[0]);
  if (headers.length > 0) {
    worksheet.addRow(headers);
  }

  // Process each data item
  jsonData.forEach((item) => {
    const row = effectiveHeaderMap
      ? Object.keys(effectiveHeaderMap).map((key) => item[key])
      : Object.values(item);
    worksheet.addRow(row);
  });

  try {
    // Generate Excel file as a Blob and trigger download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${fileName}.xlsx`);
  } catch (error) {
    console.error("Error generating Excel file:", error);
  }
};

export default exportToExcel;
