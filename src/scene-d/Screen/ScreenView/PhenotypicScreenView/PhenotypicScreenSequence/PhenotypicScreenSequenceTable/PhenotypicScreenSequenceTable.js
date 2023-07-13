import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { OverlayPanel } from "primereact/overlaypanel";
import { Sidebar } from "primereact/sidebar";
import React, { useContext, useEffect, useRef, useState } from "react";
import FDate from "../../../../../../app/common/FDate/FDate";
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
  } = rootStore.screenPStore;

  const [filteredResearchers, setFilteredResearchers] = useState([]);

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
    const exportCSV = (selectionOnly) => {
      dt.current.exportCSV({ selectionOnly });
    };

    // Table header template

    const tableHeader = (
      <div className="flex w-full">
        <div className="flex w-6">
          <div className="flex gap-2">
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
              <Button
                type="button"
                icon="icon icon-fileformats icon-CSV"
                label="Export"
                className="p-button-text"
                style={{ height: "30px" }}
                onClick={() => exportCSV(false)}
              />
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
              label={selectedPhenotypicScreen?.org.name}
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

    // Function to save edits to the database
    let saveEdits = (e) => {
      let { newData } = e;
      editPhenotypicScreenSequence(newData);
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
              header="Library"
              editor={(options) => TextEditor(options)}
            />
            <Column
              field="librarySize"
              header="Library Size"
              editor={(options) => TextEditor(options)}
            />
            <Column
              field={"protocol"}
              body={protocolBodyTemplate}
              header="Protocol"
              editor={(options) => TextEditor(options)}
            />
            <Column
              field="noOfCompoundsScreened"
              header="No. of Compounds"
              editor={(options) => TextEditor(options)}
            />
            <Column
              field="scientist"
              header="Scientist"
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
              header="Start Date"
              editor={(options) => DateEditor(options)}
              body={StartDateTemplate}
              sortable
            />
            <Column
              field="endDate"
              header="End Date"
              editor={(options) => DateEditor(options)}
              body={EndDateTemplate}
              sortable
            />
            <Column
              field="unverifiedHitCount"
              header="Initial Hit Count"
              editor={(options) => TextEditor(options)}
            />
            <Column
              field="hitRate"
              header="Hit Rate"
              editor={(options) => TextEditor(options)}
            />
            <Column
              field="primaryHitCount"
              header="Primary Hit Count"
              editor={(options) => TextEditor(options)}
            />
            <Column
              field="confirmedHitCount"
              header="Confirmed Hit Count"
              editor={(options) => TextEditor(options)}
            />
            <Column
              rowEditor
              headerStyle={{ width: "10%", minWidth: "8rem" }}
              bodyStyle={{ textAlign: "center" }}
            />
          </DataTable>
        </div>
      </React.Fragment>
    );
  }

  return <Loading />;
};

export default observer(PhenotypicScreenSequenceTable);
