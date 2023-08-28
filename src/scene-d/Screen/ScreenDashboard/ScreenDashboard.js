import { observer } from "mobx-react-lite";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { TabPanel, TabView } from "primereact/tabview";
import React, { useContext, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { DataReorganizationInProgress } from "../../../app/common/DataReorganizationInProgress/DataReorganizationInProgress";
import SectionHeading from "../../../app/common/SectionHeading/SectionHeading";
import Loading from "../../../app/layout/Loading/Loading";
import { RootStoreContext } from "../../../app/stores/rootStore";
import { appColors } from "../../../colors";
import PhenotypicScreenDashboard from "./PhenotypicScreenDashboard/PhenotypicScreenDashboard";
import ScreenDashAddPhenotypic from "./ScreenDashAddPhenotypic/ScreenDashAddPhenotypic";
import "./ScreenDashDataTable.css";
import ScreenOverview from "./ScreenOverview/ScreenOverview";

const ScreenDashboard = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    isLoadingTargetBasedScreens,
    targetBasedScreenRegistry,
    fetchTargetBasedScreens,
    targetBasedUniqueScreens,
  } = rootStore.screenTStore;
  const { user } = rootStore.userStore;

  /* Local State Management */

  useEffect(() => {
    if (targetBasedScreenRegistry.size === 0) fetchTargetBasedScreens();
  }, [targetBasedScreenRegistry, fetchTargetBasedScreens]); // eslint-disable-line react-hooks/exhaustive-deps

  /* local variables */

  const dt = useRef(null);

  if (!isLoadingTargetBasedScreens) {
    /* Table Body Templates */

    const TargetNameBodyTemplate = (rowData) => {
      return (
        <React.Fragment>
          <span className="p-column-title">Target</span>
          <NavLink to={"./target-based/" + rowData.targetName}>
            {rowData.targetName}
          </NavLink>
        </React.Fragment>
      );
    };

    const NotesBodyTemplate = (rowData) => {
      return (
        <React.Fragment>
          <span className="p-column-title">Notes</span>
          {rowData.notes}
        </React.Fragment>
      );
    };

    return (
      <div className="flex flex-column w-full fadein animation-duration-500">
        <div className="flex w-full">
          <SectionHeading
            icon="icon icon-common icon-search"
            heading="Screens"
            color={appColors.sectionHeadingBg.screen}
          />
        </div>
        <div className="flex w-full">
          <TabView className="w-full">
            <TabPanel header="Overview">
              <ScreenOverview />
            </TabPanel>
            <TabPanel header="Target Based">
              <div className="datatable-screens">
                <DataTable
                  ref={dt}
                  value={targetBasedUniqueScreens}
                  paginator
                  rows={20}
                  className="p-datatable-screens"
                  //globalFilter={globalFilter}
                  emptyMessage="No Screens found."
                  filterDisplay="row"
                >
                  <Column
                    field="targetName"
                    header="Name"
                    body={TargetNameBodyTemplate}
                    filter
                    filterMatchMode="contains"
                    filterPlaceholder="Search by Target Name"
                    className="min-w-max"
                    // style={{minWidth: "50rem"}}
                  />

                  {/* <Column field="status" header="Status" body={StatusBodyTemplate} /> */}

                  <Column
                    field="notes"
                    header="Notes"
                    body={NotesBodyTemplate}
                  />
                </DataTable>
              </div>
            </TabPanel>

            <TabPanel header="Phenotypic">
              {user.roles.includes("screener") ? (
                <div className="datatable-screens">
                  <PhenotypicScreenDashboard />
                </div>
              ) : (
                <DataReorganizationInProgress />
              )}
            </TabPanel>
            {(user.roles.includes("screener") ||
              user.roles.includes("admin")) && (
              <TabPanel header="+ New Phenotypic Screen">
                <ScreenDashAddPhenotypic />
              </TabPanel>
            )}
          </TabView>
        </div>
      </div>
    );
  }

  /** Loading Overlay */

  return <Loading />;
};

export default observer(ScreenDashboard);
