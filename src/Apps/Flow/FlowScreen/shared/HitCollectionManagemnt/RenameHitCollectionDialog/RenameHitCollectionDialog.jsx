import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Sidebar } from "primereact/sidebar";
import React from "react";
import { RootStoreContext } from "../../../../../../RootStore";
const RenameHitCollectionDialog = ({
  visible,
  setVisible,
  hitCollectionId,
  hitCollectionName,
}) => {
  const [prevName, setPrevName] = React.useState("");
  const [newName, setNewName] = React.useState("");
  const rootStore = React.useContext(RootStoreContext);
  const {
    renameHitCollection,
    isRenamingHitCollection,
    selectedHitCollection,
  } = rootStore.hitCollectionStore;

  const [hitCollectionType, setHitCollectionType] = React.useState(
    selectedHitCollection?.hitCollectionType || null,
  );
  return (
    <Sidebar
      className="bg-yellow-500"
      visible={visible}
      position="right"
      onHide={() => setVisible(false)}
    >
      <div className={"flex flex-column gap-3"}>
        <div className="flex text-2xl">WARNING</div>
        <div className="flex text-2xl font-bold">Rename Hit Collection</div>
        <div className="flex text-lg">
          Are you sure you want to rename the hit collection?
        </div>
        <div className="flex text-xl font-bold">{hitCollectionName}</div>
        <div className="flex text-lg">
          <InputText
            placeholder={`Type ${hitCollectionName}`}
            className="w-full"
            value={prevName}
            onChange={(e) => setPrevName(e.target.value)}
          />
        </div>
        <div className="flex text-lg">
          <InputText
            placeholder="New Name"
            className="w-full"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>

        <div className="flex text-lg">
          <Button
            severity="danger"
            disabled={prevName !== hitCollectionName}
            loading={isRenamingHitCollection}
            onClick={() =>
              renameHitCollection(hitCollectionId, newName).then(() => {
                setVisible(false);
              })
            }
            label="Rename Hit Collection"
          />
        </div>
      </div>
    </Sidebar>
  );
};

export default observer(RenameHitCollectionDialog);
