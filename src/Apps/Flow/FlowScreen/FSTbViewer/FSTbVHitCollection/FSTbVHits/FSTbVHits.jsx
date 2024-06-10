import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Sidebar } from "primereact/sidebar";
import React, { useContext, useEffect, useState } from "react";
import Loading from "../../../../../../Library/Loading/Loading";
import LoadingBlockUI from "../../../../../../Library/LoadingBlockUI/LoadingBlockUI";
import { RootStoreContext } from "../../../../../../RootStore";
import { TextRowEditor } from "../../../../../../Shared/TableRowEditors/TextRowEditor";
import Vote from "../../../shared/Vote/Vote";
import FSTbVHAddHit from "./FSTbVHitsHelper/FSTbVHAddHit";
import { FSTbVHDataTableHeader } from "./FSTbVHitsHelper/FSTbVHDataTableHeader";
import { StructureBodyTemplate } from "./FSTbVHitsHelper/FSTbVHDataTableHelper";
import FSTbVHExcelImport from "./FSTbVHitsHelper/FSTbVHExcelImport";
import FSTbVHPromote from "./FSTbVHitsHelper/FSTbVHPromote";

const FSTbVHits = ({ id }) => {
  const rootStore = useContext(RootStoreContext);

  const {
    getHitCollection,
    selectedHitCollection,
    isFetchingHitCollection,
    isAddingHitCollection,
  } = rootStore.hitCollectionStore;
  const { selectedScreen } = rootStore.screenStore;
  const {
    updateHit,
    deleteHit,
    isDeletingHit,
    isAddingHit,
    isUpdatingHit,
    isBatchInsertingHits,
  } = rootStore.hitStore;
  const { user } = rootStore.authStore;

  useEffect(() => {
    if (
      !isAddingHitCollection &&
      (selectedHitCollection === undefined || selectedHitCollection?.id !== id)
    ) {
      getHitCollection(id);
    }
  }, [id, getHitCollection]);

  const [displayAddHitSideBar, setDisplayAddHitSideBar] = useState(false);
  const [showFileUploadDialog, setShowFileUploadDialog] = useState(false);
  const [selectionEnabled, setSelectionEnabled] = useState(false);
  const [selectedHits, setSelectedHits] = useState(null);
  const [isVotesHidden, setIsVotesHidden] = useState(true);
  const [isOneClickVotingEnabled, setIsOneClickVotingEnabled] = useState(false);
  const [isPromoteSideBarVisible, setIsPromoteSideBarVisible] = useState(false);

  if (isFetchingHitCollection) {
    return <Loading message={"Fetching Hit Collection..."} />;
  }

  const addHitSideBarHeader = (
    <div className="flex align-items-center gap-2">
      <i className="icon icon-common icon-plus-circle"></i>
      <span className="font-bold">Add Hit</span>
    </div>
  );

  const deleteBodyTemplate = (rowData) => {
    const accept = () => {
      // Delete hit
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

  let votingBodyTemplate = (rowData) => {
    return (
      <Vote
        hit={rowData}
        isUpdatingHit={isUpdatingHit}
        updateHit={updateHit}
        userId={user.id}
        isVotesHidden={isVotesHidden}
        isOneClickVotingEnabled={isOneClickVotingEnabled}
      />
    );
  };

  if (selectedHitCollection !== undefined && !isFetchingHitCollection) {
    return (
      <>
        <div className="flex flex-column w-full">
          <div className="flex w-full">
            <LoadingBlockUI
              blocked={
                isDeletingHit ||
                isAddingHit ||
                isUpdatingHit ||
                isBatchInsertingHits
              }
              containerClassName="w-full"
            >
              <DataTable
                className="p-datatable-gridlines w-full"
                size="small"
                //ref={dt}
                editMode="row"
                onRowEditComplete={(e) => updateHit(e.newData)}
                dataKey="id"
                value={selectedHitCollection?.hits}
                paginator
                scrollable
                rows={100}
                header={
                  <FSTbVHDataTableHeader
                    showAddHitSideBar={() => setDisplayAddHitSideBar(true)}
                    selectedHitCollection={selectedHitCollection}
                    selectedScreen={selectedScreen}
                    showFileUploadDialog={() => setShowFileUploadDialog(true)}
                    selectionEnabled={selectionEnabled}
                    setSelectionEnabled={setSelectionEnabled}
                    selectedHits={selectedHits}
                    setSelectedHits={setSelectedHits}
                    isVotesHidden={isVotesHidden}
                    setIsVotesHidden={setIsVotesHidden}
                    isOneClickVotingEnabled={isOneClickVotingEnabled}
                    setIsOneClickVotingEnabled={setIsOneClickVotingEnabled}
                    showPromoteSideBar={() => setIsPromoteSideBarVisible(true)}
                  />
                }
                //globalFilter={globalFilter}
                emptyMessage="No hits found."
                resizableColumns
                columnResizeMode="fit"
                showGridlines
                selection={selectedHits}
                onSelectionChange={(e) => setSelectedHits(e.value)}
              >
                {selectionEnabled && (
                  <Column
                    selectionMode="multiple"
                    headerStyle={{ width: "3em" }}
                    className="fadein"
                  ></Column>
                )}
                <Column
                  field={(rowData) => rowData?.molecule?.smiles}
                  header="Structure"
                  body={StructureBodyTemplate}
                />

                <Column
                  field={"library"}
                  header="Library"
                  editor={(options) => TextRowEditor(options)}
                  sortable
                />
                <Column
                  field={"librarySource"}
                  header="Source"
                  editor={(options) => TextRowEditor(options)}
                />

                <Column
                  field={(rowData) => rowData?.molecule?.name}
                  header="Compound Name"
                />
                <Column
                  field={"iC50"}
                  header="IC50 (&micro;M) "
                  editor={(options) => TextRowEditor(options)}
                  sortable
                />
                <Column
                  field={"mic"}
                  header="MIC (&micro;M)"
                  editor={(options) => TextRowEditor(options)}
                  sortable
                />
                <Column
                  field={"clusterGroup"}
                  header="Cluster"
                  editor={(options) => TextRowEditor(options)}
                  sortable
                />
                <Column
                  field="voteScore"
                  header="Vote"
                  body={votingBodyTemplate}
                  sortable
                />

                <Column
                  rowEditor
                  header="Edit"
                  // headerStyle={{ width: "10%", minWidth: "8rem" }}
                  bodyStyle={{ textAlign: "center" }}
                />
                <Column body={deleteBodyTemplate} header="Delete" />
              </DataTable>
            </LoadingBlockUI>
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
            hitCollectionId={selectedHitCollection?.id}
          />
        </Sidebar>
        {/* File upload Dialog */}
        <Dialog
          header="Import Hits"
          visible={showFileUploadDialog}
          onHide={() => setShowFileUploadDialog(false)}
        >
          <FSTbVHExcelImport selectedHitCollection={selectedHitCollection} />
        </Dialog>

        <Sidebar
          visible={isPromoteSideBarVisible}
          position="right"
          onHide={() => setIsPromoteSideBarVisible(false)}
          className="p-sidebar-sm"
          header="Create a new Hit Assessment"
        >
          <FSTbVHPromote
            selectedScreen={selectedScreen}
            selectedHitCollection={selectedHitCollection}
            selectedHits={selectedHits}
            closeSideBar={() => setIsPromoteSideBarVisible(false)}
          />
        </Sidebar>
      </>
    );
  }

  return <></>;
};

export default observer(FSTbVHits);
