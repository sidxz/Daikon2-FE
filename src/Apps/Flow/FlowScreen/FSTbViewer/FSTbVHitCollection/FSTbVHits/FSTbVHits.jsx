import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Sidebar } from "primereact/sidebar";
import React, { useContext, useState } from "react";
import { RootStoreContext } from "../../../../../../RootStore";
import FSTbVHAddHit from "./FSTbVHitsHelper/FSTbVHAddHit";
import { FSTbVHDataTableHeader } from "./FSTbVHitsHelper/FSTbVHDataTableHeader";
import {
  LibraryBodyTemplate,
  StructureBodyTemplate,
} from "./FSTbVHitsHelper/FSTbVHDataTableHelper";
import FSTbVHExcelImport from "./FSTbVHitsHelper/FSTbVHExcelImport";

const FSTbVHits = ({ hitCollection }) => {
  console.log("-->>>> FSTbVHits");
  console.log("hitCollection:", hitCollection);

  const rootStore = useContext(RootStoreContext);
  const { setSelectedHitCollection, selectedHitCollection } =
    rootStore.hitCollectionStore;
  const { selectedScreen } = rootStore.screenStore;
  const { deleteHit, isDeletingHit } = rootStore.hitStore;

  setSelectedHitCollection(hitCollection.id);

  const [displayAddHitSideBar, setDisplayAddHitSideBar] = useState(false);
  const [showFileUploadDialog, setShowFileUploadDialog] = useState(false);

  const addHitSideBarHeader = (
    <div className="flex align-items-center gap-2">
      <i className="icon icon-common icon-plus-circle"></i>
      <span className="font-bold">Add Hit</span>
    </div>
  );

  const deleteBodyTemplate = (rowData) => {
    const accept = () => {
      // Delete hit
      console.log("Delete hit:", rowData);
      deleteHit(rowData.id);
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

  return (
    <>
      <div className="flex flex-column w-full">
        <div className="flex w-full">
          <DataTable
            className="p-datatable-gridlines w-full"
            size="small"
            //ref={dt}
            value={hitCollection.hits}
            // paginator
            scrollable
            // rows={50}
            header={
              <FSTbVHDataTableHeader
                showAddHitSideBar={() => setDisplayAddHitSideBar(true)}
                selectedHitCollection={selectedHitCollection}
                selectedScreen={selectedScreen}
                showFileUploadDialog={() => setShowFileUploadDialog(true)}
              />
            }
            //className="p-datatable-screen-table"
            //globalFilter={globalFilter}
            emptyMessage="No hits found."
            resizableColumns
            columnResizeMode="fit"
            showGridlines
            //selection={selectedCompounds}
            //onSelectionChange={(e) => setSelectedCompounds(e.value)}
            dataKey="id"
            //exportFilename={`Hits-${selectedTargetBasedScreen.screenName}-${selectedTargetBasedScreen.method}.csv`}
          >
            <Column
              field={(rowData) => rowData?.requestedSMILES}
              header="Structure"
              body={StructureBodyTemplate}
            />

            <Column
              field={(rowData) => rowData?.library + " | " + rowData.source}
              header="Library | Source"
              body={LibraryBodyTemplate}
            />

            <Column
              field={(rowData) => rowData?.molecule?.name}
              header="Name"
            />
            <Column
              field={(rowData) => rowData?.iC50}
              header="IC50 (&micro;M) "
            />
            <Column field={(rowData) => rowData?.mic} header="MIC (&micro;M)" />
            <Column
              field={(rowData) => rowData?.clusterGroup}
              header="Cluster"
            />
            <Column body={deleteBodyTemplate} header="Delete" />
          </DataTable>
        </div>
      </div>
      <Sidebar
        visible={displayAddHitSideBar}
        position="right"
        onHide={() => setDisplayAddHitSideBar(false)}
        className="p-sidebar-md"
        header={addHitSideBarHeader}
      >
        <FSTbVHAddHit
          closeSideBar={() => setDisplayAddHitSideBar(false)}
          hitCollectionId={hitCollection.id}
        />
      </Sidebar>

      {/* File upload Dialog */}
      <Dialog
        header="Import Hits"
        visible={showFileUploadDialog}
        onHide={() => setShowFileUploadDialog(false)}
      >
        <FSTbVHExcelImport
          selectedHitCollection={selectedHitCollection}
          hideFileUploadDialog={() => setShowFileUploadDialog(false)}
        />
      </Dialog>
    </>
  );
};

export default observer(FSTbVHits);
