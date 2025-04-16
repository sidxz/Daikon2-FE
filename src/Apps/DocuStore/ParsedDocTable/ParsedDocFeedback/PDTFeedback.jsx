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
              icon="pi pi-comment"
              label="Feedback (0)"
              className="p-button-text p-button-sm"
              text
              onClick={() => setCommentDialogVisible(true)}
            />
          </div>
          <div className="flex flex-column pt-2">
            <Button
              label="Issue (4)"
              icon="pi pi-exclamation-triangle"
              className="p-button-text p-button-sm"
              text
              onClick={() => setIssueDialogVisible(true)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <PDTFIssues />
        </div>
      </div>

      {/* Comment Dialog          */}
      <Dialog
        header="Feedback"
        visible={commentDialogVisible}
        maximizable
        style={{ width: "50vw" }}
        onHide={() => {
          setCommentDialogVisible(false);
        }}
      ></Dialog>

      {/* Issue Dialog */}
      <Dialog
        header="Summary Preview"
        visible={issueDialogVisible}
        maximizable
        style={{ width: "50vw" }}
        onHide={() => {
          setIssueDialogVisible(false);
        }}
      >
        <p className="m-0">
          <div className="flex text-justify	line-height-3 select-text">
            {DVariableResolver(rowData?.shortSummary)?.replace(/\*/g, " ")}
          </div>
          {rowData?.shortSummary?.value?.length > 0 && (
            <div className="flex border-0">
              <MLTags entity={rowData?.shortSummary} />
            </div>
          )}{" "}
        </p>
      </Dialog>
    </>
  );
};

export default observer(PDTFeedback);
