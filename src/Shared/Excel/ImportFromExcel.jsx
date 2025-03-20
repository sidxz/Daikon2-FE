import ExcelJS from "exceljs";
import { toast } from "react-toastify";
import stringSimilarity from "string-similarity";

const ImportFromExcel = async ({
  file,
  sheetName = "Sheet1",
  headerMap = null,
  includeId = true,
}) => {
  if (!file) {
    console.error("No file provided.");
    return;
  }

  let workbook = new ExcelJS.Workbook();
  let arrayBuffer = await file.arrayBuffer();
  await workbook.xlsx.load(arrayBuffer);
  let worksheet = workbook.getWorksheet(sheetName) || workbook.worksheets[0];

  if (includeId && headerMap) {
    headerMap = { ...headerMap, id: "Id" };
  }

  let jsonData = [];
  let warnedColumns = new Set(); // Track warned columns

  // Read header row and create a case-insensitive mapping
  let headerRow = worksheet.getRow(1);
  let headerIndexMap = {}; // Stores column index -> normalized column name
  headerRow.eachCell((cell, colNumber) => {
    headerIndexMap[colNumber] = cell.text.trim().toLowerCase();
  });

  // Map Excel headers to the best-matching keys in headerMap before processing rows
  let columnMappings = {}; // Stores Excel header -> Mapped Key
  Object.entries(headerIndexMap).forEach(([colNumber, excelColumnName]) => {
    let matchedKey = null;
    let bestMatchUsed = false;

    if (headerMap) {
      // Try exact match first (case-insensitive)
      matchedKey = Object.keys(headerMap).find(
        (key) => headerMap[key].toLowerCase() === excelColumnName
      );

      // If no exact match, find the closest match
      if (!matchedKey) {
        let headerValues = Object.values(headerMap).map((h) => h.toLowerCase());
        let matches = stringSimilarity.findBestMatch(
          excelColumnName,
          headerValues
        );

        if (matches.bestMatch.rating > 0.8) {
          let bestMatchValue = matches.bestMatch.target;
          matchedKey = Object.keys(headerMap).find(
            (key) => headerMap[key].toLowerCase() === bestMatchValue
          );
          bestMatchUsed = true;
        }
      }
    } else {
      matchedKey = excelColumnName; // Use original if no headerMap
    }

    if (matchedKey) {
      columnMappings[colNumber] = matchedKey;

      // Show a **single** warning toast for each column
      if (bestMatchUsed && !warnedColumns.has(excelColumnName)) {
        toast.warn(
          `Excel Column "${excelColumnName}" was guessed to be "${matchedKey}". If this is incorrect, please adjust the headers in excel.`,
          { autoClose: false }
        );
        warnedColumns.add(excelColumnName);
      }
    }
  });

  // Process row data using the precomputed columnMappings
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber !== 1) {
      let rowData = {};

      row.eachCell((cell, colNumber) => {
        let matchedKey = columnMappings[colNumber];
        if (matchedKey) {
          rowData[matchedKey] = cell.text;
        }
      });

      if (Object.keys(rowData).length > 0) {
        jsonData.push(rowData);
      }
    }
  });

  return jsonData;
};

export default ImportFromExcel;
