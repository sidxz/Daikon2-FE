import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// Function for exporting JSON data to an Excel file
const ExportToExcel = async ({
  jsonData = [],
  fileName = "Data",
  sheetName = "Sheet1",
  headerMap = null,
  includeId = true,
}) => {
  // If no data is provided, exit function
  if (!jsonData.length) {
    return;
  }

  // If includeId is true and headerMap is provided, add id to the header map
  if (includeId && headerMap) {
    headerMap = { id: "Id", ...headerMap };
  }

  // Instantiate a new Excel workbook
  const workbook = new ExcelJS.Workbook();
  // Add a worksheet to the workbook
  const worksheet = workbook.addWorksheet(sheetName);

  // Iterate over jsonData
  jsonData.forEach((dataItem, index) => {
    // If it's the first item, derive headers from headerMap or data keys
    if (index === 0) {
      const headers = headerMap
        ? Object.keys(dataItem)
            .map((key) => headerMap[key])
            .filter((key) => key)
        : Object.keys(dataItem);
      if (headers.length > 0) {
        worksheet.addRow(headers);
      }
    }

    // Add data row to the worksheet
    const row = headerMap
      ? Object.entries(dataItem)
          .filter(([key]) => headerMap.hasOwnProperty(key))
          .map(([, value]) => value)
      : Object.values(dataItem);
    if (row.length > 0) {
      worksheet.addRow(row);
    }
  });

  // Generate Excel file as a Blob
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${fileName}.xlsx`);
  });
};

export default ExportToExcel;
