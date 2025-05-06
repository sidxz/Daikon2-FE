import { FileUpload } from "primereact/fileupload";
import React, { useContext, useState } from "react";
import DataPreviewDialog from "../../../../../../../Library/DataPreviewDialog/DataPreviewDialog";
import SmilesView from "../../../../../../../Library/SmilesView/SmilesView";
import { RootStoreContext } from "../../../../../../../RootStore";
import ImportFromExcel from "../../../../../../../Shared/Excel/ImportFromExcel";
import { GroupMolecules } from "../../../../shared/DataImportHelper";
import {
  DtFieldsGroupedColumnMapping,
  DtFieldsToExcelColumnMapping,
} from "./FSTbVHitsConstants";

const FSTbVHExcelImport = ({
  selectedHitCollection = { hits: [], name: "", hitCollectionType: "" },
}) => {
  const rootStore = useContext(RootStoreContext);
  const { batchInsertHits, isBatchInsertingHits } = rootStore.hitStore;

  const [dataForPreview, setDataForPreview] = useState([]);
  const [showDataPreviewDialog, setShowDataPreviewDialog] = useState(false);
  // Map and flatten the hit objects for Excel export
  const existingData = selectedHitCollection.hits.map((hit) => ({
    ...hit,
    id: hit.id,
    smiles: hit.molecule?.smiles ?? "",
    library: hit.library ?? "",
    librarySource: hit.librarySource ?? "",
    moleculeName: hit.molecule?.name ?? "",
    iC50: hit.iC50 ?? "",
    mic: hit.mic ?? "",
    clusterGroup: hit.clusterGroup ?? "",
    notes: hit.notes ?? "",
  }));

  const doseResponsesFlattener = (arr) =>
    arr.map((dp) => `${dp.concentration}/${dp.response}`).join("; ");

  const structureBodyTemplate = (rowData) => {
    return (
      <>
        <div
          className="flex flex-column"
          style={{ width: "250px", height: "290px" }}
        >
          <div className="flex w-full h-full">
            <SmilesView smiles={rowData?.smiles} width={250} height={270} />
          </div>
        </div>
      </>
    );
  };

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
          // console.log("jsonData", jsonData);
          jsonData.forEach((row) => {
            // row.hitCollectionId = selectedHitCollection.id;
            // output is in field 'smiles' in excel (template), but to create a hit, we need 'requestedSMILES'
            // row.requestedSMILES = row.smiles;
            row = { ...existingData.find((hit) => hit.id === row.id), ...row };
            // console.log("row", row);
          });
          console.log("jsonData", jsonData);

          let jsonDataGrouped = GroupMolecules(jsonData);
          console.log("jsonDataGrouped", jsonDataGrouped);

          setDataForPreview(jsonDataGrouped);
          setShowDataPreviewDialog(true);
          //hideFileUploadDialog();
        }}
        auto
      />
      <DataPreviewDialog
        headerMap={DtFieldsGroupedColumnMapping}
        existingData={existingData}
        comparatorKey="id"
        data={dataForPreview}
        visible={showDataPreviewDialog}
        onHide={() => {
          setShowDataPreviewDialog(false);
          setDataForPreview(null);
        }}
        onSave={batchInsertHits}
        //onSave={(data) => console.log("data", data)}
        isSaving={isBatchInsertingHits}
        fieldFlatteners={{
          doseResponses: doseResponsesFlattener,
        }}
        customBodyTemplates={{
          smiles: (rowData) => structureBodyTemplate(rowData),
          // You can add more templates per field easily
        }}
      />
    </>
  );
};

export default FSTbVHExcelImport;
