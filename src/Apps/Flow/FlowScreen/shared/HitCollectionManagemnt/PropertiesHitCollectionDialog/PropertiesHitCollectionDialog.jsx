import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Sidebar } from "primereact/sidebar";
import React from "react";
import { RootStoreContext } from "../../../../../../RootStore";
import InputScientist from "../../../../../../Shared/InputEditors/InputScientist";
import { hitCollectionTypeOptions } from "../../FSValues";
const PropertiesHitCollectionDialog = ({
  visible,
  setVisible,
  hitCollectionId,
  hitCollectionName,
}) => {
  const rootStore = React.useContext(RootStoreContext);
  const {
    updateHitCollection,
    isUpdatingHitCollection,
    selectedHitCollection,
  } = rootStore.hitCollectionStore;

  const [hitCollectionType, setHitCollectionType] = React.useState(
    selectedHitCollection?.hitCollectionType || null,
  );

  const [notes, setNotes] = React.useState(selectedHitCollection?.notes || "");
  const [owner, setOwner] = React.useState(selectedHitCollection?.owner || "");

  return (
    <Sidebar
      className="flex"
      visible={visible}
      position="right"
      onHide={() => setVisible(false)}
    >
      <div className={"flex flex-column gap-3"}>
        <div className="flex text-xl font-bold">{hitCollectionName}</div>

        <div className="field">
          <label htmlFor="hitCollectionType" className="font-bold mb-2 block">
            Hit Collection Type *
          </label>
          <Dropdown
            id="hitCollectionType"
            value={hitCollectionType}
            options={hitCollectionTypeOptions}
            onChange={(e) => setHitCollectionType(e.value)}
            placeholder="Select a Hit Collection Type"
            optionLabel="name"
            autoFocus
            className="w-full"
          />
        </div>

        <div className="field">
          <label htmlFor="notes" className="font-bold mb-2 block">
            Notes
          </label>
          <InputTextarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter notes"
            className="w-full"
          />
        </div>

        <div className="field">
          <label htmlFor="owner" className="font-bold mb-2 block">
            Owner
          </label>
          <InputScientist
            id="owner"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            placeholder="Enter owner"
            className="w-full"
          />
        </div>

        <div className="flex text-lg">
          <Button
            loading={isUpdatingHitCollection}
            onClick={() =>
              updateHitCollection({
                ...selectedHitCollection,
                hitCollectionType,
                notes,
                owner,
              }).then(() => {
                setVisible(false);
              })
            }
            label="Update Hit Collection"
          />
        </div>
      </div>
    </Sidebar>
  );
};

export default observer(PropertiesHitCollectionDialog);
