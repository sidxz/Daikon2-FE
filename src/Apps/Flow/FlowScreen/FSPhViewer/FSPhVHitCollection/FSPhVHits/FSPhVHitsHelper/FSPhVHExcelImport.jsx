import { FileUpload } from "primereact/fileupload";
import React, { useContext, useState } from "react";
import DataPreviewDialog from "../../../../../../../Library/DataPreviewDialog/DataPreviewDialog";
import { RootStoreContext } from "../../../../../../../RootStore";
import ImportFromExcel from "../../../../../../../Shared/Excel/ImportFromExcel";
import { DtFieldsToExcelColumnMapping } from "./FSPhVHitsConstants";

const FSPhVHExcelImport = ({
  selectedHitCollection = { hits: [], name: "", hitCollectionType: "" },
}) => {
  const rootStore = useContext(RootStoreContext);
  const { batchInsertHits, isBatchInsertingHits } = rootStore.hitStore;

  const [dataForPreview, setDataForPreview] = useState([]);
  const [showDataPreviewDialog, setShowDataPreviewDialog] = useState(false);
  // Map and flatten the hit objects for Excel export
  const existingData = selectedHitCollection.hits.map((hit) => ({
    id: hit.id,
    smiles: hit.molecule?.smiles ?? "",
    library: hit.library ?? "",
    librarySource: hit.librarySource ?? "",
    moleculeName: hit.molecule?.name ?? "",
    iC50: hit.iC50 ?? "",
    mic: hit.mic ?? "",
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
            headerMap: DtFieldsToExcelColumnMapping,
          });
          e.files = null;

          // This is to clear the file list in the FileUpload component
          e.options.clear();

          jsonData.forEach((row) => {
            // row.hitCollectionId = selectedHitCollection.id;
            // output is in field 'smiles' in excel (template), but to create a hit, we need 'requestedSMILES'
            // row.requestedSMILES = row.smiles;
          });
          setDataForPreview(jsonData);
          setShowDataPreviewDialog(true);
          //hideFileUploadDialog();
        }}
        auto
      />
      <DataPreviewDialog
        headerMap={DtFieldsToExcelColumnMapping}
        existingData={existingData}
        comparatorKey="id"
        data={dataForPreview}
        visible={showDataPreviewDialog}
        onHide={() => {
          setShowDataPreviewDialog(false);
          setDataForPreview(null);
        }}
        onSave={batchInsertHits}
        isSaving={isBatchInsertingHits}
      />
    </>
  );
};

export default FSPhVHExcelImport;
