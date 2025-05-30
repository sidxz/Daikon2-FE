import { FileUpload } from "primereact/fileupload";
import { useContext, useState } from "react";
import DataPreviewDialog from "../../../../../../Library/DataPreviewDialog/DataPreviewDialog";
import {
  FDateFormatted,
  FDateISOString,
} from "../../../../../../Library/FDate/FDateFormatted";
import { RootStoreContext } from "../../../../../../RootStore";
import ImportFromExcel from "../../../../../../Shared/Excel/ImportFromExcel";
import { DtFieldsToScreenExcelColumnMapping } from "./FSTbScreenRunConstants";

const FSTbV_ScreenRunExcelImport = ({ selectedScreen }) => {
  const rootStore = useContext(RootStoreContext);
  const { batchInsertScreenRuns, isBatchInsertingScreenRuns } =
    rootStore.screenRunStore;

  const [dataForPreview, setDataForPreview] = useState([]);
  const [showDataPreviewDialog, setShowDataPreviewDialog] = useState(false);
  // Map and flatten the screen objects for Excel export
  const existingData = selectedScreen.screenRuns.map((screenRun) => ({
    id: screenRun.id,
    screenId: screenRun.screenId,
    library: screenRun?.library,
    protocol: screenRun?.protocol,
    concentration: screenRun?.concentration,
    noOfCompoundsScreened: screenRun?.noOfCompoundsScreened,
    scientist: screenRun?.scientist,
    startDate: screenRun?.startDate,
    endDate: screenRun?.endDate,
    primaryHitCount: screenRun?.primaryHitCount,
    confirmedHitCount: screenRun?.confirmedHitCount,
    notes: screenRun?.notes,
  }));

  return (
    <>
      <FileUpload
        name="excelFile"
        accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        maxFileSize={1000000}
        mode="basic"
        chooseLabel="Import"
        chooseOptions={{
          icon: "icon icon-common icon-plus-circle",
          className: "p-button-text p-button-md",
        }}
        cancelOptions={{
          label: "Cancel",
          icon: "pi pi-times",
          className: "p-button-danger",
        }}
        className="p-button-text p-button-secondary"
        customUpload={true}
        uploadHandler={async (e) => {
          let file = e.files[0];
          const jsonData = await ImportFromExcel({
            file: file,
            headerMap: DtFieldsToScreenExcelColumnMapping,
          });
          e.files = null;

          // This is to clear the file list in the FileUpload component
          e.options.clear();

          jsonData.forEach((row) => {
            // row.hitCollectionId = selectedHitCollection.id;
            // output is in field 'smiles' in excel (template), but to create a hit, we need 'requestedSMILES'
            // row.requestedSMILES = row.smiles;
            if (row.startDate) {
              row.startDate = FDateISOString(row.startDate);
            }

            if (row.endDate) {
              row.endDate = FDateISOString(row.endDate);
            }

            console.log(row);
          });

          setDataForPreview(jsonData);
          setShowDataPreviewDialog(true);
          //hideFileUploadDialog();
        }}
        auto
      />
      <DataPreviewDialog
        headerMap={DtFieldsToScreenExcelColumnMapping}
        existingData={existingData}
        comparatorKey="id"
        data={dataForPreview}
        visible={showDataPreviewDialog}
        onHide={() => {
          setShowDataPreviewDialog(false);
          setDataForPreview(null);
        }}
        onSave={batchInsertScreenRuns}
        isSaving={isBatchInsertingScreenRuns}
        customBodyTemplates={{
          startDate: (rowData) => FDateFormatted(rowData.startDate),
          endDate: (rowData) => FDateFormatted(rowData.endDate),
          // You can add more templates per field easily
        }}
      />
    </>
  );
};

export default FSTbV_ScreenRunExcelImport;
