import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import { OverlayPanel } from "primereact/overlaypanel";
import { useContext, useRef, useState } from "react";
import { STRINGS } from "../../../../../../../Customizations/strings";
import BulkDataImportProgress from "../../../../../../../Library/BulkDataImportProgress/BulkDataImportProgress";
import SmilesView from "../../../../../../../Library/SmilesView/SmilesView";
import { RootStoreContext } from "../../../../../../../RootStore";
import ImportFromExcel from "../../../../../../../Shared/Excel/ImportFromExcel";
import InputOrg from "../../../../../../../Shared/InputEditors/InputOrg";
import InputScientist from "../../../../../../../Shared/InputEditors/InputScientist";
import { DoseResponseBodyTemplate } from "../../../../FSTbViewer/FSTbVHitCollection/FSTbVHits/FSTbVHitsHelper/FSTbVHDataTableHelper";
import { GroupMolecules } from "../../../../shared/DataImportHelper";
import { isSameMoleculeName } from "../../../../shared/SharedHelper";
import {
  DoseResponsesFlattener,
  DtFieldsGroupedColumnMapping,
  DtFieldsToExcelColumnMapping,
} from "./FSPhVHitsConstants";

const FSPhVHExcelBulkImport = ({
  selectedHitCollection = { hits: [], name: "", hitCollectionType: "" },
  visible,
  onHide,
}) => {
  const rootStore = useContext(RootStoreContext);
  const { user } = rootStore.authStore;

  const [dataForPreview, setDataForPreview] = useState([]);
  const [showDataPreviewDialog, setShowDataPreviewDialog] = useState(false);
  const metaOverlayPanel = useRef(null);
  const [metaDataScientist, setMetaDataScientist] = useState(
    user?.firstName + " " + user?.lastName
  );
  const [metaDataOrgID, setMetaDataOrgID] = useState(user?.appOrgId);

  if (visible) {
    const {
      bulkInsertHits,
      isBulkUploadingHits,
      bulkProgress,
      cancelBulkUpload,
    } = rootStore.hitStore;

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

    const headerTemplate = (
      <div className="flex flex-column">
        <div className="flex">Import Hits from Excel</div>
        <div className="flex text-sm">{STRINGS.DISCLOSURE_NOTICE}</div>
      </div>
    );

    return (
      <Dialog
        header={headerTemplate}
        visible={visible}
        style={{ width: "50vw" }}
        onHide={onHide}
        closable
      >
        <div className="flex flex-column w-full gap-1">
          <div className="flex align-items-right justify-content-end">
            <Button
              className="p-button-text p-button-secondary"
              label="Edit Metadata"
              onClick={(e) => metaOverlayPanel.current.toggle(e)}
            />
            <OverlayPanel ref={metaOverlayPanel}>
              <div className="flex flex-column gap-2">
                <div className="flex align-items-center gap-2">
                  <div className="flex flex-none w-12rem">
                    Disclosure Scientist
                  </div>
                  <div className="flex-auto">
                    <InputScientist
                      id="scientist"
                      value={metaDataScientist}
                      onChange={(e) => setMetaDataScientist(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex align-items-center gap-2">
                  <div className="flex flex-none w-12rem">Disclosure Org</div>
                  <div className="flex-auto">
                    <InputOrg
                      id="org"
                      value={metaDataOrgID}
                      onChange={(e) => setMetaDataOrgID(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </OverlayPanel>
          </div>
          <div className="flex w-full">
            <FileUpload
              name="excelFile"
              accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              maxFileSize={10000000}
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
              className="p-button-text p-button-secondary w-full"
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
            <BulkDataImportProgress
              headerMap={DtFieldsGroupedColumnMapping}
              existingData={existingData}
              comparatorKey="id"
              comparatorFn={isSameMoleculeName}
              structureFields={["smiles"]}
              requiredFields={["moleculeName"]}
              data={dataForPreview}
              visible={showDataPreviewDialog}
              onHide={() => {
                setShowDataPreviewDialog(false);
                setDataForPreview(null);
              }}
              onProceed={(rowsToSave) => {
                rowsToSave.forEach((row) => {
                  row.disclosureScientist = metaDataScientist;
                  row.disclosureOrgId = metaDataOrgID;
                });
                // keep the dialog open to show live progress
                //console.log(rowsToSave);
                bulkInsertHits(rowsToSave, { batchSize: 100 });
              }}
              onCancel={() => cancelBulkUpload()}
              //onSave={(data) => console.log("data", data)}
              isUploading={isBulkUploadingHits}
              bulkProgress={bulkProgress}
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
          </div>
        </div>
      </Dialog>
    );
  }
};

export default observer(FSPhVHExcelBulkImport);
