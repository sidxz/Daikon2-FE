import ExcelJS from "exceljs";

const ImportFromExcel = async ({
  file,
  sheetName = "Sheet1",
  headerMap = null,
  includeId = true,
}) => {
  // Check if file is provided
  if (!file) {
    console.error("No file provided.");
    return;
  }

  // Initialize a new Workbook
  let workbook = new ExcelJS.Workbook();

  // Read the file as an ArrayBuffer
  let arrayBuffer = await file.arrayBuffer();

  // Load workbook from the arrayBuffer
  await workbook.xlsx.load(arrayBuffer);

  // Get the worksheet from the workbook
  let worksheet = workbook.getWorksheet(sheetName) || workbook.worksheets[0];

  // If includeId is true and headerMap is provided, add id to the header map
  if (includeId && headerMap) {
    headerMap = { ...headerMap, id: "Id" };
  }

  // Initialize an array to store our JSON data
  let jsonData = [];

  // Iterate over each row in the worksheet
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber !== 1) {
      // Initialize an object to hold the JSON data for this row
      let rowData = {};

      // Iterate over each cell in the row
      row.eachCell((cell, colNumber) => {
        // Get the column name from the header row or the headerMap
        let columnName = headerMap
          ? Object.keys(headerMap).find(
              (key) =>
                headerMap[key] === worksheet.getRow(1).getCell(colNumber).text
            )
          : worksheet.getRow(1).getCell(colNumber).text;

        // If the columnName exists, use it to store the cell's value in rowData
        if (columnName) {
          rowData[columnName] = cell.text;
        }
      });

      // If rowData is not an empty object, add it to jsonData
      if (Object.keys(rowData).length > 0) {
        jsonData.push(rowData);
      }
    }
  });

  // Return the JSON data
  return jsonData;
};

export default ImportFromExcel;
