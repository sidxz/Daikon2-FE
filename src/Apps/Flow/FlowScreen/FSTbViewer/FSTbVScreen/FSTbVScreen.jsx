import { observer } from "mobx-react-lite";
import { BlockUI } from "primereact/blockui";
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { Column } from "primereact/column";
import { confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Sidebar } from "primereact/sidebar";
import React, { useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import Loading from "../../../../../Library/Loading/Loading";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../../../RootStore";
import { CalendarRowEditor } from "../../../../../Shared/TableRowEditors/CalendarRowEditor";
import { ScientistRowEditor } from "../../../../../Shared/TableRowEditors/ScientistRowEditor";
import { TextRowEditor } from "../../../../../Shared/TableRowEditors/TextRowEditor";
import { AppOrgResolver } from "../../../../../Shared/VariableResolvers/AppOrgResolver";
import { appColors } from "../../../../../constants/colors";
import { ScreenIcon } from "../../../icons/ScreenIcon";
import { FormatScreeningMethod } from "../../shared/Formatters";
import * as Helper from "./FSTbVScreenHelper";
import FSTbScreenRunAdd from "./components/FSTbScreenRunAdd";
import FSTbVScreenDataTableHeader from "./components/FSTbVScreenDataTableHeader";

// Main FSTbVScreen component
const FSTbVScreen = () => {
  const navigate = useNavigate();
  const rootStore = useContext(RootStoreContext);

  // Destructure relevant values from the store
  const { fetchScreen, isFetchingScreen, selectedScreen } =
    rootStore.screenStore;
  const { getOrgNameById } = AppOrgResolver();

  const {
    updateScreenRun,
    isUpdatingScreenRun,
    isAddingScreenRun,
    isDeletingScreenRun,
    deleteScreenRun,
  } = rootStore.screenRunStore;

  // Local state management
  const [displayAddScreenSeqSideBar, setDisplayAddScreenSeqSideBar] =
    useState(false);
  const [isProtocolExpanded, setIsProtocolExpanded] = useState(false);

  // Handle delete confirmation dialog
  const handleDelete = useCallback(
    (rowData) => {
      const accept = () => {
        try {
          deleteScreenRun(rowData.id);
        } catch (error) {
          console.error("Error deleting screen run:", error);
        }
      };

      confirmDialog({
        message: "Do you want to delete this record?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        defaultFocus: "reject",
        acceptClassName: "p-button-danger",
        accept,
      });
    },
    [deleteScreenRun]
  );

  // If data is still loading, show a loading component
  if (isFetchingScreen) {
    return <Loading message="Fetching Screen..." />;
  }

  // Render the delete button in each row
  const deleteBodyTemplate = (rowData) => (
    <Button
      severity="danger"
      icon="ri-delete-bin-2-line"
      className="p-button-text"
      onClick={() => handleDelete(rowData)}
    />
  );

  // Sidebar header for adding a new screen run
  const addScreenSeqSideBarHeader = (
    <div className="flex align-items-center gap-2">
      <i className="icon icon-common icon-plus-circle"></i>
      <span className="font-bold">Add Screen Run</span>
    </div>
  );

  // Main component UI for rendering screen details
  if (selectedScreen) {
    return (
      <>
        <div className="flex flex-column w-full">
          {/* Breadcrumb Navigation */}
          <div className="flex w-full">
            <BreadCrumb
              model={Helper.breadCrumbItems(selectedScreen, navigate)}
            />
          </div>

          {/* Section Heading with Screen Information */}
          <div className="flex w-full">
            <SecHeading
              svgIcon={<ScreenIcon size="25em" />}
              heading={`Screen - ${selectedScreen.name}`}
              displayHorizon
              entryPoint={selectedScreen.id}
              color={appColors.sectionHeadingBg.screen}
              customElements={[
                <Chip
                  label={FormatScreeningMethod(selectedScreen.method)}
                  icon="icon icon-common icon-circle-notch"
                />,
                <Chip
                  label={getOrgNameById(selectedScreen.primaryOrgId)}
                  icon="ri-organization-chart"
                  className="mr-3"
                />,
              ]}
            />
          </div>
          <div className="flex w-full border-1 border-50 border-round-md mb-1">
            <div className="flex m-1 p-1 text-color-secondary	">
              Notes: {selectedScreen.notes}
            </div>
          </div>

          {/* DataTable Section */}
          <div className="flex w-full">
            <BlockUI
              blocked={
                isUpdatingScreenRun || isAddingScreenRun || isDeletingScreenRun
              }
              containerClassName="w-full"
            >
              <DataTable
                className="p-datatable-gridlines w-full"
                size="small"
                value={selectedScreen.screenRuns}
                showGridlines
                editMode="row"
                sortField="startDate"
                sortOrder={-1}
                onRowEditComplete={(e) => updateScreenRun(e.newData)}
                header={
                  <FSTbVScreenDataTableHeader
                    selectedScreen={selectedScreen}
                    setDisplayAddScreenSeqSideBar={
                      setDisplayAddScreenSeqSideBar
                    }
                  />
                }
              >
                {/* Columns */}
                <Column
                  field="library"
                  header="Library"
                  editor={(options) => TextRowEditor(options)}
                />
                <Column
                  field="protocol"
                  body={(rowData) =>
                    Helper.ProtocolBodyTemplate(rowData, isProtocolExpanded)
                  }
                  header={Helper.ProtocolHeaderTemplate(
                    isProtocolExpanded,
                    setIsProtocolExpanded
                  )}
                  editor={(options) => TextRowEditor(options)}
                />
                <Column
                  field="concentration"
                  header="Inhibitor C (µM)"
                  editor={(options) => TextRowEditor(options)}
                />
                <Column
                  field="noOfCompoundsScreened"
                  header="No. of Compounds"
                  editor={(options) => TextRowEditor(options)}
                />
                <Column
                  field="scientist"
                  header="Scientist"
                  editor={(options) => ScientistRowEditor(options)}
                  style={{ wordWrap: "break-word" }}
                />
                <Column
                  field="startDate"
                  header="Start Date"
                  editor={(options) => CalendarRowEditor(options)}
                  body={Helper.StartDateTemplate}
                  sortable
                />
                <Column
                  field="endDate"
                  header="End Date"
                  editor={(options) => CalendarRowEditor(options)}
                  body={Helper.EndDateTemplate}
                  sortable
                />
                <Column
                  field="primaryHitCount"
                  header="Initial Hit Count"
                  editor={(options) => TextRowEditor(options)}
                />
                <Column
                  field="confirmedHitCount"
                  header="Validated Hit Count"
                  editor={(options) => TextRowEditor(options)}
                />
                <Column
                  rowEditor
                  headerStyle={{ minWidth: "4rem" }}
                  bodyStyle={{ textAlign: "center" }}
                />
                <Column body={deleteBodyTemplate} header="Delete" />
              </DataTable>
            </BlockUI>
          </div>
        </div>

        {/* Sidebar for Adding Screen Run */}
        <Sidebar
          visible={displayAddScreenSeqSideBar}
          position="right"
          onHide={() => setDisplayAddScreenSeqSideBar(false)}
          className="p-sidebar-sm"
          header={addScreenSeqSideBarHeader}
        >
          <FSTbScreenRunAdd
            closeSideBar={() => setDisplayAddScreenSeqSideBar(false)}
            screenId={selectedScreen.id}
          />
        </Sidebar>
      </>
    );
  }

  // Default render when no screen is selected
  return <div>FSTbVScreens</div>;
};

export default observer(FSTbVScreen);
