import { observer } from "mobx-react-lite";
import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Chip } from "primereact/chip";
import { Column } from "primereact/column";
import { ImDownload } from "react-icons/im";

import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { OverlayPanel } from "primereact/overlaypanel";
import { Sidebar } from "primereact/sidebar";
import React, { useContext, useEffect, useRef, useState } from "react";
import FDate from "../../../../../../app/common/FDate/FDate";
import ExportToExcel from "../../../../../../app/common/Functions/Excel/ExportToExcel";
import PleaseWait from "../../../../../../app/common/PleaseWait/PleaseWait";
import ScreenStatus from "../../../../../../app/common/ScreenStatus/ScreenStatus";
import Loading from "../../../../../../app/layout/Loading/Loading";
import { RootStoreContext } from "../../../../../../app/stores/rootStore";
import ScreenSequenceAddForm from "./ScreenSequenceAddForm/ScreenSequenceAddForm";

import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import { SiMicrosoftexcel } from "react-icons/si";
import { TbBookDownload } from "react-icons/tb";
import DataPreviewDialog from "../../../../../../app/common/DataPreviewDialog/DataPreviewDialog";
import DeleteConfirmation from "../../../../../../app/common/DeleteConfirmation/DeleteConfirmation";
import { GenerateTemplate } from "../../../../../../app/common/Functions/Excel/GenerateTemplate";
import ImportFromExcel from "../../../../../../app/common/Functions/Excel/ImportFromExcel";

const ScreenSequence = ({ screenId }) => {
  const [displayAddDialog, setDisplayAddDialog] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState("");
  const [dataPreview, setDataPreview] = useState(null);
  const [showDataPreviewDialog, setShowDataPreviewDialog] = useState(false);
  const [displayDeleteContainer, setDisplayDeleteContainer] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const op = useRef(null);
  const dt = useRef(null);

  /* MobX Store */
  const rootStore = useContext(RootStoreContext);
  const { appVars } = rootStore.generalStore;
  const {
    isLoadingTargetBasedScreen,
    fetchTargetBasedScreen,
    selectedTargetBasedScreen,
    addScreenSequence,
    isAddingScreenSequence,
    editScreenSequence,
    isEditingScreenSequence,
    isBatchInsertingTargetBasedScreenSequence,
    batchInsertTargetBasedScreenSequence,
    deleteScreenRow,
    isDeletingScreenRow,
  } = rootStore.screenTStore;

  const { user } = rootStore.userStore;

  const [filteredResearchers, setFilteredResearchers] = useState([]);

  useEffect(() => {
    if (
      selectedTargetBasedScreen === null ||
      selectedTargetBasedScreen.id !== screenId
    )
      fetchTargetBasedScreen(screenId);
  }, [selectedTargetBasedScreen, fetchTargetBasedScreen, screenId]);

  if (isLoadingTargetBasedScreen || selectedTargetBasedScreen === null) {
    return <PleaseWait />;
  }

  let isDeletingAllowed = user?.roles.includes("admin");

  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  };

  // Map Data fields to Column Name
  const fieldToColumnName = {
    library: "Library",
    protocol: "Protocol",
    concentration: "Inhibitor Concentration",
    noOfCompoundsScreened: "Total Compounds Screened",
    scientist: "Scientist",
    startDate: "Start Date",
    endDate: "End Date",
    unverifiedHitCount: "Hit Count",
    confirmedHitCount: "Validated Hit Count",
  };

  const tableHeader = (
    <div className="flex w-full">
      <div className="flex w-full">
        <div className="flex gap-1">
          <div className="flex align-items-center">
            <Button
              type="button"
              icon="icon icon-common icon-plus-circle"
              label="New Library Screen"
              className="p-button-text"
              onClick={() => setDisplayAddDialog(true)}
            />
          </div>
          <div className="flex align-items-center">
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

                className: "p-button-text m-0 p-2",
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
          <div className="flex align-items-center">
            <Button
              type="button"
              icon={
                <div className="flex pr-2">
                  <ImDownload />
                </div>
              }
              label="Export"
              className="p-button-text"
              onClick={() =>
                ExportToExcel({
                  jsonData: selectedTargetBasedScreen.screenSequences,
                  fileName: selectedTargetBasedScreen.screenName + "-Screens",
                  headerMap: fieldToColumnName,
                })
              }
            />
          </div>
          <div className="flex align-items-center">
            <Button
              type="button"
              icon={
                <div className="flex pr-1">
                  <TbBookDownload />
                </div>
              }
              label="Template"
              className="p-button-text"
              onClick={() =>
                ExportToExcel({
                  jsonData: GenerateTemplate(fieldToColumnName),
                  fileName: "TargetBased-Screens-Template",
                  headerMap: fieldToColumnName,
                })
              }
            />
          </div>
        </div>
      </div>

      <div className="flex w-full justify-content-end gap-2">
        <div className="flex">
          <ScreenStatus
            id={selectedTargetBasedScreen.id}
            status={selectedTargetBasedScreen?.status}
          />
        </div>
        <div className="flex">
          <Chip
            label={selectedTargetBasedScreen?.org?.alias}
            icon="ri-organization-chart"
          />
        </div>
        <div className="flex">
          <Chip
            label={selectedTargetBasedScreen?.method}
            icon="icon icon-common icon-circle-notch"
          />
        </div>
      </div>
    </div>
  );

  if (!isLoadingTargetBasedScreen && selectedTargetBasedScreen) {
    let protocolBodyTemplate = (rowData) => {
      if (rowData?.protocol === null) {
        return <>Not Available</>;
      }
      return (
        <div
          className="p-mb-3 p-text-nowrap p-text-truncate"
          style={{ width: "6rem" }}
        >
          <Button
            className="p-button-text p-button-plain"
            label={
              rowData?.protocol !== null
                ? rowData?.protocol.substring(0, 7) + "..."
                : ""
            }
            onClick={(e) => {
              setSelectedProtocol(rowData.protocol);
              op.current.toggle(e);
            }}
            aria-haspopup
            aria-controls="overlay_panel"
            style={{ padding: "0px", margin: "0px" }}
          />
        </div>
      );
    };

    const StartDateTemplate = (rowData) => {
      return <FDate timestamp={rowData.startDate} hideTime={true} />;
    };
    const EndDateTemplate = (rowData) => {
      let OngoingTemplate = () => {
        return <span>Ongoing</span>;
      };
      return rowData.endDate ? (
        <FDate timestamp={rowData.endDate} hideTime={true} />
      ) : (
        OngoingTemplate()
      );
    };

    /* Row edit functions */
    const textEditor = (options) => {
      return (
        <InputText
          type="text"
          value={options.value}
          onChange={(e) => options.editorCallback(e.target.value)}
        />
      );
    };

    const dateEditor = (options) => {
      return (
        <div className="p-float-label">
          <Calendar
            inputId="edit_date"
            value={options.value}
            onChange={(e) => options.editorCallback(e.target.value)}
          />
          <label htmlFor="edit_date">
            <FDate timestamp={options.value} hideTime={true} />
          </label>
        </div>
      );
    };

    const scientistEditor = (options) => {
      return (
        <AutoComplete
          value={options.value}
          delay={1500}
          suggestions={filteredResearchers}
          completeMethod={searchScientist}
          onChange={(e) => options.editorCallback(e.target.value)}
          dropdown
        />
      );
    };

    const searchScientist = (event) => {
      const query = event.query;
      const filteredResults = appVars.appUsersFlattened.filter((username) =>
        username.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredResearchers(filteredResults);
    };

    const deleteBodyTemplate = (rowData) => {
      return (
        <Button
          type="button"
          icon="pi pi-trash"
          severity="danger"
          text
          onClick={() => {
            console.log(rowData.id);
            setDeleteId(rowData.id);
            setDisplayDeleteContainer(true);
          }}
        />
      );
    };

    let saveEdits = (e) => {
      let { newData } = e;
      editScreenSequence(newData);
    };

    let deleteRow = () => {
      deleteScreenRow(deleteId).then(() => {
        setDisplayDeleteContainer(false);
        setDeleteId(null);
      });
    };

    return (
      <React.Fragment>
        <div>
          <OverlayPanel
            ref={op}
            showCloseIcon
            id="overlay_panel"
            dismissable
            style={{ width: "450px" }}
          >
            <pre
              style={{
                maxWidth: "450px",
                overflow: "auto",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
              }}
            >
              {selectedProtocol}
            </pre>
          </OverlayPanel>
          <Sidebar
            visible={displayAddDialog}
            position="right"
            // style={{ width: "50%", overflowX: "auto" }}

            onHide={() => setDisplayAddDialog(false)}
            className="p-sidebar-md"
          >
            <div className="card">
              <h3>{selectedTargetBasedScreen?.screenName}</h3>
              <i className="icon icon-common icon-plus-circle"></i> &nbsp; Add
              library screening information
              <hr />
              <br />
            </div>
            <ScreenSequenceAddForm
              screenId={screenId}
              onAdd={(newSequence) => {
                addScreenSequence(newSequence);
                setDisplayAddDialog(false);
              }}
              loading={isAddingScreenSequence}
            />
          </Sidebar>
          <div className="card p-fluid">
            <DataTable
              className="p-datatable-gridlines w-full"
              size="small"
              ref={dt}
              value={selectedTargetBasedScreen.screenSequences}
              showGridlines
              header={tableHeader}
              editMode="row"
              sortField="startDate"
              sortOrder={-1}
              onRowEditComplete={saveEdits}
              loading={isEditingScreenSequence}
              exportFilename={`Screen-${selectedTargetBasedScreen.screenName}-${selectedTargetBasedScreen.method}.csv`}
            >
              <Column
                field="library"
                header="Library"
                editor={(options) => textEditor(options)}
              />

              <Column
                field={"protocol"}
                body={protocolBodyTemplate}
                header="Protocol"
                editor={(options) => textEditor(options)}
              />
              <Column
                field="concentration"
                header="Inhibitor C (&micro;M)"
                editor={(options) => textEditor(options)}
              />
              <Column
                field="noOfCompoundsScreened"
                header="No. of Compounds"
                editor={(options) => textEditor(options)}
              />
              <Column
                field="scientist"
                header="Scientist"
                editor={(options) => scientistEditor(options)}
                style={{ wordWrap: "break-word" }}
              />
              <Column
                field="startDate"
                header="Start Date"
                editor={(options) => dateEditor(options)}
                body={StartDateTemplate}
                sortable
              />
              <Column
                field="endDate"
                header="End Date"
                editor={(options) => dateEditor(options)}
                body={EndDateTemplate}
                sortable
              />
              <Column
                field="unverifiedHitCount"
                header="Initial Hit Count"
                editor={(options) => textEditor(options)}
              />

              <Column
                field="confirmedHitCount"
                header="Validated Hit Count"
                editor={(options) => textEditor(options)}
              />

              <Column
                rowEditor
                headerStyle={{ minWidth: "4rem" }}
                bodyStyle={{ textAlign: "center" }}
              />
              {isDeletingAllowed && (
                <Column
                  body={deleteBodyTemplate}
                  exportable={false}
                  headerStyle={{ minWidth: "4rem" }}
                />
              )}
            </DataTable>
          </div>
        </div>
        {/* Data preview dialog, used when a excel file is uploaded */}
        <DataPreviewDialog
          headerMap={fieldToColumnName}
          existingData={selectedTargetBasedScreen.screenSequences}
          data={dataPreview}
          visible={showDataPreviewDialog}
          onHide={() => {
            setShowDataPreviewDialog(false);
            setDataPreview(null);
          }}
          onSave={batchInsertTargetBasedScreenSequence}
          isSaving={isBatchInsertingTargetBasedScreenSequence}
        />

        <Dialog
          className="bg-red-50"
          header={"Delete Library Screen Entry"}
          visible={displayDeleteContainer}
          closable={true}
          draggable={true}
          style={{ width: "50vw" }}
          onHide={() => setDisplayDeleteContainer(false)}
        >
          <DeleteConfirmation callBack={deleteRow} />
        </Dialog>
      </React.Fragment>
    );
  }

  return <Loading />;
};

export default observer(ScreenSequence);
