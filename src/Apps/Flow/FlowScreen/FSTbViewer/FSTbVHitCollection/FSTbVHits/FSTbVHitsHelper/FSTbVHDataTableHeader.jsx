import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ToggleButton } from "primereact/togglebutton";
import React, { useRef, useState } from "react";
import { MolecuLogixIcon } from "../../../../../../MolecuLogix/Icons/MolecuLogixIcon";
import { ExportHitsToExcel } from "./FSTbVHExcelExport";
import FSTbVHExcelImport from "./FSTbVHExcelImport";
import { ExportTemplateExcel } from "./FSTbVHExportTemplate";
import { DtFieldsToExcelColumnMapping } from "./FSTbVHitsConstants";
import { OverlayPanel } from "primereact/overlaypanel";
import { MultiSelect } from "primereact/multiselect";
import { Checkbox } from "primereact/checkbox";

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
}) => {
  if (selectedHitCollection === undefined) return <p>Loading...</p>;

  const op = useRef(null);

  const categories = [
    { name: "EC50", key: "ec50" },
    { name: "EC90", key: "ec90" },
    { name: "% Inhibition", key: "percentInhibition" },
    { name: "Cluster Group", key: "clusterGroup" },
    { name: "IC50", key: "ic50" },
    { name: "MIC", key: "mic" },
    { name: "Notes", key: "notes" },
  ];

  const [selectedCategories, setSelectedCategories] = useState([
    categories[4],
    categories[5],
  ]); // IC50, MIC by default

  const onCategoryChange = (e) => {
    let _selectedCategories = [...selectedCategories];
    if (e.checked) {
      _selectedCategories.push(e.value);
    } else {
      _selectedCategories = _selectedCategories.filter(
        (category) => category.key !== e.value.key
      );
    }
    setSelectedCategories(_selectedCategories);
  };

  if (selectedHitCollection) {
    return (
      <div className="table-header flex flex-row w-full">
        <div className="flex justify-content-start gap-1">
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
          <Button
            type="button"
            icon="pi pi-cog"
            label="Customize Hits Table"
            onClick={(e) => op.current.toggle(e)}
          />

          <OverlayPanel
            ref={op}
            showCloseIcon
            closeOnEscape
            dismissable={false}
          >
            <div className="flex flex-column gap-3 w-15rem">
              {categories.map((category) => (
                <div key={category.key} className="flex align-items-center">
                  <Checkbox
                    inputId={category.key}
                    name="category"
                    value={category}
                    onChange={onCategoryChange}
                    checked={selectedCategories.some(
                      (item) => item.key === category.key
                    )}
                  />
                  <label htmlFor={category.key} className="ml-2">
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </OverlayPanel>

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
            <FSTbVHExcelImport selectedHitCollection={selectedHitCollection} />
          </div>
        </div>
      </div>
    );
  }

  return <p>Loading ...</p>;
};
