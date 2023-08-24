import { observer } from "mobx-react-lite";
import { Menubar } from "primereact/menubar";

import { Chip } from "primereact/chip";
import { Column } from "primereact/column";
import { ConfirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import SectionHeading from "../../../../../../app/common/SectionHeading/SectionHeading";
import SmilesViewWithDetails from "../../../../../../app/common/SmilesViewWithDetails/SmilesViewWithDetails";
import Vote from "../../../../../../app/common/Vote/Vote";
import Loading from "../../../../../../app/layout/Loading/Loading";
import { RootStoreContext } from "../../../../../../app/stores/rootStore";
import "./ValidatedHitsDataTable.css";
import ValidatedHitsImporter from "./ValidatedHitsImporter/ValidatedHitsImporter";
import ValidatedHitsPromoteToHAEntry from "./ValidatedHitsPromoteToHAEntry/ValidatedHitsPromoteToHAEntry";

const ValidatedHitsList = ({ screenId }) => {
  const dt = useRef(null);
  const tableMenu = useRef(null);
  /* MobX Store */
  const rootStore = useContext(RootStoreContext);
  const {
    isLoadingTargetBasedScreen,
    fetchTargetBasedScreen,
    selectedTargetBasedScreen,
    fetchTargetBasedScreenSilently,
  } = rootStore.screenTStore;
  const { user } = rootStore.userStore;
  const { enableVoting, freezeVoting } = rootStore.votingStore;

  const [displayHitsImportSidebar, setDisplayHitsImportSidebar] =
    useState(false);

  const [selectionEnabled, setSelectionEnabled] = useState(false);
  const [revealVoteEnabled, setRevealVoteEnabled] = useState(false);
  const [selectedCompounds, setSelectedCompounds] = useState(null);
  const [displayPromoteToHAEntry, setDisplayPromoteToHAEntry] = useState(false);
  const [enableOneCLickVoting, setEnableOneCLickVoting] = useState(false);

  let tableMenuItems = [];

  useEffect(() => {
    fetchTargetBasedScreen(screenId);
  }, [fetchTargetBasedScreen, screenId]);

  if (isLoadingTargetBasedScreen || selectedTargetBasedScreen === null) {
    return <Loading />;
  }

  if (!isLoadingTargetBasedScreen && selectedTargetBasedScreen) {
  }

  /* Local functions */

  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  };

  let validatePromoteToHA = () => {
    if (selectedCompounds === null) {
      toast.warning(
        "No rows selected. Please select some rows to promote them."
      );
      return;
    }
    setDisplayPromoteToHAEntry(true);
  };

  let enableVotingCalled = () => {
    if (selectedCompounds === null) {
      toast.warning(
        "No rows selected. Please select some or all rows to enable voting."
      );
      return;
    }
    // create guids
    var voteIds = selectedCompounds.map(
      (selectedCompound) => selectedCompound.voteId
    );

    enableVoting(voteIds).then(() => setSelectionEnabled(false));
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

    freezeVoting(voteIds).then(() => setSelectionEnabled(false));
  };

  /* End Local functions */

  /* Table Body Templates */

  // const SourceBodyTemplate = (rowData) => {
  //   return <React.Fragment>{rowData.source}</React.Fragment>;
  // };

  const LibraryBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        {rowData.library}
        <br />
        {rowData.source}
      </React.Fragment>
    );
  };

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

  const EnzymeActivityBodyTemplate = (rowData) => {
    return <React.Fragment>{rowData.iC50}</React.Fragment>;
  };

  // const MethodBodyTemplate = (rowData) => {
  //   return <React.Fragment>{rowData.method}</React.Fragment>;
  // };

  const MICBodyTemplate = (rowData) => {
    return <React.Fragment>{rowData.mic}</React.Fragment>;
  };

  const ClusterBodyTemplate = (rowData) => {
    return <React.Fragment>{rowData.clusterGroup}</React.Fragment>;
  };

  const VoteBodyTemplate = (rowData) => {
    return (
      <div style={{ padding: "10px" }}>
        <Vote
          id={rowData.vote.id}
          voteData={rowData.vote}
          callBack={() => fetchTargetBasedScreenSilently(screenId, true)}
          revealVote={revealVoteEnabled}
          discussionReference={selectedTargetBasedScreen.screenName}
          discussionTags={[rowData.compound.externalCompoundIds]}
          enableOneCLickVoting={enableOneCLickVoting}
        />
      </div>
    );
  };

  var tableHeaderMenuitems = [...tableMenuItems];

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
            label={selectedTargetBasedScreen?.org.name}
            icon="ri-organization-chart"
          />
        </div>
        <div className="flex">
          <Chip
            label={selectedTargetBasedScreen?.method}
            icon="icon icon-common icon-circle-notch"
          />
        </div>
      </div>
    </div>
  );

  /* End Table Body Templates */

  /* Construct table menu items */

  if (selectedTargetBasedScreen.validatedHits.length !== 0) {
    let selectItem = {
      label: selectionEnabled ? "Cancel Selection" : "Select Rows",
      icon: selectionEnabled ? "pi pi-times-circle" : "pi pi-check-square",
      command: () => {
        setSelectionEnabled(!selectionEnabled);
      },
    };
    tableMenuItems.push(selectItem);
  }

  if (!isLoadingTargetBasedScreen && selectedTargetBasedScreen) {
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

    // Admin section

    if (selectedTargetBasedScreen.validatedHits.length !== 0) {
      let votingItem = {
        label: "Votes Management",
        items: [],
      };

      votingItem.items.push({
        label: enableOneCLickVoting
          ? "Disable One Click Voting"
          : "Enable One Click Voting",
        icon: enableOneCLickVoting
          ? "pi pi-times"
          : "icon icon-common icon-hand-pointer",
        command: () => {
          if (!enableOneCLickVoting) {
            toast.warning(
              "One-click voting is currently enabled, which means that there won't be any confirmation dialog when you vote. Please exercise caution when using this feature.",
              { autoClose: false }
            );
            setEnableOneCLickVoting(true);
          }
          if (enableOneCLickVoting) {
            toast.info(
              "One click voting is disabled. You will be prompted to confirm your vote."
            );
            setEnableOneCLickVoting(false);
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

    if (selectedTargetBasedScreen.validatedHits.length !== 0) {
      let showVotesItem = {
        label: revealVoteEnabled ? "Hide Votes" : "Reveal Votes",
        icon: revealVoteEnabled ? "pi pi-eye-slash" : "pi pi-eye",
        command: () => {
          setRevealVoteEnabled(!revealVoteEnabled);
          //console.log(revealVoteEnabled);
        },
      };
      tableMenuItems.push(showVotesItem);
    }

    if (selectedTargetBasedScreen.validatedHits.length !== 0) {
      let promotionItem = {
        label: "Promote To HA",
        icon: "pi pi-arrow-right",
        command: () => validatePromoteToHA(),
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
            className="p-datatable-gridlines w-full"
            size="small"
            ref={dt}
            value={selectedTargetBasedScreen.validatedHits}
            // paginator
            scrollable
            // rows={50}
            header={tableHeader}
            //className="p-datatable-screen-table"
            //globalFilter={globalFilter}
            emptyMessage="No hits found."
            resizableColumns
            columnResizeMode="fit"
            showGridlines
            responsiveLayout="scroll"
            selection={selectedCompounds}
            onSelectionChange={(e) => setSelectedCompounds(e.value)}
            dataKey="id"
            exportFilename={`Hits-${selectedTargetBasedScreen.screenName}-${selectedTargetBasedScreen.method}.csv`}
          >
            {selectionEnabled && (
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
              style={{ minWidth: "300px" }}
            />
            <Column
              field={(rowData) => rowData?.library + "|" + rowData.source}
              header="Library|Source"
              body={LibraryBodyTemplate}
              style={{ minWidth: "130px" }}
            />
            <Column
              field={(rowData) => rowData?.compound?.externalCompoundIds}
              header="Compound Id"
              body={CompoundIdBodyTemplate}
              style={{ minWidth: "150px" }}
            />

            <Column
              field="iC50"
              header="IC50 (&micro;M) "
              body={EnzymeActivityBodyTemplate}
              style={{ width: "50px" }}
              sortable
            />
            {/* <Column
              field="Method"
              header="Method"
              body={MethodBodyTemplate}
              style={{ width: "120px" }}
            /> */}
            <Column
              field="mic"
              header="MIC (&micro;M)"
              body={MICBodyTemplate}
              style={{ width: "50px" }}
            />
            <Column
              field="clusterGroup"
              header="Cluster"
              body={ClusterBodyTemplate}
              style={{ width: "90px" }}
              sortable
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
          <ValidatedHitsImporter
            screenId={selectedTargetBasedScreen.id}
            existingHits={selectedTargetBasedScreen.validatedHits}
          />
        </div>
      </Dialog>
      <Dialog
        header="Promote to Hit Assessment"
        visible={displayPromoteToHAEntry}
        //style={{ width: "50vw" }}
        //footer={renderFooter("displayBasic2")}
        onHide={() => setDisplayPromoteToHAEntry(false)}
        style={{ width: "90%" }}
        maximizable={true}
      >
        <ValidatedHitsPromoteToHAEntry
          compounds={selectedCompounds}
          screen={selectedTargetBasedScreen}
          close={() => setDisplayPromoteToHAEntry(false)}
        />
      </Dialog>
      <ConfirmDialog />
    </div>
  );
};

export default observer(ValidatedHitsList);
