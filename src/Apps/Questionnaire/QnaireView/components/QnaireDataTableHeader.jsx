import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import React from "react";
import QniareImport from "./QniareImport";

const QnaireDataTableHeader = ({ selectedQuestionnaire }) => {
  if (selectedQuestionnaire === undefined) return <p>Loading...</p>;
  return (
    <div className="table-header flex flex-row w-full">
      <div className="flex justify-content-start"></div>
      <div className="flex justify-content-end w-full">
        <div className="flex flex-grow min-w-max">
          <Button
            type="button"
            icon="icon icon-common icon-arrow-circle-down"
            label="Export"
            className="p-button-text p-button-md"
            onClick={() => console.log("Exporting to Excel")}
          />
        </div>
        <div className="flex flex-grow min-w-max">
          <QniareImport selectedQuestionnaire={selectedQuestionnaire} />
        </div>
      </div>
    </div>
  );
};

export default observer(QnaireDataTableHeader);
