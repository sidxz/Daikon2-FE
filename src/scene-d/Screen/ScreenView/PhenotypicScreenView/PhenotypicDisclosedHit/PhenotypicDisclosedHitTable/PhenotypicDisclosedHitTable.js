import { Chip } from "primereact/chip";
import { Column } from "primereact/column";
import { ConfirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Menubar } from "primereact/menubar";
import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import SectionHeading from "../../../../../../app/common/SectionHeading/SectionHeading";
import SmilesViewWithDetails from "../../../../../../app/common/SmilesViewWithDetails/SmilesViewWithDetails";
import Vote from "../../../../../../app/common/Vote/Vote";
import Loading from "../../../../../../app/layout/Loading/Loading";
import { RootStoreContext } from "../../../../../../app/stores/rootStore";
import PhenotypicValidatedHitsImporter from "./PhenotypicValidatedHitsImporter/PhenotypicValidatedHitsImporter";
import PhenotypicValidatedHitsPromoteToHAEntry from "./PhenotypicValidatedHitsPromoteToHAEntry/PhenotypicValidatedHitsPromoteToHAEntry";

const PhenotypicDisclosedHitTable = ({ screenId }) => {
  // Data Table Ref
  const dt = useRef(null);

  /* MobX Store */
  const rootStore = useContext(RootStoreContext);
  const {
    isLoadingPhenotypicScreen,
    fetchPhenotypicScreen,
    selectedPhenotypicScreen,
    fetchScreenSilent,
  } = rootStore.screenPStore;
  const { user } = rootStore.userStore;
  const { enableVoting, freezeVoting } = rootStore.votingStore;

  /* Local state management */

  const [displayHitsImportSidebar, setDisplayHitsImportSidebar] =
    useState(false);
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
    fetchPhenotypicScreen(screenId);
  }, [fetchPhenotypicScreen, screenId]);

  if (isLoadingPhenotypicScreen || selectedPhenotypicScreen === null) {
    return <Loading />;
  }

  if (!isLoadingPhenotypicScreen && selectedPhenotypicScreen) {
  }

  let tableMenuItems = [];

  /* Local functions */

  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
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
            label={selectedPhenotypicScreen?.org.name}
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
          icon: "icon icon-common icon-plus-circle",
          command: () => setDisplayHitsImportSidebar(true),
        },
        {
          label: "Export Hits",
          icon: "icon icon-fileformats icon-CSV",
          command: () => exportCSV(false),
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
          console.log(isVoteRevealed);
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
        visible={displayHitsImportSidebar}
        style={{ width: "90%" }}
        maximizable={true}
        maximized={true}
        onHide={() => setDisplayHitsImportSidebar(false)}
        className="p-sidebar-lg"
      >
        <div className="card">
          <SectionHeading
            icon="icon icon-conceptual icon-structures-3d"
            heading={"Import Validated Hits"}
            color={"#f4f4f4"}
            textColor={"#000000"}
          />
          <br />
          <PhenotypicValidatedHitsImporter
            screenId={selectedPhenotypicScreen.id}
            existingHits={selectedPhenotypicScreen.validatedHits}
          />
        </div>
      </Dialog>
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
    </div>
  );
};

export default PhenotypicDisclosedHitTable;
