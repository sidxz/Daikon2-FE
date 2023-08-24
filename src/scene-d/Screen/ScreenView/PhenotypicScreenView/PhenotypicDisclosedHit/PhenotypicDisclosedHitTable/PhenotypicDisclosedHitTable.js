import { observer } from "mobx-react-lite";
import { Chip } from "primereact/chip";
import { Column } from "primereact/column";
import { ConfirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import { Menubar } from "primereact/menubar";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ImDownload } from "react-icons/im";
import { SiMicrosoftexcel } from "react-icons/si";
import { TbBookDownload } from "react-icons/tb";
import { toast } from "react-toastify";
import DataPreviewDialog from "../../../../../../app/common/DataPreviewDialog/DataPreviewDialog";
import ExportToExcel from "../../../../../../app/common/Functions/Excel/ExportToExcel";
import { GenerateTemplate } from "../../../../../../app/common/Functions/Excel/GenerateTemplate";
import ImportFromExcel from "../../../../../../app/common/Functions/Excel/ImportFromExcel";
import PleaseWait from "../../../../../../app/common/PleaseWait/PleaseWait";
import SmilesViewWithDetails from "../../../../../../app/common/SmilesViewWithDetails/SmilesViewWithDetails";
import Vote from "../../../../../../app/common/Vote/Vote";
import { RootStoreContext } from "../../../../../../app/stores/rootStore";
import PhenotypicValidatedHitsPromoteToHAEntry from "./PhenotypicValidatedHitsPromoteToHAEntry/PhenotypicValidatedHitsPromoteToHAEntry";
const PhenotypicDisclosedHitTable = ({ screenId }) => {
  // Data Table Ref
  const dt = useRef(null);
  const [dataPreview, setDataPreview] = useState(null);
  const [showDataPreviewDialog, setShowDataPreviewDialog] = useState(false);
  const [showFileUploadDialog, setShowFileUploadDialog] = useState(false);

  /* MobX Store */
  const rootStore = useContext(RootStoreContext);
  const {
    isLoadingPhenotypicScreen,
    fetchPhenotypicScreen,
    selectedPhenotypicScreen,
  } = rootStore.screenPStore;

  const { batchInsertHits, isBatchInsertingHits } = rootStore.hitsStore;
  const { user } = rootStore.userStore;
  const { enableVoting, freezeVoting } = rootStore.votingStore;

  /* Local state management */

  // state variable to allow row selection in the table
  const [allowRowSelection, setAllowRowSelection] = useState(false);
  // state variable to reveal votes
  const [isVoteRevealed, setIsVoteRevealed] = useState(false);
  // state variable to store selected compounds
  const [selectedCompounds, setSelectedCompounds] = useState(null);
  // state variable to show the promote to HA dialog
  const [isPromoteToHAEntryVisible, setIsPromoteToHAEntryVisible] =
    useState(false);
  // state variable to enable one click voting
  const [isOneClickVotingEnabled, setIsOneClickVotingEnabled] = useState(false);

  /* Fetch the phenotypic screen data on component mount or when screenId changes */

  useEffect(() => {
    if (
      selectedPhenotypicScreen === null ||
      selectedPhenotypicScreen.id !== screenId
    ) {
      //console.log("PhenotypicDisclosedHit.js: screenId: ", screenId);
      fetchPhenotypicScreen(screenId);
    }
  }, [selectedPhenotypicScreen, fetchPhenotypicScreen, screenId]);

  // Display a loading message while data is being fetched
  if (isLoadingPhenotypicScreen || selectedPhenotypicScreen === null) {
    return <PleaseWait />;
  }

  let tableMenuItems = [];

  /* Local functions */

  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  };

  // Map Data fields to Column Name
  const fieldToColumnName = {
    smile: "Structure",
    library: "Library",
    source: "Source",
    externalCompoundIds: "Compound Id",
    ic50: "IC50",
    mic: "MIC",
    molWeight: "Mol. Weight",
    molArea: "Mol. Area",
  };

  let enableVotingCalled = () => {
    if (selectedCompounds === null) {
      toast.warning(
        "No rows selected. Please select some or all rows to enable voting."
      );
      return;
    }
    var voteIds = selectedCompounds.map(
      (selectedCompound) => selectedCompound.voteId
    );
    enableVoting(voteIds).then(() => setAllowRowSelection(false));
  };

  let validateFreezeVoting = () => {
    if (selectedCompounds === null) {
      toast.warning(
        "No rows selected. Please select some or all rows to freeze voting."
      );
      return;
    }
    // create guids
    var voteIds = selectedCompounds.map(
      (selectedCompound) => selectedCompound.voteId
    );

    freezeVoting(voteIds).then(() => setAllowRowSelection(false));
  };

  /* End Local functions */

  /* Table Body Templates */

  const CompoundIdBodyTemplate = (rowData) => {
    return (
      <React.Fragment>{rowData?.compound?.externalCompoundIds}</React.Fragment>
    );
  };

  const StructureBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <div>
          <SmilesViewWithDetails
            compound={rowData?.compound}
            width={"220"}
            height={"220"}
          />
        </div>
      </React.Fragment>
    );
  };

  const VoteBodyTemplate = (rowData) => {
    return (
      <div style={{ padding: "10px" }}>
        <Vote
          id={rowData.vote.id}
          voteData={rowData.vote}
          callBack={() => fetchPhenotypicScreen(screenId, true, false)}
          revealVote={isVoteRevealed}
          discussionReference={selectedPhenotypicScreen.screenName}
          discussionTags={[rowData.compound.externalCompoundIds]}
          isOneClickVotingEnabled={isOneClickVotingEnabled}
        />
      </div>
    );
  };

  const tableHeader = (
    <div className="flex w-full">
      <div className="flex">
        <Menubar
          model={tableMenuItems}
          style={{ position: "sticky", zIndex: 2 }}
        />
      </div>
      <div className="flex ml-auto gap-2">
        <div className="flex">
          <Chip
            label={selectedPhenotypicScreen?.org?.alias}
            icon="ri-organization-chart"
          />
        </div>
        <div className="flex">
          <Chip
            label={selectedPhenotypicScreen?.method}
            icon="icon icon-common icon-circle-notch"
          />
        </div>
      </div>
    </div>
  );

  /* End Table Body Templates */

  /* Construct table menu items */

  if (selectedPhenotypicScreen.validatedHits.length !== 0) {
    let selectItem = {
      label: allowRowSelection ? "Cancel Selection" : "Select Rows",
      icon: allowRowSelection ? "pi pi-times-circle" : "pi pi-check-square",
      command: () => {
        setAllowRowSelection(!allowRowSelection);
      },
    };
    tableMenuItems.push(selectItem);
  }

  if (!isLoadingPhenotypicScreen && selectedPhenotypicScreen) {
    let itm = {
      label: "Hits Management",
      items: [
        {
          label: "Import Hits",
          icon: (
            <div className="flex pr-2">
              <SiMicrosoftexcel />
            </div>
          ),
          command: () => setShowFileUploadDialog(true),
        },
        {
          label: "Export Hits",
          icon: (
            <div className="flex pr-2">
              <ImDownload />
            </div>
          ),
          command: () =>
            ExportToExcel({
              jsonData: selectedPhenotypicScreen.validatedHits.map((hit) => {
                // Need to flatten the object for export
                return {
                  id: hit.id,
                  smile: hit.compound.smile,
                  library: hit.library,
                  source: hit.source,
                  externalCompoundIds: hit.compound.externalCompoundIds,
                  ic50: hit.iC50,
                  mic: hit.mic,
                  molWeight: hit.compound.molWeight,
                  molArea: hit.compound.molArea,
                };
              }),
              fileName: selectedPhenotypicScreen.screenName + "-Disclosed-Hits",
              headerMap: fieldToColumnName,
            }),
        },
        {
          label: "Download Template",
          icon: (
            <div className="flex pr-2">
              <TbBookDownload />
            </div>
          ),
          command: () =>
            ExportToExcel({
              jsonData: GenerateTemplate(fieldToColumnName),

              fileName: "Phenotypic-Validated-Hits-Template",
              headerMap: fieldToColumnName,
            }),
        },
      ],
    };
    tableMenuItems.push(itm);

    if (selectedPhenotypicScreen.validatedHits.length !== 0) {
      let votingItem = {
        label: "Votes Management",
        items: [],
      };
      votingItem.items.push({
        label: isOneClickVotingEnabled
          ? "Disable One Click Voting"
          : "Enable One Click Voting",
        icon: isOneClickVotingEnabled
          ? "pi pi-times"
          : "icon icon-common icon-hand-pointer",
        command: () => {
          if (!isOneClickVotingEnabled) {
            toast.warning(
              "One-click voting is currently enabled, which means that there won't be any confirmation dialog when you vote. Please exercise caution when using this feature.",
              { autoClose: false }
            );
            setIsOneClickVotingEnabled(true);
          }
          if (isOneClickVotingEnabled) {
            toast.info(
              "One click voting is disabled. You will be prompted to confirm your vote."
            );
            setIsOneClickVotingEnabled(false);
          }
        },
      });

      if (user.roles.includes("admin")) {
        votingItem.items.push(
          {
            label: "Enable Voting",
            icon: "pi pi-check",
            command: () => enableVotingCalled(),
          },
          {
            label: "Freeze Voting",
            icon: "pi pi-pause",
            command: () => validateFreezeVoting(),
          }
        );
      }

      tableMenuItems.push(votingItem);
    }

    if (selectedPhenotypicScreen.validatedHits.length !== 0) {
      let showVotesItem = {
        label: isVoteRevealed ? "Hide Votes" : "Reveal Votes",
        icon: isVoteRevealed ? "pi pi-eye-slash" : "pi pi-eye",
        command: () => {
          setIsVoteRevealed(!isVoteRevealed);
          //console.log(isVoteRevealed);
        },
      };
      tableMenuItems.push(showVotesItem);
    }

    if (selectedPhenotypicScreen.validatedHits.length !== 0) {
      let promotionItem = {
        label: "Promote To HA",
        icon: "pi pi-arrow-right",
        command: () => {
          if (!selectedCompounds) {
            toast.warning(
              "No rows selected. Please select some rows to promote them."
            );
            return;
          }
          setIsPromoteToHAEntryVisible(true);
        },
      };
      tableMenuItems.push(promotionItem);
    }
  }
  /* END Construct table menu items */

  return (
    <div className="flex w-full">
      <div className="datatable-validated-hits">
        <div className="card">
          <DataTable
            ref={dt}
            value={selectedPhenotypicScreen.validatedHits}
            // paginator
            scrollable
            // rows={50}
            header={tableHeader}
            //globalFilter={globalFilter}
            emptyMessage="No hits found."
            resizableColumns
            columnResizeMode="fit"
            size="small"
            showGridlines
            responsiveLayout="scroll"
            selection={selectedCompounds}
            onSelectionChange={(e) => setSelectedCompounds(e.value)}
            dataKey="id"
            exportFilename={`Hits-${selectedPhenotypicScreen.screenName}-${selectedPhenotypicScreen.method}.csv`}
          >
            {allowRowSelection && (
              <Column
                selectionMode="multiple"
                headerStyle={{ width: "3em" }}
              ></Column>
            )}
            {/* <Column
              field="Source"
              header="Source"
              body={SourceBodyTemplate}
              style={{ width: "12%" }}
            /> */}
            <Column
              field={(rowData) => rowData?.compound?.smile}
              header="Structure"
              body={StructureBodyTemplate}
              style={{ minWidth: "150px" }}
            />
            <Column
              field={(rowData) => rowData?.library}
              header="Library"
              style={{ minWidth: "130px" }}
            />
            <Column
              field={(rowData) => rowData?.source}
              header="Source"
              style={{ minWidth: "130px" }}
            />
            <Column
              field={(rowData) => rowData?.compound?.externalCompoundIds}
              header="Compound Id"
              style={{ minWidth: "150px" }}
            />

            <Column
              field="iC50"
              header="IC50 (&micro;M) "
              style={{ width: "50px" }}
              sortable
            />

            <Column
              field="mic"
              header="MIC (&micro;M)"
              style={{ width: "50px" }}
            />

            <Column
              field="voteScore"
              header="Vote"
              body={VoteBodyTemplate}
              style={{ minWidth: "200px" }}
              sortable
            />
          </DataTable>
        </div>
      </div>

      <Dialog
        header="Promote to Hit Assessment"
        visible={isPromoteToHAEntryVisible}
        //style={{ width: "50vw" }}
        //footer={renderFooter("displayBasic2")}
        onHide={() => setIsPromoteToHAEntryVisible(false)}
        style={{ width: "90%" }}
        maximizable={true}
      >
        <PhenotypicValidatedHitsPromoteToHAEntry
          compounds={selectedCompounds}
          screen={selectedPhenotypicScreen}
          close={() => setIsPromoteToHAEntryVisible(false)}
        />
      </Dialog>
      <ConfirmDialog />

      {/* File upload Dialog */}
      <Dialog
        header="Import Hits"
        visible={showFileUploadDialog}
        onHide={() => setShowFileUploadDialog(false)}
      >
        <FileUpload
          name="excelFile"
          accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          maxFileSize={1000000}
          mode="basic"
          chooseLabel="Select Excel File"
          chooseOptions={{
            icon: (
              <div className="flex pr-2">
                <SiMicrosoftexcel />
              </div>
            ),

            className: "p-button-text m-0 p-1 p-button-secondary",
          }}
          cancelOptions={{
            label: "Cancel",
            icon: "pi pi-times",
            className: "p-button-danger",
          }}
          className="p-button-text p-button-secondary"
          style={{ height: "30px" }}
          customUpload={true}
          uploadHandler={async (e) => {
            let file = e.files[0];
            const jsonData = await ImportFromExcel({
              file: file,
              headerMap: fieldToColumnName,
            });
            e.files = null;
            jsonData.forEach((row) => {
              row.screenId = selectedPhenotypicScreen.id;
              row.screenType = "Phenotypic";
              // fetch the row id if it exists in selectedPhenotypicScreen.validatedHits
              // let existingRow = selectedPhenotypicScreen.validatedHits.find(
              //   (d) => d.compound.externalCompoundIds === row.compoundExternalId
              // );
              // if (existingRow) {
              //   row.id = existingRow.id;
              // }
            });
            setDataPreview(jsonData);
            setShowDataPreviewDialog(true);
            setShowFileUploadDialog(false);
          }}
          auto
        />
      </Dialog>
      {/* Data preview dialog, used when a excel file is uploaded */}
      <DataPreviewDialog
        headerMap={fieldToColumnName}
        existingData={selectedPhenotypicScreen.validatedHits.map((hit) => {
          // Need to flatten the object for export
          return {
            id: hit.id,
            screenId: selectedPhenotypicScreen.id,
            screenType: "Phenotypic",
            smile: hit.compound.smile,
            library: hit.library,
            source: hit.source,
            externalCompoundIds: hit.compound.externalCompoundIds,
            ic50: hit.iC50,
            mic: hit.mic,
            molWeight: hit.compound.molWeight,
            molArea: hit.compound.molArea,
          };
        })}
        //comparatorKey="externalCompoundIds"
        data={dataPreview}
        visible={showDataPreviewDialog}
        onHide={() => {
          setShowDataPreviewDialog(false);
          setDataPreview(null);
        }}
        onSave={batchInsertHits}
        isSaving={isBatchInsertingHits}
      />
    </div>
  );
};

export default observer(PhenotypicDisclosedHitTable);
