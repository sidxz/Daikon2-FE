import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ToggleButton } from "primereact/togglebutton";
import React from "react";
import { MolecuLogixIcon } from "../../../../../../MolecuLogix/Icons/MolecuLogixIcon";
import { ExportHitsToExcel } from "./FSPhVHExcelExport";
import FSPhVHExcelImport from "./FSPhVHExcelImport";
import { ExportTemplateExcel } from "./FSPhVHExportTemplate";
import { DtFieldsToExcelColumnMapping } from "./FSPhVHitsConstants";

export const FSPhVHDataTableHeader = ({
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
}) => {
  if (selectedHitCollection === undefined) return <p>Loading...</p>;

  if (selectedHitCollection) {
    return (
      <div className="table-header flex flex-row w-full">
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
        <div className="flex justify-content-start gap-1">
          <div className="flex flex-grow min-w-max">
            <ToggleButton
              className="p-button-text p-button-md w-10rem"
              checked={isVotesHidden}
              onChange={(e) => setIsVotesHidden(e.value)}
              onLabel="Votes Visible"
              onIcon="pi pi-eye"
              offLabel="Votes Hidden"
              offIcon="pi pi-eye-slash"
            />
          </div>
          <div className="flex flex-grow min-w-max">
            <ToggleButton
              className="p-button-text p-button-md w-16rem"
              checked={isOneClickVotingEnabled}
              onChange={(e) => setIsOneClickVotingEnabled(e.value)}
              onLabel="One Click Voting Enabled"
              onIcon="icon icon-common icon-hand-pointer"
              offLabel="One Click Voting Disabled"
              offIcon="pi pi-times"
            />
          </div>
        </div>
        <div className="flex justify-content-end w-full">
          <div className="flex flex-grow min-w-max">
            <Button
              type="button"
              icon="pi pi-plus"
              label="Add Hit"
              className="p-button-text p-button-md"
              onClick={() => showAddHitSideBar()}
            />
          </div>
          <div className="flex flex-grow min-w-max">
            <Button
              type="button"
              icon="icon icon-common icon-download"
              label="Download Template"
              className="p-button-text p-button-md"
              onClick={() =>
                ExportTemplateExcel(
                  selectedHitCollection,
                  selectedScreen,
                  DtFieldsToExcelColumnMapping
                )
              }
            />
          </div>
          <div className="flex flex-grow min-w-max">
            <Button
              type="button"
              icon="icon icon-common icon-arrow-circle-down"
              label="Export"
              className="p-button-text p-button-md"
              onClick={() =>
                ExportHitsToExcel(
                  selectedHitCollection,
                  selectedScreen,
                  DtFieldsToExcelColumnMapping
                )
              }
            />
          </div>
          <div className="flex flex-grow min-w-max">
            <FSPhVHExcelImport selectedHitCollection={selectedHitCollection} />
          </div>
        </div>
      </div>
    );
  }

  return <p>Loading ...</p>;
};
