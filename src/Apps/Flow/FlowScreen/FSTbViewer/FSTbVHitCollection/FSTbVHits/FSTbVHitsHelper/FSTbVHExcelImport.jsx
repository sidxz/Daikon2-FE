import { FileUpload } from "primereact/fileupload";
import React, { useContext, useState } from "react";
import { SiMicrosoftexcel } from "react-icons/si";
import DataPreviewDialog from "../../../../../../../Library/DataPreviewDialog/DataPreviewDialog";
import { RootStoreContext } from "../../../../../../../RootStore";
import ImportFromExcel from "../../../../../../../Shared/Excel/ImportFromExcel";
import { DtFieldsToExcelColumnMapping } from "./FSTbVHitsConstants";

const FSTbVHExcelImport = ({
  selectedHitCollection = { hits: [], name: "", hitCollectionType: "" },
  hideFileUploadDialog,
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
    source: hit.librarySource ?? "",
    name: hit.molecule?.name ?? "",
    iC50: hit.iC50 ?? "",
    mic: hit.mic ?? "",
    cluster: hit.clusterGroup ?? "",
  }));

  return (
    <>
      <FileUpload
        name="excelFile"
        accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        maxFileSize={1000000}
        mode="basic"
        chooseLabel="Select Excel File"
        chooseOptions={{
          icon: (
            <div className="flex pr-2">
              <SiMicrosoftexcel />
            </div>
          ),

          className: "p-button-text m-0 p-1 p-button-secondary",
        }}
        cancelOptions={{
          label: "Cancel",
          icon: "pi pi-times",
          className: "p-button-danger",
        }}
        className="p-button-text p-button-secondary"
        style={{ height: "30px" }}
        customUpload={true}
        uploadHandler={async (e) => {
          let file = e.files[0];
          const jsonData = await ImportFromExcel({
            file: file,
            headerMap: DtFieldsToExcelColumnMapping,
          });
          e.files = null;
          jsonData.forEach((row) => {
            row.hitCollectionId = selectedHitCollection.id;
            // output is in field 'smiles' in excel (template), but to create a hit, we need 'requestedSMILES'
            row.requestedSMILES = row.smiles;
            console.log("row", row);
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

export default FSTbVHExcelImport;
