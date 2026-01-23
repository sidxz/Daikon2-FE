import { observer } from "mobx-react-lite";
import { BlockUI } from "primereact/blockui";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { RootStoreContext } from "../../../../../../RootStore";
import { AppOrgResolver } from "../../../../../../Shared/VariableResolvers/AppOrgResolver";

/*
 * Component: FSTbVSettings_Delete
 * Description: Provides UI to confirm and delete a selected screen.
 *              Includes validation input to prevent accidental deletion.
 */
const FHaVSettingsDelete = () => {
  const rootStore = useContext(RootStoreContext);
  const navigate = useNavigate();

  // Destructure store values
  const { selectedHa, isDeletingHa, isFetchingHa, deleteHa } =
    rootStore.haStore;

  const { getOrgNameById } = AppOrgResolver();

  // Local state for input validation
  const [confirmationInput, setConfirmationInput] = useState("");

  // Helper: Handles screen deletion
  const handleDelete = async () => {
    try {
      await deleteHa(selectedHa.id);
      navigate("/wf/ha/");
    } catch (error) {
      // Log error internally or send to monitoring tool
      console.error("Failed to delete ha:", error);
      // Optionally, display user-friendly error notification (Toast, Dialog, etc.)
    }
  };

  // Check if delete button should be disabled
  const isDeleteDisabled = !selectedHa || confirmationInput !== selectedHa.name;

  return (
    <BlockUI blocked={isDeletingHa || isFetchingHa}>
      <div className="flex flex-column w-full gap-2">
        {/* Warning message */}
        <div className="flex">
          Are you sure you want to delete this Hit Assessment? This action
          cannot be undone.
        </div>

        {/* Confirmation input */}
        <div className="flex">
          <InputText
            className="w-4"
            value={confirmationInput}
            placeholder="Enter Hit Assessment name to confirm"
            onChange={(e) => setConfirmationInput(e.target.value)}
          />
        </div>

        {/* Delete button */}
        <div className="flex">
          <Button
            text
            raised
            severity="danger"
            icon="icon icon-common icon-trash"
            type="button"
            label="DELETE"
            className="p-mt-2 w-2"
            loading={isDeletingHa}
            disabled={isDeleteDisabled}
            onClick={handleDelete}
          />
        </div>
      </div>
    </BlockUI>
  );
};

export default observer(FHaVSettingsDelete);
