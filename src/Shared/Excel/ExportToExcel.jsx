import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// Improved function for exporting JSON data to an Excel file
const exportToExcel = async ({
  jsonData = [],
  fileName = "Data",
  sheetName = "Sheet1",
  headerMap = null,
  includeId = true,
  columnValidations = null,
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

  if (columnValidations && effectiveHeaderMap) {
    const toColumnLetter = (colIndex) => {
      let dividend = colIndex;
      let columnName = "";
      while (dividend > 0) {
        let modulo = (dividend - 1) % 26;
        columnName = String.fromCharCode(65 + modulo) + columnName;
        dividend = Math.floor((dividend - modulo) / 26);
      }
      return columnName;
    };

    const headerKeys = Object.keys(effectiveHeaderMap);
    const lastRow = worksheet.rowCount;
    if (lastRow >= 2) {
      headerKeys.forEach((key, index) => {
        const options = columnValidations[key];
        if (!options || options.length === 0) return;
        const columnLetter = toColumnLetter(index + 1);
        const range = `${columnLetter}2:${columnLetter}${lastRow}`;
        worksheet.dataValidations.add(range, {
          type: "list",
          allowBlank: true,
          formulae: [`"${options.join(",")}"`],
          showErrorMessage: true,
          errorStyle: "warning",
          errorTitle: "Invalid Value",
          error: "Select a value from the list.",
        });
      });
    }
  }

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
