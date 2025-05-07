import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Menubar } from "primereact/menubar";
import { ToggleButton } from "primereact/togglebutton";
import React, { useState } from "react";
import TableCustomization from "../../../../../../../Library/TableCustomization/TableCustomization";
import { MolecuLogixIcon } from "../../../../../../MolecuLogix/Icons/MolecuLogixIcon";
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
}) => {
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showTableCustomization, setShowTableCustomization] = useState(false);

  if (selectedHitCollection === undefined) return <p>Loading...</p>;

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
              className="p-button-text w-full"
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
              className="p-button-text w-full"
              checked={isOneClickVotingEnabled}
              onChange={(e) => setIsOneClickVotingEnabled(e.value)}
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

  const end = (
    <div className="flex flex-column">
      {/* <Button
        type="button"
        className="p-button-text p-button-md"
        icon="pi pi-cog"
        label="Customize Table"
        onClick={(e) => op.current.toggle(e)}
      /> */}
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
        <TableCustomization
          visible={showTableCustomization}
          onHide={() => setShowTableCustomization(false)}
          tableType={TbHitsTableType}
          tableInstanceId={selectedHitCollection?.id}
          allColumns={AllTbColumns}
          headerLabel={"Customize View for " + selectedHitCollection?.name}
        />
      </div>
    );
  }

  return <p>Loading ...</p>;
};
