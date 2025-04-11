import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { DVariableResolver } from "../../../../Shared/DVariable/DVariableResolver";
import MLTags from "../../../../Shared/TagGenerators/MLTags/MLTags";
import { Rating } from "primereact/rating";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";

const PDTPreview = ({ rowData }) => {
  const [value, setValue] = useState(null);
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
      <div className="flex m-1 p-2 mt-4">
        <div className="flex flex-column text-xs">
        <span className="text-gray-600 pb-2">Relevance</span>
          <Rating
            value={value}
            onChange={(e) => setValue(e.value)}
            cancel={false}
          />
        </div>
        <div className="flex flex-column text-xs ml-5">
          <span className="text-gray-600 pb-2">Accuracy</span>
          <Rating
            value={value}
            onChange={(e) => setValue(e.value)}
            cancel={false}
          />
        </div>
        <div className="flex ml-5 p-2">
          <Button
            label="Comments"
            icon="pi pi-comment"
            className="text-s"
            text
          />
        </div>
        <div className="flex ml-3 p-2">
          <Button
            label="Issues"
            icon="pi pi-exclamation-triangle"
            className="text-s"
            text
          />
        </div>
      </div>
    </div>
  );
};

export default observer(PDTPreview);
