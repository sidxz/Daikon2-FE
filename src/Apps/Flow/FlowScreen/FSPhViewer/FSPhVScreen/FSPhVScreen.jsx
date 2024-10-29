import { observer } from "mobx-react-lite";
import { BlockUI } from "primereact/blockui";
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { Column } from "primereact/column";
import { confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Sidebar } from "primereact/sidebar";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../../../../Library/Loading/Loading";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../../../RootStore";
import { CalendarRowEditor } from "../../../../../Shared/TableRowEditors/CalendarRowEditor";
import { ScientistRowEditor } from "../../../../../Shared/TableRowEditors/ScientistRowEditor";
import { TextRowEditor } from "../../../../../Shared/TableRowEditors/TextRowEditor";
import { AppOrgResolver } from "../../../../../Shared/VariableResolvers/AppOrgResolver";
import { appColors } from "../../../../../constants/colors";
import { PhenoScreenIcon } from "../../../icons/PhenoScreenIcon";
import * as Helper from "./FSPhVScreenHelper";
import FSPhScreenRunAdd from "./components/FSPhScreenRunAdd";
import FSPhVScreenDataTableHeader from "./components/FSPhVScreenDataTableHeader";

const FSPhVScreen = ({}) => {
  const navigate = useNavigate();
  const rootStore = useContext(RootStoreContext);

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

  const [displayAddScreenSeqSideBar, setDisplayAddScreenSeqSideBar] =
    useState(false);
  const [isProtocolExpanded, setIsProtocolExpanded] = useState(false);

  if (isFetchingScreen) {
    return <Loading message={"Fetching Screen..."} />;
  }

  const addScreenSeqSideBarHeader = (
    <div className="flex align-items-center gap-2">
      <i className="icon icon-common icon-plus-circle"></i>
      <span className="font-bold">Add Screen Run</span>
    </div>
  );

  const deleteBodyTemplate = (rowData) => {
    const accept = () => {
      // Delete hit
      deleteScreenRun(rowData.id);
    };
    const reject = () => {
      // Do nothing
    };
    return (
      <Button
        severity="danger"
        icon="ri-delete-bin-2-line"
        className="p-button-text"
        onClick={() => {
          confirmDialog({
            message: "Do you want to delete this record?",
            header: "Delete Confirmation",
            icon: "pi pi-info-circle",
            defaultFocus: "reject",
            acceptClassName: "p-button-danger",
            accept,
            reject,
          });
        }}
      />
    );
  };

  if (selectedScreen && !isFetchingScreen) {
    return (
      <>
        <div className="flex flex-column w-full">
          <div className="flex w-full">
            <BreadCrumb
              model={Helper.breadCrumbItems(selectedScreen, navigate)}
            />
          </div>
          <div className="flex w-full">
            <SecHeading
              svgIcon={<PhenoScreenIcon size={"25em"} />}
              heading={"Screen - " + selectedScreen.name}
              displayHorizon={true}
              entryPoint={selectedScreen?.id}
              color={appColors.sectionHeadingBg.screen}
              customElements={[
                <Chip
                  label={getOrgNameById(selectedScreen?.primaryOrgId)}
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
                value={selectedScreen?.screenRuns}
                showGridlines
                editMode="row"
                sortField="startDate"
                sortOrder={-1}
                onRowEditComplete={(e) => updateScreenRun(e.newData)}
                //loading={isEditingScreenSequence}

                header={
                  <FSPhVScreenDataTableHeader
                    selectedScreen={selectedScreen}
                    setDisplayAddScreenSeqSideBar={
                      setDisplayAddScreenSeqSideBar
                    }
                  />
                }
              >
                <Column
                  field="library"
                  header="Library"
                  editor={(options) => TextRowEditor(options)}
                />

                <Column
                  field="librarySize"
                  header="Library Size"
                  editor={(options) => TextRowEditor(options)}
                />

                <Column
                  field={"protocol"}
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
                  field="noOfCompoundsScreened"
                  header="# Compounds Screened"
                  editor={(options) => TextRowEditor(options)}
                  //body={CompoundsScreenedTemplate}
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
                  header="# Initial Hits"
                  editor={(options) => TextRowEditor(options)}
                  // body={UnverifiedHitCountTemplate}
                />

                <Column
                  field="confirmedHitCount"
                  header="# Confirmed Hits"
                  editor={(options) => TextRowEditor(options)}
                  //body={ConfirmedHitCountTemplate}
                />

                <Column
                  field="hitRate"
                  header="Hit Rate"
                  editor={(options) => TextRowEditor(options)}
                  //body={ConfirmedHitCountTemplate}
                />

                <Column
                  field="notes"
                  header="Notes"
                  editor={(options) => TextRowEditor(options)}
                  //body={ConfirmedHitCountTemplate}
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
        <Sidebar
          visible={displayAddScreenSeqSideBar}
          position="right"
          onHide={() => setDisplayAddScreenSeqSideBar(false)}
          className="p-sidebar-sm"
          header={addScreenSeqSideBarHeader}
        >
          <FSPhScreenRunAdd
            closeSideBar={() => setDisplayAddScreenSeqSideBar(false)}
            screenId={selectedScreen?.id}
          />
        </Sidebar>
      </>
    );
  }

  return <div>FSPhVScreen</div>;
};

export default observer(FSPhVScreen);
