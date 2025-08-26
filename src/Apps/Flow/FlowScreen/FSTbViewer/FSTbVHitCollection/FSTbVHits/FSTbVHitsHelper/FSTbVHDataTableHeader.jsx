import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Menubar } from "primereact/menubar";
import { ToggleButton } from "primereact/togglebutton";
import { useState } from "react";
import { FcEmptyFilter } from "react-icons/fc";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TableCustomization from "../../../../../../../Library/TableCustomization/TableCustomization";
import { MolecuLogixIcon } from "../../../../../../MolecuLogix/Icons/MolecuLogixIcon";
import FSTbVHExcelBulkImport from "./FSTbVHExcelBulkImport";
import { ExportHitsToExcel } from "./FSTbVHExcelExport";
import FSTbVHExcelImport from "./FSTbVHExcelImport";
import { ExportTemplateExcel } from "./FSTbVHExportTemplate";
import {
  AllTbColumns,
  DtFieldsToExcelColumnMapping,
  TbHitsTableType,
} from "./FSTbVHitsConstants";

export const FSTbVHDataTableHeader = ({
  showAddHitSideBar,
  selectedHitCollection,
  selectedScreen,
  selectionEnabled,
  setSelectionEnabled,
  selectedHits,
  setSelectedHits,
  isVotesHidden,
  setIsVotesHidden,
  isOneClickVotingEnabled,
  setIsOneClickVotingEnabled,
  showPromoteSideBar,
  subStructureHighlight,
  setSubStructureHighlight,
  setShowStructureEditor,
  toggleEditMode,
  clusterHits,
  filterNotVoted,
  setFilterNotVoted,
  filterDisclosed,
  setFilterDisclosed,
}) => {
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showTableCustomization, setShowTableCustomization] = useState(false);
  const [clusterCutOff, setClusterCutOff] = useState(0.85);
  const [showClusterDialog, setShowClusterDialog] = useState(false);
  const [showBulkUploadDialog, setShowBulkUploadDialog] = useState(false);
  if (selectedHitCollection === undefined) {
    console.log("selectedHitCollection is undefined");
  }

  /* Clustering Template */
  const acceptClustering = () => {
    console.log("Clustering accepted with cut-off:", clusterCutOff);
    clusterHits(selectedHitCollection?.id, clusterCutOff);
  };

  const rejectClustering = () => {
    console.log("Clustering rejected");
  };

  const toggleOneClickVoting = (e) => {
    console.log("Toggling One Click Voting");
    console.log(e.value);
    toast.info(`One Click Voting is now ${e.value ? "Enabled" : "Disabled"}.`);
    setIsOneClickVotingEnabled(!isOneClickVotingEnabled);
    console.log(
      "One Click Voting toggled to:",
      isOneClickVotingEnabled ? "Disabled" : "Enabled"
    );
  };

  const clusterDialogTemplate = () => (
    <div className="flex flex-column align-items-left w-full gap-3">
      <div className="flex-auto">
        <span>
          Please confirm to continue. This will group or regroup the existing
          hits into clusters.
        </span>
      </div>

      <div className="flex-auto">
        <label htmlFor="locale-user" className="font-bold block mb-2">
          Cluster Similarity Cutoff
        </label>
        <InputNumber
          value={clusterCutOff}
          onValueChange={(e) => setClusterCutOff(e.value)}
          min={0.1}
          max={1.0}
        />
      </div>
      <div className="flex-auto">
        <Button
          label="Cancel"
          icon="pi pi-times"
          className="p-button-text"
          onClick={() => {
            rejectClustering();
            setShowClusterDialog(false);
          }}
        />
        <Button
          label="Cluster"
          icon="pi pi-check"
          className="p-button-text"
          onClick={() => {
            acceptClustering();
            setShowClusterDialog(false);
          }}
        />
      </div>
      <div className="flex-auto">
        <Divider />
      </div>
      <div className="flex-auto">
        The current method for structural clustering uses the{" "}
        <Link
          to={"https://pubs.acs.org/doi/full/10.1021/ci9803381"}
          target="_blank"
        >
          Butina
        </Link>{" "}
        algorithm.
        <br />
        Tanimoto similarity index is used to measure similarity, ranging from 0
        (no similarity) to 1 (high similarity).
      </div>
    </div>
  );

  /* End Clustering Template */

  const items = [
    {
      label: "File",
      icon: "pi pi-briefcase",
      items: [
        {
          label: "New Hit",
          icon: "pi pi-plus-circle",
          command: () => showAddHitSideBar(),
        },
        {
          label: "Import Excel",
          icon: "pi pi-file-import",
          command: () => setShowImportDialog(true),
        },
        {
          label: "Bulk Upload",
          icon: "pi pi-upload",
          command: () => setShowBulkUploadDialog(true),
        },
        {
          label: "Export To Excel",
          icon: "pi pi-file-export",
          command: () =>
            ExportHitsToExcel(
              selectedHitCollection,
              selectedScreen,
              DtFieldsToExcelColumnMapping
            ),
        },
        {
          label: "Template",
          icon: "pi pi-info-circle",
          command: () =>
            ExportTemplateExcel(
              selectedHitCollection,
              selectedScreen,
              DtFieldsToExcelColumnMapping
            ),
        },
      ],
    },
    {
      label: "View",
      icon: "pi pi-eye",
      items: [
        // filterDisclosed toggle button
        {
          label: filterDisclosed
            ? "Disclosed Only (Active)"
            : "Disclosed Only (Inactive)",
          icon: filterDisclosed ? "pi pi-check-square" : "pi pi-filter-slash",
          command: () => setFilterDisclosed(!filterDisclosed),
        },
        {
          label: filterNotVoted ? "Show All" : "Filter Not Voted",
          icon: filterNotVoted ? "pi pi-check-square" : "pi pi-filter-slash",
          command: () => setFilterNotVoted(!filterNotVoted),
        },
      ],
    },
    {
      label: "Edit",
      icon: "pi pi-file-edit",
      command: () => toggleEditMode(),
    },
    {
      label: "Votes",
      icon: "pi pi-star",
      items: [
        {
          template: () => (
            <ToggleButton
              className="p-button-text w-full border-0 m-1"
              text
              checked={isVotesHidden}
              onChange={(e) => setIsVotesHidden(e.value)}
              onLabel="Votes Visible"
              onIcon="pi pi-eye"
              offLabel="Votes Hidden"
              offIcon="pi pi-eye-slash"
            />
          ),
        },
        {
          template: () => (
            <ToggleButton
              className="p-button-text w-full border-0 m-1"
              text
              checked={isOneClickVotingEnabled}
              onChange={(e) => toggleOneClickVoting(e)}
              onLabel="One Click Voting Enabled"
              onIcon="icon icon-common icon-hand-pointer"
              offLabel="One Click Voting Disabled"
              offIcon="pi pi-times"
            />
          ),
        },
      ],
    },
    {
      label: "Tools",
      icon: "pi pi-search",
      items: [
        {
          label: "Cluster",
          icon: "pi pi-bolt",
          command: () => setShowClusterDialog(true),
        },
      ],
    },
    {
      label: "Customize",
      icon: "pi pi-cog",
      items: [
        {
          label: "Columns",
          icon: "pi pi-objects-column",
          command: () => setShowTableCustomization(true),
        },
      ],
    },
  ];

  const start = (
    <div className="flex flex-column">
      <div className="flex flex-grow min-w-max w-full">
        <div className="flex border-1 border-50">
          <div className="flex w-full">
            <InputText
              id="subSmiles"
              placeholder="Highlight Substructure"
              className="border-0"
              value={subStructureHighlight}
              onChange={(e) => setSubStructureHighlight(e.target.value)}
            />
          </div>
          <div className="flex border-1 border-50 p-0">
            <Button
              text
              type="button"
              icon={<MolecuLogixIcon size={18} />}
              label=""
              onClick={() => setShowStructureEditor(true)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const end = (filterNotVoted || filterDisclosed) && (
    <div className="flex fadein animation-duration-1000 shadow-0 p-2 align-items-center">
      <div className="flex p-1">
        <FcEmptyFilter />
      </div>
      <div className="flex text-sm text-green-800	">
        Showing Filtered Results
      </div>
    </div>
  );

  if (selectedHitCollection) {
    return (
      <div className="table-header flex w-full">
        <Menubar
          model={items}
          start={start}
          end={end}
          className="w-full border-0"
        />
        <FSTbVHExcelImport
          selectedHitCollection={selectedHitCollection}
          visible={showImportDialog}
          onHide={() => setShowImportDialog(false)}
        />
        <FSTbVHExcelBulkImport
          selectedHitCollection={selectedHitCollection}
          visible={showBulkUploadDialog}
          onHide={() => setShowBulkUploadDialog(false)}
        />

        <TableCustomization
          visible={showTableCustomization}
          onHide={() => setShowTableCustomization(false)}
          tableType={TbHitsTableType}
          tableInstanceId={selectedHitCollection?.id}
          allColumns={AllTbColumns}
          headerLabel={"Customize View for " + selectedHitCollection?.name}
        />
        <Dialog
          header="Confirm Clustering"
          visible={showClusterDialog}
          onHide={() => {
            if (!showClusterDialog) return;
            setShowClusterDialog(false);
          }}
        >
          {clusterDialogTemplate()}
        </Dialog>
      </div>
    );
  }

  return <p>Loading ...</p>;
};
