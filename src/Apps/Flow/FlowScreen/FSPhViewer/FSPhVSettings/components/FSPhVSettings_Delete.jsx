import { observer } from "mobx-react-lite";
import { BlockUI } from "primereact/blockui";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { RootStoreContext } from "../../../../../../RootStore";
import { AppOrgResolver } from "../../../../../../Shared/VariableResolvers/AppOrgResolver";
import { GlobalValuesResolver } from "../../../../../../Shared/VariableResolvers/GlobalValuesResolver";

/*
 * Component: FSPhVSettings_Delete
 * Description: Provides UI to confirm and delete a selected screen.
 *              Includes validation input to prevent accidental deletion.
 */
const FSPhVSettings_Delete = () => {
  const rootStore = useContext(RootStoreContext);
  const navigate = useNavigate();

  // Destructure store values
  const { selectedScreen, isDeletingScreen, isFetchingScreen, deleteScreen } =
    rootStore.screenStore;

  const { getScreeningGlobals } = GlobalValuesResolver();
  const { getOrgNameById } = AppOrgResolver();

  // Local state for input validation
  const [confirmationInput, setConfirmationInput] = useState("");

  // Helper: Handles screen deletion
  const handleDelete = async () => {
    try {
      await deleteScreen(selectedScreen.id);
      navigate("/wf/screen/");
    } catch (error) {
      // Log error internally or send to monitoring tool
      console.error("Failed to delete screen:", error);
      // Optionally, display user-friendly error notification (Toast, Dialog, etc.)
    }
  };

  // Check if delete button should be disabled
  const isDeleteDisabled =
    !selectedScreen || confirmationInput !== selectedScreen.name;

  return (
    <BlockUI blocked={isDeletingScreen || isFetchingScreen}>
      <div className="flex flex-column w-full gap-2">
        {/* Warning message */}
        <div className="flex">
          Are you sure you want to delete this screen? This action cannot be
          undone.
        </div>

        {/* Confirmation input */}
        <div className="flex">
          <InputText
            className="w-4"
            value={confirmationInput}
            placeholder="Enter screen name to confirm"
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
            loading={isDeletingScreen}
            disabled={isDeleteDisabled}
            onClick={handleDelete}
          />
        </div>
      </div>
    </BlockUI>
  );
};

export default observer(FSPhVSettings_Delete);
