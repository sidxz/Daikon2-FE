import { observer } from "mobx-react-lite";
import React from "react";
import { DVariableResolver } from "../../../../Shared/DVariable/DVariableResolver";

const PDTPreview = ({ rowData }) => {
  return (
    <div className="flex flex-column gap-1">
      <div className="flex font-bold capitalize">
        {DVariableResolver(rowData?.title)}
      </div>
      <div className="flex text-justify	line-height-3 select-text">
        {DVariableResolver(rowData?.shortSummary)?.replace(/\*/g, " ")}
      </div>
    </div>
  );
};

export default observer(PDTPreview);
