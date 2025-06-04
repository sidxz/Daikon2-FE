import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { ProgressBar } from "primereact/progressbar";
import { Sidebar } from "primereact/sidebar";
import { useContext, useEffect, useRef, useState } from "react";
import { appColors } from "../../../../../../constants/colors";
import JSMEditor from "../../../../../../Library/JSME/JSMEditor";
import Loading from "../../../../../../Library/Loading/Loading";
import { RootStoreContext } from "../../../../../../RootStore";
import { TextRowEditor } from "../../../../../../Shared/TableRowEditors/TextRowEditor";
import { AppRoleResolver } from "../../../../../../Shared/VariableResolvers/AppRoleResolver";
import { ScreenAdminRoleName } from "../../../constants/roles";
import { DoseResponseBodyTemplate } from "../../../FSTbViewer/FSTbVHitCollection/FSTbVHits/FSTbVHitsHelper/FSTbVHDataTableHelper";
import { getUniqueMoleculeNames } from "../../../shared/SharedHelper";
import Vote from "../../../shared/Vote/Vote";
import FSPhVHAddHit from "./FSPhVHitsHelper/FSPhVHAddHit";
import { FSPhVHDataTableHeader } from "./FSPhVHitsHelper/FSPhVHDataTableHeader";
import { StructureBodyTemplate } from "./FSPhVHitsHelper/FSPhVHDataTableHelper";
import FSPhVHExcelImport from "./FSPhVHitsHelper/FSPhVHExcelImport";
import { PhHitsTableType } from "./FSPhVHitsHelper/FSPhVHitsConstants";
import FSPhVHPromote from "./FSPhVHitsHelper/FSPhVHPromote";

const FSPhVHits = ({ id }) => {
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
    clusterHits,
    isClusteringHits,
  } = rootStore.hitStore;
  const { user } = rootStore.authStore;

  const { isUserInAnyOfRoles } = AppRoleResolver();

  const {
    getCustomization,
    selectedTableCustomization,
    isFetchingTableCustomization,
    setCustomizationUser,
    setCustomizationGlobal,
    removeUserCustomization,
    isSavingUser,
    isSavingGlobal,
  } = rootStore.tableCustomizationStore;

  const selectedHitCollectionId = selectedHitCollection?.id ?? null;
  const selectedTableCustomizationId =
    selectedTableCustomization?.tableInstanceId ?? null;
  const [filterNotVoted, setFilterNotVoted] = useState(false);

  /* Set the scroll height of the table dynamically */
  const tableRef = useRef(null);
  const [scrollHeight, setScrollHeight] = useState("70vh");

  const updateScrollHeight = () => {
    if (tableRef.current) {
      const rect = tableRef.current.getBoundingClientRect();
      const offsetTop = rect.top;
      const windowHeight = window.innerHeight;
      const calculatedHeight = windowHeight - offsetTop - 20; // 20px bottom padding
      console.log(calculatedHeight);
      setScrollHeight(`${calculatedHeight}px`);
    }
  };
  useEffect(() => {
    updateScrollHeight(); // on mount
    window.addEventListener("resize", updateScrollHeight); // on resize

    return () => {
      window.removeEventListener("resize", updateScrollHeight);
    };
  }, []);
  /* End of scroll height update */

  // useEffect(() => {
  //   if (
  //     !isAddingHitCollection &&
  //     (selectedHitCollection === undefined || selectedHitCollection?.id !== id)
  //   ) {
  //     getHitCollection(id);
  //   }
  // }, [id, getHitCollection]);
  useEffect(() => {
    if (
      !isAddingHitCollection &&
      (selectedHitCollectionId === null || selectedHitCollectionId !== id)
    ) {
      console.log("useEffect : FSPhVHits: getHitCollection", id);
      getHitCollection(id);
      updateScrollHeight();
    }
  }, [id, selectedHitCollectionId, isAddingHitCollection, getHitCollection]);

  useEffect(() => {
    if (
      selectedHitCollectionId !== null &&
      (selectedTableCustomizationId === null ||
        selectedTableCustomizationId !== selectedHitCollectionId)
    ) {
      console.log(
        "useEffect : FSPhVHits: getCustomization",
        selectedHitCollectionId
      );
      getCustomization(PhHitsTableType, selectedHitCollectionId);
      updateScrollHeight();
    }
  }, [selectedHitCollectionId, selectedTableCustomizationId, getCustomization]);

  const [displayAddHitSideBar, setDisplayAddHitSideBar] = useState(false);
  const [showFileUploadDialog, setShowFileUploadDialog] = useState(false);
  const [selectionEnabled, setSelectionEnabled] = useState(false);
  const [selectedHits, setSelectedHits] = useState(null);
  const [isVotesHidden, setIsVotesHidden] = useState(true);
  const [isOneClickVotingEnabled, setIsOneClickVotingEnabled] = useState(false);
  const [isPromoteSideBarVisible, setIsPromoteSideBarVisible] = useState(false);
  const [subStructureHighlight, setSubStructureHighlight] = useState("");
  const [showStructureEditor, setShowStructureEditor] = useState(false);
  const [editMode, setEditMode] = useState(false);

  if (
    isFetchingHitCollection ||
    isFetchingTableCustomization ||
    selectedHitCollectionId === null ||
    selectedTableCustomizationId === null
  ) {
    return <Loading message={"Fetching Hit Collection..."} />;
  }

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

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

  const allColumnDefs = [
    {
      key: "structure",
      header: "Structure",
      body: (rowData) => StructureBodyTemplate(rowData, subStructureHighlight),
      sortable: false,
    },
    {
      key: "library",
      header: "Library",
      editor: TextRowEditor,
      sortable: true,
    },
    {
      key: "librarySource",
      header: "Source",
      editor: TextRowEditor,
      sortable: false,
    },
    {
      key: "moleculeName",
      header: "Molecule Name",
      body: getUniqueMoleculeNames,
      sortable: true,
    },

    {
      key: "eC50",
      header: "EC50",
      editor: TextRowEditor,
      sortable: true,
    },
    {
      key: "eC50Unit",
      header: "EC50 Unit",
      editor: TextRowEditor,
      sortable: true,
    },

    {
      key: "gI50",
      header: "GI50",
      editor: TextRowEditor,
      sortable: true,
    },
    {
      key: "gI50Unit",
      header: "GI50 Unit",
      editor: TextRowEditor,
      sortable: true,
    },

    {
      key: "iC50",
      header: "IC50",
      editor: TextRowEditor,
      sortable: true,
    },
    {
      key: "iC50Unit",
      header: "IC50 Unit",
      editor: TextRowEditor,
      sortable: true,
    },

    {
      key: "kd",
      header: "Kd",
      editor: TextRowEditor,
      sortable: true,
    },
    {
      key: "kdUnit",
      header: "Kd Unit",
      editor: TextRowEditor,
      sortable: true,
    },

    {
      key: "ki",
      header: "Ki",
      editor: TextRowEditor,
      sortable: true,
    },
    {
      key: "kiUnit",
      header: "Ki Unit",
      editor: TextRowEditor,
      sortable: true,
    },

    {
      key: "lD50",
      header: "LD50",
      editor: TextRowEditor,
      sortable: true,
    },
    {
      key: "lD50Unit",
      header: "LD50 Unit",
      editor: TextRowEditor,
      sortable: true,
    },

    {
      key: "miC90",
      header: "MIC90",
      editor: TextRowEditor,
      sortable: true,
    },
    {
      key: "miC90Unit",
      header: "MIC90 Unit",
      editor: TextRowEditor,
      sortable: true,
    },
    {
      key: "miC90Condition",
      header: "MIC90 Condition",
      editor: TextRowEditor,
      sortable: true,
    },

    {
      key: "mic",
      header: "MIC",
      editor: TextRowEditor,
      sortable: true,
    },
    {
      key: "micUnit",
      header: "MIC Unit",
      editor: TextRowEditor,
      sortable: true,
    },
    {
      key: "micCondition",
      header: "MIC Condition",
      editor: TextRowEditor,
      sortable: true,
    },

    {
      key: "tgi",
      header: "TGI",
      editor: TextRowEditor,
      sortable: true,
    },
    {
      key: "tgiUnit",
      header: "TGI Unit",
      editor: TextRowEditor,
      sortable: true,
    },

    {
      key: "pctInhibition",
      header: "%Inh",
      editor: TextRowEditor,
      sortable: true,
    },
    {
      key: "pctInhibitionConcentration",
      header: "%Inh Conc",
      editor: TextRowEditor,
      sortable: true,
    },
    {
      key: "pctInhibitionConcentrationUnit",
      header: "%Inh Conc Unit",
      editor: TextRowEditor,
      sortable: true,
    },

    {
      key: "clusterGroup",
      header: "Cluster",
      editor: TextRowEditor,
      sortable: true,
    },
    {
      key: "assayType",
      header: "Assay Type",
      editor: TextRowEditor,
      sortable: true,
    },
    {
      key: "voteScore",
      field: "voteScore",
      header: "Vote",
      body: votingBodyTemplate,
      sortable: true,
    },
    {
      key: "notes",
      header: "Notes",
      editor: TextRowEditor,
      sortable: false,
    },
    {
      key: "doseResponses",
      header: "Dose Response",

      sortable: false,
      body: (rowData) => DoseResponseBodyTemplate(rowData),
    },
  ];

  if (
    selectedHitCollectionId !== null &&
    selectedHitCollectionId === id &&
    selectedTableCustomizationId !== null &&
    selectedTableCustomizationId === selectedHitCollectionId &&
    !isFetchingTableCustomization &&
    !isFetchingHitCollection
  ) {
    console.log("Generating Table Rendering");
    let viewableColumns = allColumnDefs.map((col) => {
      // Show all columns if selectedTableCustomization.columns is undefined or empty
      if (
        !selectedTableCustomization?.columns ||
        selectedTableCustomization.columns.length === 0 ||
        selectedTableCustomization.columns.includes(col.header)
      ) {
        return (
          <Column
            key={col.key}
            field={typeof col.field === undefined ? col.key : col.field}
            header={col.header}
            body={col.body}
            editor={col.editor ? (options) => col.editor(options) : undefined}
            sortable={col.sortable}
          />
        );
      }
      return null;
    });

    console.log("selectedHitCollection", selectedHitCollection);
    return (
      <>
        <div className="flex flex-column w-full">
          {(isDeletingHit ||
            isClusteringHits ||
            isAddingHit ||
            isUpdatingHit ||
            isBatchInsertingHits) && (
            <div className="flex w-full p-1">
              <ProgressBar
                mode="indeterminate"
                color={appColors.loadingBar}
                style={{ height: "4px", width: "100%" }}
              ></ProgressBar>
            </div>
          )}
          <div className="flex w-full">
            <DataTable
              loading={
                isDeletingHit ||
                isClusteringHits ||
                isAddingHit ||
                isUpdatingHit ||
                isBatchInsertingHits
              }
              className="p-datatable-gridlines w-full border-0"
              size="small"
              //ref={dt}
              editMode="row"
              onRowEditComplete={(e) => updateHit(e.newData)}
              dataKey="id"
              value={
                filterNotVoted
                  ? selectedHitCollection?.hits.filter(
                      (hit) => Object.keys(hit.voters).length == 0
                    )
                  : selectedHitCollection?.hits
              }
              paginator
              scrollable
              rows={100}
              scrollHeight={scrollHeight}
              sortField="clusterGroup"
              sortOrder={1}
              resizableColumns
              columnResizeMode="fit"
              showGridlines
              header={
                <FSPhVHDataTableHeader
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
                  subStructureHighlight={subStructureHighlight}
                  setSubStructureHighlight={setSubStructureHighlight}
                  setShowStructureEditor={setShowStructureEditor}
                  toggleEditMode={toggleEditMode}
                  clusterHits={clusterHits}
                  filterNotVoted={filterNotVoted}
                  setFilterNotVoted={setFilterNotVoted}
                />
              }
              //globalFilter={globalFilter}
              emptyMessage="No hits found."
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

              {viewableColumns}
              {editMode && (
                <Column
                  rowEditor
                  header="Edit"
                  // headerStyle={{ width: "10%", minWidth: "8rem" }}
                  bodyStyle={{ textAlign: "center" }}
                />
              )}
              {isUserInAnyOfRoles([ScreenAdminRoleName]) && editMode && (
                <Column body={deleteBodyTemplate} header="Delete" />
              )}
            </DataTable>
          </div>
        </div>
        {/* substructure highlight editor */}
        <Dialog
          visible={showStructureEditor}
          closable={false}
          modal={false}
          showHeader={false}
          onHide={() => setShowStructureEditor(false)}
          style={{
            width: "52rem",
            height: "44rem",
            overflow: "hidden !important",
          }}
          pt={{
            content: { style: { overflow: "hidden" } },
          }}
        >
          <div className="flex pt-5" style={{ overflow: "hidden" }}>
            <JSMEditor
              initialSmiles={subStructureHighlight}
              onSave={(s) => {
                setShowStructureEditor(false);
                setSubStructureHighlight(s);
              }}
            />
          </div>
        </Dialog>
        <Sidebar
          visible={displayAddHitSideBar}
          position="right"
          onHide={() => setDisplayAddHitSideBar(false)}
          className="p-sidebar-md"
          header={addHitSideBarHeader}
        >
          <FSPhVHAddHit
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
          <FSPhVHExcelImport selectedHitCollection={selectedHitCollection} />
        </Dialog>

        <Sidebar
          visible={isPromoteSideBarVisible}
          position="right"
          onHide={() => setIsPromoteSideBarVisible(false)}
          className="p-sidebar-sm"
          header="Create a new Hit Assessment"
        >
          <FSPhVHPromote
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

export default observer(FSPhVHits);
