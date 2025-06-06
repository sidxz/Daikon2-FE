import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import { useContext, useState } from "react";
import DataPreviewDialog from "../../../../../../../Library/DataPreviewDialog/DataPreviewDialog";
import SmilesView from "../../../../../../../Library/SmilesView/SmilesView";
import { RootStoreContext } from "../../../../../../../RootStore";
import ImportFromExcel from "../../../../../../../Shared/Excel/ImportFromExcel";
import { DoseResponseBodyTemplate } from "../../../../FSTbViewer/FSTbVHitCollection/FSTbVHits/FSTbVHitsHelper/FSTbVHDataTableHelper";
import { GroupMolecules } from "../../../../shared/DataImportHelper";
import {
  DoseResponsesFlattener,
  DtFieldsGroupedColumnMapping,
  DtFieldsToExcelColumnMapping,
} from "./FSPhVHitsConstants";

const FSPhVHExcelImport = ({
  selectedHitCollection = { hits: [], name: "", hitCollectionType: "" },
  visible,
  onHide,
}) => {
  if (visible) {
    const rootStore = useContext(RootStoreContext);
    const { batchInsertHits, isBatchInsertingHits } = rootStore.hitStore;

    const [dataForPreview, setDataForPreview] = useState([]);
    const [showDataPreviewDialog, setShowDataPreviewDialog] = useState(false);

    // Map and flatten the hit objects for Excel Import
    const existingData = selectedHitCollection.hits.map((hit) => ({
      ...hit,
      id: hit.id,
      smiles: hit.molecule?.smiles ?? "",
      moleculeName: hit.molecule?.name ?? "",
    }));

    console.log("existingData", existingData);

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

    const emptyTemplate = () => {
      return (
        <div className="flex align-items-center flex-column">
          <i
            className="pi pi-image mt-3 p-5"
            style={{
              fontSize: "5em",
              borderRadius: "50%",
              backgroundColor: "var(--surface-b)",
              color: "var(--surface-d)",
            }}
          ></i>
          <span
            style={{ fontSize: "1.2em", color: "var(--text-color-secondary)" }}
            className="my-5"
          >
            Drag and Drop Hits Excel Here
          </span>
        </div>
      );
    };

    return (
      <Dialog
        header="Import Hits from Excel"
        visible={visible}
        style={{ width: "50vw" }}
        onHide={onHide}
        closable
      >
        <FileUpload
          name="excelFile"
          accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          maxFileSize={1000000}
          mode="advanced"
          chooseLabel="Browse and Select File"
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
          emptyTemplate={emptyTemplate}
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
              row = {
                ...existingData.find((hit) => hit.id === row.id),
                ...row,
              };
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
          onSave={(data) => {
            console.log("data", data);
            batchInsertHits(data);
            onHide();
          }}
          //onSave={(data) => console.log("data", data)}
          isSaving={isBatchInsertingHits}
          fieldFlatteners={{
            doseResponses: DoseResponsesFlattener,
          }}
          customBodyTemplates={{
            smiles: (rowData) => structureBodyTemplate(rowData),
            doseResponses: (rowData) =>
              DoseResponseBodyTemplate(rowData._originalRow),
            // You can add more templates per field easily
          }}
        />
      </Dialog>
    );
  }
};

export default FSPhVHExcelImport;
