import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { Rating } from "primereact/rating";
import { useContext, useEffect, useState } from "react";
import { RootStoreContext } from "../../../../../RootStore";
import { DVariableResolver } from "../../../../../Shared/DVariable/DVariableResolver";
import { countMeaningfulRevisions } from "../../../../../Shared/VersionTracker/CountMeaningfulRevisions";
import PDTRevisions from "./PDTRevisions";

const PDTFooter = ({ rowData }) => {
  console.log("PDTFooter rowData:", rowData);

  const rootStore = useContext(RootStoreContext);
  const {
    fetchDocsByTags,
    isFetchingDocs,
    docListByTags,
    docRevisionRegistry,
    editDoc,
    isEditingDoc,
  } = rootStore.parsedDocStore;
  const { user } = rootStore.authStore;

  const [revisionDialogVisible, setRevisionDialogVisible] = useState(false);
  const [EditDialogVisible, setEditDialogVisible] = useState(false);
  const [commentDialogVisible, setCommentDialogVisible] = useState(false);
  const [mutatedDoc, setMutatedDoc] = useState(rowData);
  const [pendingRating, setPendingRating] = useState(null);

  useEffect(() => {
    // let updatedData = { ...rowData };
    // updatedData.shortSummary = rowData.shortSummary || { value: "" };
    // updatedData.averageRating = rowData.averageRating || 0;
    // updatedData.ratings = rowData.ratings || [];
    setMutatedDoc(rowData);
  }, [rowData]);

  console.log("PDTFooter mutatedDoc:", mutatedDoc);

  if (isFetchingDocs) {
    return <div className="flex justify-content-center">Loading...</div>;
  }

  const revisionsCount =
    countMeaningfulRevisions(
      docRevisionRegistry.get(rowData.id),
      "ShortSummary"
    ) || 0;
  const revisions = docRevisionRegistry.get(rowData.id) || [];

  const handleRatingChange = async (newValue) => {
    const newRating = {
      score: newValue,
      userId: user.id,
    };

    let updatedRatings = [];
    if (Array.isArray(mutatedDoc.ratings)) {
      const existingIndex = mutatedDoc.ratings.findIndex(
        (r) => r.userId === user.id
      );

      if (existingIndex >= 0) {
        updatedRatings = [...mutatedDoc.ratings];
        updatedRatings[existingIndex] = newRating;
      } else {
        updatedRatings = [...mutatedDoc.ratings, newRating];
      }
    } else {
      updatedRatings = [newRating];
    }

    const updatedDoc = {
      ...mutatedDoc,
      ratings: updatedRatings,
    };

    await editDoc(rowData.id, updatedDoc);
    setMutatedDoc(updatedDoc); // backend will return updated averageRating if needed
  };

  return (
    <>
      <div className="flex flex-column gap-1 w-full">
        <div className="flex gap-3 align-content-center flex-wrap">
          <div className="flex flex-column gap-2 align-items-center">
            <div className="flex flex-column">
              <Rating
                value={mutatedDoc.averageRating || 0}
                onChange={(e) => handleRatingChange(e.value)}
                cancel={false}
                stars={5}
                className="w-full"
              />
            </div>
            <div className="flex flex-column text-xs">
              <span className="text-gray-600">AI Avg Summary Rating</span>
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
                // If there are no changes, just close the dialog
                if (
                  mutatedDoc.shortSummary.value === rowData.shortSummary.value
                ) {
                  setEditDialogVisible(false);
                  return;
                }

                editDoc(rowData.id, {
                  ...mutatedDoc,
                  shortSummary: mutatedDoc.shortSummary,
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
              value={DVariableResolver(mutatedDoc?.shortSummary)}
              onChange={(e) =>
                setMutatedDoc({
                  ...mutatedDoc,
                  shortSummary: {
                    ...mutatedDoc.shortSummary,
                    value: e.target.value,
                  },
                })
              }
            />
          </div>
        </div>
      </Dialog>
      <ConfirmDialog />
    </>
  );
};

export default observer(PDTFooter);
