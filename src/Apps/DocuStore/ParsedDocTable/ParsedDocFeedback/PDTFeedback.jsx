import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Rating } from "primereact/rating";
import React, { useState } from "react";
import { DVariableResolver } from "../../../../Shared/DVariable/DVariableResolver";
import MLTags from "../../../../Shared/TagGenerators/MLTags/MLTags";
import PDTFIssues from "./PDTFIssues/PDTFIssues";

const PDTFeedback = ({ rowData }) => {
  const [relevanceValue, setRelevanceValue] = useState(null);
  const [accuracyValue, setAccuracyValue] = useState(null);
  const [issueDialogVisible, setIssueDialogVisible] = useState(false);
  const [commentDialogVisible, setCommentDialogVisible] = useState(false);

  return (
    <>
      <div className="flex flex-column gap-1 w-full">
        <div className="flex gap-3 align-content-center flex-wrap">
          <div className="flex flex-column text-xs">
            <span className="text-gray-600">Relevance</span>
            <Rating
              value={relevanceValue}
              onChange={(e) => setRelevanceValue(e.value)}
              cancel={false}
            />
          </div>
          <div className="flex flex-column text-xs">
            <span className="text-gray-600">Accuracy</span>
            <Rating
              value={accuracyValue}
              onChange={(e) => setAccuracyValue(e.value)}
              cancel={false}
            />
          </div>
          
          <div className="flex flex-column pt-2">
            <Button
              label="Revisions (0)"
              icon="pi pi-exclamation-triangle"
              className="p-button-text p-button-sm"
              text
              onClick={() => setIssueDialogVisible(false)}
            />
          </div>

          <div className="flex flex-column pt-2">
            <Button
              label="Comments (0)"
              icon="pi pi-comment"
              className="p-button-text p-button-sm"
              text
              onClick={() => setIssueDialogVisible(false)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <PDTFIssues />
        </div>
      </div>

      
    </>
  );
};

export default observer(PDTFeedback);
