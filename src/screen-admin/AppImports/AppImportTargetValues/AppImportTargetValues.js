import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import SectionHeading from "../../../app/common/SectionHeading/SectionHeading";
import Loading from "../../../app/layout/Loading/Loading";
import { RootStoreContext } from "../../../app/stores/rootStore";

import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { ImDownload } from "react-icons/im";
import { SiMicrosoftexcel } from "react-icons/si";
import DataPreviewDialog from "../../../app/common/DataPreviewDialog/DataPreviewDialog";
import ExportToExcel from "../../../app/common/Functions/Excel/ExportToExcel";
import ImportFromExcel from "../../../app/common/Functions/Excel/ImportFromExcel";
const AppImportTargetValues = () => {
  const navigate = useNavigate();
  const dt = useRef(null);

  const rootStore = useContext(RootStoreContext);
  const { fetchTargetList, displayLoading, targets } = rootStore.targetStore;

  const { batchUpdateTargets, isBatchUpdatingTargets } =
    rootStore.targetStoreAdmin;
  const [dataPreview, setDataPreview] = useState(null);
  const [showDataPreviewDialog, setShowDataPreviewDialog] = useState(false);

  useEffect(() => {
    // Only fetch the target list if it's not already loaded
    if (targets.length === 0) fetchTargetList();
  }, [fetchTargetList, targets]); // eslint-disable-line react-hooks/exhaustive-deps

  if (displayLoading) {
    return <Loading />;
  }

  const breadCrumbItems = [
    {
      label: "App Imports",
      command: () => {
        navigate("/admin/app-imports/");
      },
    },
    {
      label: "Target Values",
      command: () => {
        navigate(`/admin/app-imports/target-values`);
      },
    },
  ];

  let fieldToColumnName = {
    name: "Target Name",
    bucket: "Bucket Score",
    likeScore: "Likelihood Score",
    impactScore: "Biological Impact Score",
    impactComplete: "Impact Complete",
    likeComplete: "Like Complete",
    screeningScore: "Screening Score",
    screeningComplete: "Screening Complete",
    structureScore: "Structure Score",
    structureComplete: "Structure Complete",
    safety: "Safety",
    vulnerabilityRatio: "Vulnerability Ratio",
    vulnerabilityRank: "Vulnerability Rank",
    htsFeasibility: "HTS Feasibility",
    sbdFeasibility: "SBD Feasibility",
    progressibility: "Progressibility",
    background: "Background",
    enablement: "Enablement",
    strategy: "Strategy",
    challenges: "Challenges",
  };

  let exportDataToExcel = () => {
    ExportToExcel({
      jsonData: targets,
      fileName: "TargetData",
      headerMap: fieldToColumnName,
    });
  };

  /* Table Body Templates */

  // Template for rendering the Target Name column
  const TargetNameBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Target Name</span>
        <NavLink to={"/d/target/" + rowData.id}>{rowData.name}</NavLink>
      </React.Fragment>
    );
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
            icon="icon icon-common icon-snowflake"
            heading={"TARGET DATA IMPORTER"}
          />
        </div>

        <div className="flex flex-column w-full border-1 border-600 surface-50">
          <div className="flex p-2 text-xl">Download All</div>
          <div className="flex p-2">
            Use this section to download all the target data.
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
              loading={displayLoading}
            />
          </div>
        </div>
        <div className="flex flex-column w-full border-1 border-600 surface-50">
          <div className="flex p-2 text-xl">Upload</div>
          <div className="flex p-2">
            Use this section to upload the target data. Always download a fresh
            copy of the target data before uploading.
          </div>
          <div className="flex p-2">
            <b>
              This would update existing targets. No new targets will be created
              or deleted.
            </b>
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
        </div>

        <DataPreviewDialog
          headerMap={fieldToColumnName}
          existingData={targets}
          data={dataPreview}
          visible={showDataPreviewDialog}
          onHide={() => {
            setShowDataPreviewDialog(false);
            setDataPreview(null);
          }}
          //comparatorKey="id"
          onSave={batchUpdateTargets}
          isSaving={isBatchUpdatingTargets}
        />

        <div className="flex w-full"></div>

        <DataTable
          ref={dt}
          value={targets}
          // header={header}
          className="datatable-targets"
          //globalFilter={globalFilter}
          emptyMessage="No Targets found."
          filterDisplay="row"
        >
          <Column
            field="name"
            header="Target Name"
            body={TargetNameBodyTemplate}
            className="narrow-column"
            sortable
          />

          <Column
            field="impactScore"
            header="Biological Impact Score"
            sortable
          />
          <Column field="likeScore" header="Likelihood Score" sortable />
          <Column field="bucket" header="Bucket Score" sortable />

          <Column field="impactComplete" header="Impact Complete" sortable />
          <Column field="likeComplete" header="Like Complete" sortable />
          <Column field="screeningScore" header="Screening Score" sortable />
          <Column
            field="screeningComplete"
            header="Screening Complete"
            sortable
          />
          <Column field="structureScore" header="Structure Score" sortable />
          <Column
            field="structureComplete"
            header="Structure Complete"
            sortable
          />
          <Column
            field="vulnerabilityRatio"
            header="Vulnerability Ratio"
            sortable
          />
          <Column
            field="vulnerabilityRank"
            header="Vulnerability Rank"
            sortable
          />
          <Column field="hTSFeasibility" header="HTS Feasibility" sortable />
          <Column field="sBDFeasibility" header="SBD Feasibility" sortable />
          <Column field="progressibility" header="Progressibility" sortable />
          <Column field="background" header="Background" />
          <Column field="enablement" header="Enablement" />
          <Column field="strategy" header="Strategy" />
          <Column field="challenges" header="Challenges" />
        </DataTable>
      </div>
    </React.Fragment>
  );
};

export default observer(AppImportTargetValues);
