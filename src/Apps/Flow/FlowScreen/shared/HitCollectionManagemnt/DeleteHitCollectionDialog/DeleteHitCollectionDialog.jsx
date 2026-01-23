import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Sidebar } from "primereact/sidebar";
import React from "react";
import { useNavigate } from "react-router-dom";
import { RootStoreContext } from "../../../../../../RootStore";
const DeleteHitCollectionDialog = ({
  visible,
  setVisible,
  hitCollectionId,
  hitCollectionName,
  navigateToAfterDelete = "/wf/screen/",
}) => {
  const [confirmationName, setConfirmationName] = React.useState("");
  const rootStore = React.useContext(RootStoreContext);
  const { deleteHitCollection, isDeletingHitCollection } =
    rootStore.hitCollectionStore;
  const navigate = useNavigate();
  return (
    <Sidebar
      className="bg-red-500 text-white"
      visible={visible}
      position="right"
      onHide={() => setVisible(false)}
    >
      <div className={"flex flex-column gap-3"}>
        <div className="flex text-2xl">WARNING</div>
        <div className="flex text-2xl font-bold">Delete Hit Collection</div>
        <div className="flex text-lg">
          Are you sure you want to delete the hit collection? This action cannot
          be undone.
        </div>
        <div className="flex text-xl font-bold">{hitCollectionName}</div>
        <div className="flex text-lg">
          <InputText
            placeholder="Type the hit collection name to confirm"
            className="w-full"
            value={confirmationName}
            onChange={(e) => setConfirmationName(e.target.value)}
          />
        </div>
        <div className="flex text-lg">
          <Button
            severity="danger"
            disabled={confirmationName !== hitCollectionName}
            loading={isDeletingHitCollection}
            onClick={() =>
              deleteHitCollection(hitCollectionId).then(() => {
                setVisible(false);
                navigate(navigateToAfterDelete);
              })
            }
            label="Delete Hit Collection"
          />
        </div>
      </div>
    </Sidebar>
  );
};

export default observer(DeleteHitCollectionDialog);
