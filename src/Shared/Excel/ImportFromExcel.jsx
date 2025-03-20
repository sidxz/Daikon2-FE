import ExcelJS from "exceljs";
import React from "react"; // Import React to use JSX for <strong> and <br />
import { toast } from "react-toastify";
import stringSimilarity from "string-similarity";

/**
 * Imports data from an Excel file and maps headers to specified keys.
 *
 * @param {Object} options - Configuration options.
 * @param {File} options.file - The Excel file to import.
 * @param {string} [options.sheetName="Sheet1"] - The sheet name to read from.
 * @param {Object} [options.headerMap=null] - Mapping of expected headers to actual column names.
 * @param {boolean} [options.includeId=true] - Whether to include an 'id' field.
 * @returns {Promise<Object[]>} - Parsed data from the Excel file.
 */
const ImportFromExcel = async ({
  file,
  sheetName = "Sheet1",
  headerMap = null,
  includeId = true,
}) => {
  if (!(file instanceof File)) {
    console.error("Invalid file provided.");
    return [];
  }

  try {
    const workbook = new ExcelJS.Workbook();
    const arrayBuffer = await file.arrayBuffer();
    await workbook.xlsx.load(arrayBuffer);

    const worksheet =
      workbook.getWorksheet(sheetName) || workbook.worksheets[0];

    if (!worksheet) {
      console.error(`Sheet "${sheetName}" not found in the Excel file.`);
      return [];
    }

    // Include 'id' in header mapping if required
    if (includeId && headerMap) {
      headerMap = { ...headerMap, id: "Id" };
    }

    const jsonData = [];
    const warnings = []; // Collect warnings to show in a single toast

    // Read and normalize header row
    const headerRow = worksheet.getRow(1);
    const headerIndexMap = new Map(); // Maps column index -> normalized column name

    headerRow.eachCell((cell, colNumber) => {
      if (cell.text) {
        headerIndexMap.set(colNumber, cell.text.trim().toLowerCase());
      }
    });

    // Map Excel headers to headerMap (or use original names if no mapping)
    const columnMappings = new Map(); // Maps column index -> mapped key

    for (const [colNumber, excelColumnName] of headerIndexMap) {
      let matchedKey = null;
      let bestMatchUsed = false;

      if (headerMap) {
        // Try exact match first (case-insensitive)
        matchedKey = Object.keys(headerMap).find(
          (key) => headerMap[key].toLowerCase() === excelColumnName
        );

        // If no exact match, attempt fuzzy matching
        if (!matchedKey) {
          const headerValues = Object.values(headerMap).map((h) =>
            h.toLowerCase()
          );
          const matches = stringSimilarity.findBestMatch(
            excelColumnName,
            headerValues
          );

          if (matches.bestMatch.rating > 0.7) {
            const bestMatchValue = matches.bestMatch.target;
            matchedKey = Object.keys(headerMap).find(
              (key) => headerMap[key].toLowerCase() === bestMatchValue
            );
            bestMatchUsed = true;
          }
        }
      } else {
        matchedKey = excelColumnName; // Use original column name if no mapping exists
      }

      if (matchedKey) {
        columnMappings.set(colNumber, matchedKey);

        // Collect warnings instead of showing multiple toasts
        if (bestMatchUsed) {
          warnings.push(
            <React.Fragment key={colNumber}>
              The Excel column <strong>"{excelColumnName}"</strong> was
              automatically mapped to <strong>"{headerMap[matchedKey]}"</strong>
              . If incorrect, please update the column headers.
              <br />
              <br />
            </React.Fragment>
          );
        }
      }
    }

    // Show all warnings in a single toast message with bold column names
    if (warnings.length > 0) {
      toast.warn(<div>{warnings}</div>, { autoClose: false });
    }

    // Process row data based on computed column mappings
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip the header row

      const rowData = {};

      row.eachCell((cell, colNumber) => {
        const matchedKey = columnMappings.get(colNumber);
        if (matchedKey) {
          rowData[matchedKey] = cell.text?.trim() || "";
        }
      });

      if (Object.keys(rowData).length > 0) {
        jsonData.push(rowData);
      }
    });

    return jsonData;
  } catch (error) {
    console.error("Error processing Excel file:", error);
    toast.error("An error occurred while processing the Excel file.");
    return [];
  }
};

export default ImportFromExcel;
