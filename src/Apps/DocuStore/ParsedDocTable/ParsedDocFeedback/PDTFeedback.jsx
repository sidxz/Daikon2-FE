import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import { useState } from "react";
import PDTRevisions from "../components/PDTFooter/PDTRevisions";

const PDTFeedback = ({ rowData }) => {
  const [relevanceValue, setRelevanceValue] = useState(null);
  const [issueDialogVisible, setIssueDialogVisible] = useState(false);
  const [commentDialogVisible, setCommentDialogVisible] = useState(false);

  return (
    <>
      <div className="flex flex-column gap-1 w-full">
        <div className="flex gap-3 align-content-center flex-wrap">
          <div className="flex flex-column gap-2 align-items-center">
            <div className="flex flex-column">
              <Rating
                value={relevanceValue}
                onChange={(e) => setRelevanceValue(e.value)}
                cancel={false}
                stars={5}
                className="w-full"
              />
            </div>
            <div className="flex flex-column text-xs">
              <span className="text-gray-600">Summary Rating</span>
            </div>
          </div>

          <div className="flex flex-column pt-2">
            <Button
              label="Revisions (0)"
              icon="pi pi-exclamation-triangle"
              className="p-button-text p-button-sm"
              text
              onClick={() => setIssueDialogVisible(true)}
            />
          </div>

          <div className="flex flex-column pt-2">
            <Button
              label="Comments (0)"
              icon="pi pi-comment"
              className="p-button-text p-button-sm"
              text
              onClick={() => setIssueDialogVisible(true)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          {issueDialogVisible && <PDTRevisions />}
        </div>
      </div>
    </>
  );
};

export default observer(PDTFeedback);
