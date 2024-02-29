import { Button } from "primereact/button";
import React from "react";
import { ExportHitsToExcel } from "./FSTbVHExcelExport";
import FSTbVHExcelImport from "./FSTbVHExcelImport";
import { DtFieldsToExcelColumnMapping } from "./FSTbVHitsConstants";

export const FSTbVHDataTableHeader = ({
  showAddHitSideBar,
  selectedHitCollection,
  selectedScreen,
  selectionEnabled,
  setSelectionEnabled,
  selectedHits,
  setSelectedHits,
}) => {
  if (selectedHitCollection === undefined) return <p>Loading...</p>;

  if (selectedHitCollection) {
    return (
      <div className="table-header flex flex-row w-full">
        <div className="flex justify-content-start">
          {!selectionEnabled && (
            <div className="flex flex-grow min-w-max w-full">
              <Button
                type="button"
                icon="pi pi-check-square"
                label="Select Hits to Promote"
                className="p-button-text p-button-md"
                onClick={() => setSelectionEnabled(true)}
              />
            </div>
          )}
          {selectionEnabled && (
            <div className="flex flex-grow min-w-max w-full">
              <Button
                type="button"
                icon="pi pi-times-circle"
                label="Clear Selection"
                className="p-button-text p-button-md"
                onClick={() => {
                  setSelectionEnabled(false);
                  setSelectedHits([]);
                }}
              />
            </div>
          )}
          {selectionEnabled && selectedHits?.length > 0 && (
            <div className="flex flex-grow min-w-max w-full">
              <Button
                type="button"
                icon="icon icon-common icon-arrow-alt-circle-right"
                label="Promote to HA"
                className="p-button-text p-button-md"
                onClick={() => console.log(selectedHits)}
              />
            </div>
          )}
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
              icon="icon icon-common icon-arrow-circle-down"
              label="Export Hits"
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
