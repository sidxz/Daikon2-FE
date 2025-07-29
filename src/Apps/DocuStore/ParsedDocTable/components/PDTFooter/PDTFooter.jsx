import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { Rating } from "primereact/rating";
import { useContext, useState } from "react";
import { RootStoreContext } from "../../../../../RootStore";
import { countMeaningfulRevisions } from "../../../../../Shared/VersionTracker/CountMeaningfulRevisions";
import PDTRevisions from "./PDTRevisions";

const PDTFooter = ({ rowData }) => {
  const rootStore = useContext(RootStoreContext);
  const {
    fetchDocsByTags,
    isFetchingDocs,
    docListByTags,
    docRevisionRegistry,
    editDoc,
    isEditingDoc,
  } = rootStore.parsedDocStore;

  const [relevanceValue, setRelevanceValue] = useState(null);
  const [revisionDialogVisible, setRevisionDialogVisible] = useState(false);
  const [EditDialogVisible, setEditDialogVisible] = useState(false);
  const [commentDialogVisible, setCommentDialogVisible] = useState(false);
  const [mutatedDoc, setMutatedDoc] = useState(rowData);

  if (isFetchingDocs) {
    return <div className="flex justify-content-center">Loading...</div>;
  }

  const revisionsCount =
    countMeaningfulRevisions(
      docRevisionRegistry.get(rowData.id),
      "ShortSummary"
    ) || 0;
  const revisions = docRevisionRegistry.get(rowData.id) || [];

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
              <span className="text-gray-600">AI Summary Rating</span>
            </div>
          </div>

          <div className="flex flex-column pt-2">
            <Button
              label={`Revisions (${revisionsCount})`}
              icon="pi pi-exclamation-triangle"
              className="p-button-text p-button-sm"
              text
              onClick={() => setRevisionDialogVisible(!revisionDialogVisible)}
            />
          </div>

          <div className="flex flex-column pt-2">
            <Button
              label="Comments (0)"
              icon="pi pi-comment"
              className="p-button-text p-button-sm"
              text
              onClick={() => setRevisionDialogVisible(true)}
            />
          </div>
          <div className="flex flex-column pt-2">
            <Button
              label={`Edit Summary`}
              icon="pi pi-exclamation-triangle"
              className="p-button-text p-button-sm"
              text
              onClick={() => setEditDialogVisible(!EditDialogVisible)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          {revisionDialogVisible && <PDTRevisions revisions={revisions} />}
        </div>
      </div>

      <Dialog
        header="Edit Summary"
        visible={EditDialogVisible}
        onHide={() => setEditDialogVisible(false)}
        className="w-9"
        footer={
          <div className="flex justify-content-end">
            <Button
              label="Save Changes"
              icon="pi pi-check"
              className="p-button-sm"
              onClick={() => {
                editDoc(rowData.id, {
                  ...mutatedDoc,
                  shortSummary: { value: mutatedDoc.shortSummary.value },
                });
                setEditDialogVisible(false);
              }}
              disabled={isEditingDoc}
            />
          </div>
        }
      >
        <div className="flex flex-column gap-2">
          <div className="flex flex-column gap-2">
            <InputTextarea
              autoResize
              className="w-full"
              type="text"
              value={mutatedDoc?.shortSummary?.value || ""}
              onChange={(e) =>
                setMutatedDoc({
                  ...mutatedDoc,
                  shortSummary: { value: e.target.value },
                })
              }
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default observer(PDTFooter);
