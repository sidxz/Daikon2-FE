import { observer } from "mobx-react-lite";
import { Divider } from "primereact/divider";
import React from "react";
import { DVariableResolver } from "../../../../Shared/DVariable/DVariableResolver";
import MLTags from "../../../../Shared/TagGenerators/MLTags/MLTags";
import PDTFeedback from "../ParsedDocFeedback/PDTFeedback";

const PDTPreview = ({ rowData }) => {
  return (
    <div className="flex flex-column gap-1">
      <div className="flex align-content-center">
        <div className="flex font-bold capitalize surface-ground p-1 border-round-md">
          {DVariableResolver(rowData?.title)}
        </div>
        {rowData?.authors?.value?.length > 0 && (
          <div className="flex text-blue-700 p-1">
            | {DVariableResolver(rowData?.authors)}
          </div>
        )}
      </div>
      {DVariableResolver(rowData?.shortSummary) === null && (
        <div className="flex text-justify	line-height-3 select-text">
          Preview is not available.
        </div>
      )}
      <div className="flex text-justify	line-height-3 select-text">
        {DVariableResolver(rowData?.shortSummary)?.replace(/\*/g, " ")}
      </div>
      {rowData?.shortSummary?.value?.length > 0 && (
        <div className="flex border-0">
          <MLTags entity={rowData?.shortSummary} />
        </div>
      )}
      <div className="flex m-1 p-1 mt-4 mb-0">
        <PDTFeedback rowData={rowData} />
      </div>
      <Divider className="mt-0" />
    </div>
  );
};

export default observer(PDTPreview);
