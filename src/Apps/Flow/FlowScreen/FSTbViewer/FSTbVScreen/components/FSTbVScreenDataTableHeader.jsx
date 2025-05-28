import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import React from "react";
import ScreenExpectedDates from "../../../shared/ScreenExpectedDates";
import ScreenStatusDropdown from "../../../shared/ScreenStatusDropdown";
import { DtFieldsToScreenExcelColumnMapping } from "./FSTbScreenRunConstants";
import { ExportScreenRunsToExcel } from "./FSTbScreenRunExport";
import { ExportTemplateExcel } from "./FSTbScreenRunExportTemplate";
import FSTbV_ScreenRunExcelImport from "./FSTbScreenRunImportExcel";


const FSTbVScreenDataTableHeader = ({
  selectedScreen,
  setDisplayAddScreenSeqSideBar,
}) => {
  if (selectedScreen === undefined) return <p>Loading...</p>;


  return (
    <div className="table-header flex flex-row w-full">
      <div className="flex justify-content-start">
        <div className="flex flex-grow min-w-max">
          <ScreenExpectedDates selectedScreen={selectedScreen} />
        </div>
      </div>
      <div className="flex justify-content-end w-full">
        <div className="flex flex-grow min-w-max">
          <ScreenStatusDropdown id={selectedScreen.id} readOnly={false} />
        </div>


        <div className="flex flex-grow min-w-max">
          <Button
            type="button"
            icon="pi pi-plus"
            label="Add Library Screen"
            className="p-button-text p-button-md"
            onClick={() => setDisplayAddScreenSeqSideBar(true)}
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
                selectedScreen,
                DtFieldsToScreenExcelColumnMapping
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
              ExportScreenRunsToExcel(
                selectedScreen,
                DtFieldsToScreenExcelColumnMapping
              )
            }
          />
        </div>
        <div className="flex flex-grow min-w-max">
          <FSTbV_ScreenRunExcelImport selectedScreen={selectedScreen} />
        </div>
      </div>
    </div>
  );
};

export default observer(FSTbVScreenDataTableHeader);
