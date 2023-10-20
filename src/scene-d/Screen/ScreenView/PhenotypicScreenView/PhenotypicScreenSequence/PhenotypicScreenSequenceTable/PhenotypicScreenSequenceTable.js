import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import { OverlayPanel } from "primereact/overlaypanel";
import { Sidebar } from "primereact/sidebar";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ImDownload } from "react-icons/im";
import { SiMicrosoftexcel } from "react-icons/si";
import { TbBookDownload } from "react-icons/tb";
import DataPreviewDialog from "../../../../../../app/common/DataPreviewDialog/DataPreviewDialog";
import DeleteConfirmation from "../../../../../../app/common/DeleteConfirmation/DeleteConfirmation";
import FDate from "../../../../../../app/common/FDate/FDate";
import ExportToExcel from "../../../../../../app/common/Functions/Excel/ExportToExcel";
import { GenerateTemplate } from "../../../../../../app/common/Functions/Excel/GenerateTemplate";
import ImportFromExcel from "../../../../../../app/common/Functions/Excel/ImportFromExcel";
import {
  DateEditor,
  PersonNameEditor,
  TextEditor,
} from "../../../../../../app/common/Functions/TableEditorElements";
import PleaseWait from "../../../../../../app/common/PleaseWait/PleaseWait";
import ScreenStatus from "../../../../../../app/common/ScreenStatus/ScreenStatus";
import Loading from "../../../../../../app/layout/Loading/Loading";
import { RootStoreContext } from "../../../../../../app/stores/rootStore";
import PhenotypicScreenSequenceAddForm from "./PhenotypicScreenSequenceAddForm/PhenotypicScreenSequenceAddForm";

/**
 * PhenotypicScreenSequenceTable component displays a table of phenotypic screen sequences.
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.screenId - The id of the phenotypic screen.
 */

const PhenotypicScreenSequenceTable = ({ screenId }) => {
  // State variables
  const [displayAddDialog, setDisplayAddDialog] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState("");
  const op = useRef(null);
  const dt = useRef(null);
  const fileUpload = useRef(null);
  const [dataPreview, setDataPreview] = useState(null);
  const [showDataPreviewDialog, setShowDataPreviewDialog] = useState(false);
  const [displayDeleteContainer, setDisplayDeleteContainer] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Accessing the necessary properties from the rootStore
  const rootStore = useContext(RootStoreContext);
  const {
    isLoadingPhenotypicScreen,
    fetchPhenotypicScreen,
    selectedPhenotypicScreen,
    addPhenotypicScreenSequence,
    isLoadingPhenotypicScreenSequence,
    editPhenotypicScreenSequence,
    isEditingPhenotypicScreenSequence,
    batchInsertPhenotypicScreenSequence,
    isBatchInsertingPhenotypicScreenSequence,
    deleteScreenRow,
    isDeletingScreenRow,
  } = rootStore.screenPStore;

  const { user } = rootStore.userStore;

  const [filteredResearchers, setFilteredResearchers] = useState([]);
  const [showExcelImporter, setShowExcelImporter] = useState(false);

  useEffect(() => {
    if (
      selectedPhenotypicScreen === null ||
      selectedPhenotypicScreen.id !== screenId
    )
      fetchPhenotypicScreen(screenId);
  }, [selectedPhenotypicScreen, fetchPhenotypicScreen, screenId]);

  // Display a loading message while data is being fetched
  if (isLoadingPhenotypicScreen || selectedPhenotypicScreen === null) {
    return <PleaseWait />;
  }

  if (!isLoadingPhenotypicScreen && selectedPhenotypicScreen) {
    let isDeletingAllowed = user?.roles.includes("admin");

    // Map Data fields to Column Name
    const fieldToColumnName = {
      library: "Library",
      librarySize: "Library Size",
      protocol: "Protocol",
      noOfCompoundsScreened: "Compounds Screened",
      unverifiedHitCount: "Initial Hits",
      confirmedHitCount: "Confirmed Hits",
      hitRate: "Hit Rate",
      scientist: "Scientist",
      startDate: "Start Date",
      endDate: "End Date",
    };

    // Table header template

    const tableHeader = (
      <div className="flex w-full">
        <div className="flex w-6">
          <div className="flex gap-2 align-items-center">
            <div className="flex">
              <Button
                type="button"
                icon="icon icon-common icon-plus-circle"
                label="New Library Screen"
                className="p-button-text"
                style={{ height: "30px" }}
                onClick={() => setDisplayAddDialog(true)}
              />
            </div>
            <div className="flex">
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

                  className: "p-button-text m-0 p-1",
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
            <div className="flex">
              <Button
                type="button"
                icon={
                  <div className="flex pr-2">
                    <ImDownload />
                  </div>
                }
                label="Export"
                className="p-button-text"
                style={{ height: "30px" }}
                //onClick={() => exportCSV(false)}
                onClick={() =>
                  ExportToExcel({
                    jsonData: selectedPhenotypicScreen.screenSequences,
                    fileName: selectedPhenotypicScreen.screenName + "-Screens",
                    headerMap: fieldToColumnName,
                  })
                }
              />
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
                      fileName: "Phenotypic-Screen-Template",
                      headerMap: fieldToColumnName,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-6 justify-content-end gap-5">
          <div className="flex mr-6 gap-5">
            <ScreenStatus
              id={selectedPhenotypicScreen.id}
              status={selectedPhenotypicScreen?.status}
            />
            <Chip
              label={selectedPhenotypicScreen?.org?.alias}
              icon="ri-organization-chart"
            />
            <Chip
              label={selectedPhenotypicScreen?.method}
              icon="icon icon-common icon-circle-notch"
            />
          </div>
        </div>
      </div>
    );

    // Row body template for displaying the protocol with overlay panel
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

    // Template for displaying the start date of a sequence
    const StartDateTemplate = (rowData) => {
      return <FDate timestamp={rowData.startDate} hideTime={true} />;
    };

    // Template for displaying the end date of a sequence
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

    const CompoundsScreenedTemplate = (rowData) => {
      return rowData.noOfCompoundsScreened !== -1
        ? rowData.noOfCompoundsScreened
        : "NA";
    };

    const LibrarySizeTemplate = (rowData) => {
      return rowData.librarySize !== -1
        ? rowData.librarySize
        : "NA";
    };

    const UnverifiedHitCountTemplate = (rowData) => {
      return rowData.unverifiedHitCount !== -1
        ? rowData.unverifiedHitCount
        : "NA";
    };

    const ConfirmedHitCountTemplate = (rowData) => {
      return rowData.confirmedHitCount !== -1
        ? rowData.confirmedHitCount
        : "NA";
    };

    const HitRateTemplate = (rowData) => {
      return rowData.hitRate !== -1
        ? rowData.hitRate
        : "NA";
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

    // Function to save edits to the database
    let saveEdits = (e) => {
      let { newData } = e;
      editPhenotypicScreenSequence(newData);
    };

    let deleteRow = () => {
      deleteScreenRow(deleteId).then(() => {
        setDisplayDeleteContainer(false);
        setDeleteId(null);
      });
    };

    return (
      <React.Fragment>
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
          onHide={() => setDisplayAddDialog(false)}
          className="p-sidebar-md"
        >
          <div className="card">
            <h3>{selectedPhenotypicScreen?.screenName}</h3>
            <i className="icon icon-common icon-plus-circle"></i> &nbsp; Add
            library screening information
            <hr />
            <br />
          </div>
          <PhenotypicScreenSequenceAddForm
            screenId={screenId}
            onAdd={(newSequence) => {
              addPhenotypicScreenSequence(newSequence);
              setDisplayAddDialog(false);
            }}
            loading={isLoadingPhenotypicScreenSequence}
          />
        </Sidebar>
        <div className="card flex w-full max-w-full">
          <DataTable
            className="p-datatable-gridlines w-full"
            size="small"
            resizableColumns
            ref={dt}
            value={selectedPhenotypicScreen.screenSequences}
            showGridlines
            header={tableHeader}
            editMode="row"
            sortField="startDate"
            sortOrder={-1}
            onRowEditComplete={saveEdits}
            loading={isEditingPhenotypicScreenSequence}
            exportFilename={`Screen-${selectedPhenotypicScreen.screenName}-${selectedPhenotypicScreen.method}.csv`}
          >
            <Column
              field="library"
              header={fieldToColumnName["library"]}
              editor={(options) => TextEditor(options)}
            />
            <Column
              field="librarySize"
              header={fieldToColumnName["librarySize"]}
              headerStyle={{ maxWidth: "4rem", textWrap: "wrap" }}
              editor={(options) => TextEditor(options)}
              body={LibrarySizeTemplate}
            />
            <Column
              field={"protocol"}
              body={protocolBodyTemplate}
              header={fieldToColumnName["protocol"]}
              editor={(options) => TextEditor(options)}
            />
            <Column
              field="noOfCompoundsScreened"
              header={fieldToColumnName["noOfCompoundsScreened"]}
              headerStyle={{ maxWidth: "7rem", textWrap: "wrap" }}
              editor={(options) => TextEditor(options)}
              body={CompoundsScreenedTemplate}
            />
            <Column
              field="unverifiedHitCount"
              header={fieldToColumnName["unverifiedHitCount"]}
              headerStyle={{ maxWidth: "4rem", textWrap: "wrap" }}
              editor={(options) => TextEditor(options)}
              body={UnverifiedHitCountTemplate}
            />

            <Column
              field="confirmedHitCount"
              header={fieldToColumnName["confirmedHitCount"]}
              headerStyle={{ maxWidth: "6rem", textWrap: "wrap" }}
              editor={(options) => TextEditor(options)}
              body={ConfirmedHitCountTemplate}
            />
            <Column
              field="hitRate"
              header={fieldToColumnName["hitRate"]}
              headerStyle={{ maxWidth: "4rem", textWrap: "wrap" }}
              editor={(options) => TextEditor(options)}
              body={HitRateTemplate}
            />
            <Column
              field="scientist"
              header={fieldToColumnName["scientist"]}
              editor={(options) =>
                PersonNameEditor(
                  options,
                  filteredResearchers,
                  setFilteredResearchers
                )
              }
              style={{ wordWrap: "break-word" }}
            />
            <Column
              field="startDate"
              header={fieldToColumnName["startDate"]}
              editor={(options) => DateEditor(options)}
              body={StartDateTemplate}
              sortable
            />
            <Column
              field="endDate"
              header={fieldToColumnName["endDate"]}
              editor={(options) => DateEditor(options)}
              body={EndDateTemplate}
              sortable
            />

            <Column
              rowEditor
              headerStyle={{ width: "10%", minWidth: "4rem" }}
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

        {/* Data preview dialog, used when a excel file is uploaded */}
        <DataPreviewDialog
          headerMap={fieldToColumnName}
          existingData={selectedPhenotypicScreen.screenSequences}
          data={dataPreview}
          visible={showDataPreviewDialog}
          onHide={() => {
            setShowDataPreviewDialog(false);
            setDataPreview(null);
          }}
          onSave={batchInsertPhenotypicScreenSequence}
          isSaving={isBatchInsertingPhenotypicScreenSequence}
        />
        {/* Delete confirmation dialog */}
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

export default observer(PhenotypicScreenSequenceTable);
