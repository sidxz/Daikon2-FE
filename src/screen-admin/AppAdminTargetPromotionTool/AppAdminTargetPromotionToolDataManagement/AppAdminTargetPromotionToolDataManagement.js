import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { FileUpload } from "primereact/fileupload";
import React, { useContext, useEffect, useState } from "react";
import { ImDownload } from "react-icons/im";
import { SiMicrosoftexcel } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import DataPreviewDialog from "../../../app/common/DataPreviewDialog/DataPreviewDialog";
import ExportToExcel from "../../../app/common/Functions/Excel/ExportToExcel";
import ImportFromExcel from "../../../app/common/Functions/Excel/ImportFromExcel";
import SectionHeading from "../../../app/common/SectionHeading/SectionHeading";
import { RootStoreContext } from "../../../app/stores/rootStore";
const AppAdminTargetPromotionToolDataManagement = () => {
  const navigate = useNavigate();
  const rootStore = useContext(RootStoreContext);

  const {
    isExporting,
    exportData,
    targetScorecardExports,
    isImporting,
    importData,
    importDataResponse,
  } = rootStore.targetPTDataManagement;
  const [dataPreview, setDataPreview] = useState(null);
  const [showDataPreviewDialog, setShowDataPreviewDialog] = useState(false);

  useEffect(() => {
    exportData();
  }, [exportData]);

  const breadCrumbItems = [
    {
      label: "Target Promotion Tool",
      command: () => {
        navigate("/admin/target-promotion-tool/");
      },
    },
    {
      label: "Data Management",
      command: () => {
        navigate(`/admin/target-promotion-tool/data-management/`);
      },
    },
  ];

  let fieldToColumnName = {
    targetName: "Target Name",
    questionIdentification: "Question Identification",
    section: "Section",
    subSection: "Sub Section",
    question: "Question",
    answer: "Answer",
    description: "Description",
    allowedAnswers: "Allowed Answers",
    answeredBy: "Answered By",
    targetId: "Target Id",
    targetScorecardId: "Target Scorecard Id",
    questionId: "Question Id",
    answerId: "Answer Id",
  };

  let importFieldToColumnName = {
    targetName: "Target Name",
    questionIdentification: "Question Identification",

    answer: "Answer",
    description: "Description",

    targetId: "Target Id",
    targetScorecardId: "Target Scorecard Id",
    questionId: "Question Id",
    answerId: "Answer Id",
  };

  let exportDataToExcel = () => {
    ExportToExcel({
      jsonData: targetScorecardExports,
      fileName: "TargetPromotionToolDataManagement",
      headerMap: fieldToColumnName,
    });
  };

  return (
    <React.Fragment>
      {/* First div for general information and dates */}

      <div className="flex flex-column gap-2 w-full">
        <div className="flex w-full pb-2">
          <BreadCrumb model={breadCrumbItems} />
        </div>
        <div className="flex w-full">
          <SectionHeading
            icon="icon icon-common icon-exchange-alt"
            heading={"Target Promotion Tool Data Management"}
          />
        </div>
        <div className="flex flex-column w-full border-1 border-600 surface-50">
          <div className="flex p-2 text-xl">Download All</div>
          <div className="flex p-2">
            Use this section to download all the target promotion tool data.
          </div>
          <div className="flex p-2">
            <Button
              icon={
                <div className="flex pr-2">
                  <ImDownload />
                </div>
              }
              label="Download"
              onClick={() => exportDataToExcel()}
              loading={isExporting}
            />
          </div>
        </div>
        <div className="flex flex-column w-full border-1 border-600 surface-50">
          <div className="flex p-2 text-xl">Upload</div>
          <div className="flex p-2">
            Use this section to upload the target promotion tool data.
          </div>
          <div className="flex flex p-2">
            <FileUpload
              name="excelFile"
              accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              maxFileSize={1000000}
              mode="basic"
              chooseLabel="Import"
              chooseOptions={{
                icon: (
                  <div className="flex pr-2">
                    <SiMicrosoftexcel />
                  </div>
                ),

                className: "p-button-primary p-button-lg m-0 p-1 pl-2 pr-2",
              }}
              cancelOptions={{
                label: "Cancel",
                icon: "pi pi-times",
                className: "p-button-danger",
              }}
              className="p-button-text"
              style={{ height: "30px" }}
              customUpload={true}
              uploadHandler={async (e) => {
                let file = e.files[0];
                const jsonData = await ImportFromExcel({
                  file: file,
                  headerMap: fieldToColumnName,
                });
                e.files = null;
                setDataPreview(jsonData);
                setShowDataPreviewDialog(true);
              }}
              auto
            />
          </div>
          {isImporting && <div className="flex p-2">Please wait ...</div>}
          <div className="flex p-2">
            {importDataResponse.length !== 0 ? (
              <DataTable
                value={importDataResponse}
                tableStyle={{ minWidth: "50rem" }}
                header="Import Results"
                showGridlines
              >
                <Column
                  field="targetName"
                  header="Target Name"
                  sortable
                ></Column>
                <Column
                  field="questionIdentification"
                  header="Question"
                ></Column>
                <Column field="status" header="Status" sortable></Column>
                <Column field="answer" header="Answer"></Column>
                <Column field="reason" header="Reason"></Column>
              </DataTable>
            ) : null}
          </div>
        </div>
      </div>

      {/* Data preview dialog, used when a excel file is uploaded */}
      <DataPreviewDialog
        headerMap={importFieldToColumnName}
        existingData={targetScorecardExports}
        data={dataPreview}
        visible={showDataPreviewDialog}
        onHide={() => {
          setShowDataPreviewDialog(false);
          setDataPreview(null);
        }}
        comparatorKey="answerId"
        onSave={importData}
        isSaving={isImporting}
      />
    </React.Fragment>
  );
};

export default observer(AppAdminTargetPromotionToolDataManagement);
