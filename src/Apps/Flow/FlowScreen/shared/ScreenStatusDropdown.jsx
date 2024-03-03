import { observer } from "mobx-react-lite";
import { BlockUI } from "primereact/blockui";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import React, { useContext, useState } from "react";
import {
  FcDataSheet,
  FcExpired,
  FcNeutralTrading,
  FcOk,
  FcPlanner,
} from "react-icons/fc";
import { GiVote } from "react-icons/gi";
import { RootStoreContext } from "../../../../RootStore";

/**
 * ScreenStatusDropdown component allows users to update the status of a screen.
 * The status of the screen can be updated to a predefined set of options,
 * with each option associated with an icon.
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.id - The id of the screen.
 * @param {string} props.status - The current status of the screen.
 * @param {boolean} props.readOnly - Whether the status can be updated or not.
 */

const ScreenStatusDropdown = ({
  id,
  readOnlyStatus = "NA",
  readOnly = false,
}) => {
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const rootStore = useContext(RootStoreContext);
  const { updateScreen, isUpdatingScreen, selectedScreen } =
    rootStore.screenStore;

  // Parameter check
  if (!id) return <></>;

  console.log("selectedScreenStatus", selectedScreen.status);

  // The set of available options for the status of a screen
  const statusOptions = [
    { name: "Planned", icon: <FcPlanner /> },
    { name: "Assay Development", icon: <FcDataSheet /> },
    { name: "Ongoing", icon: <FcNeutralTrading /> },
    { name: "Voting Ready", icon: <GiVote /> },
    { name: "Completed", icon: <FcOk /> },
  ];

  // Template for rendering a selected status option
  const optionTemplate = (option) => {
    if (option) {
      return (
        <div className="flex align-items-center align-self-center gap-2">
          <div className="flex flex-column">{option.icon}</div>
          <div className="flex flex-column">{option.name}</div>
        </div>
      );
    }
  };
  const valueTemplate = (option) => {
    if (option === null) {
      return (
        <div className="flex align-items-center align-self-center gap-2">
          <div className="flex flex-column">
            <FcExpired />
          </div>
          <div className="flex flex-column">Status Not Set</div>
        </div>
      );
    }
    if (option) {
      return (
        <div className="flex align-items-center align-self-center gap-2">
          <div className="flex flex-column">{option.icon}</div>
          <div className="flex flex-column">{option.name}</div>
        </div>
      );
    }
  };

  // Event handler for updating the selected status
  // and making the confirm dialog visible
  const handleStatusChange = (e) => {
    console.log(e.value);
    setSelectedStatus(e.value);
    setConfirmDialogVisible(true);
  };

  const updateSelectedStatus = () => {
    if (selectedStatus) {
      const updatedScreen = { ...selectedScreen, status: selectedStatus };
      updateScreen(updatedScreen);
    }
  };

  // Render the component based on readOnly flag
  // Temporarily handle new status as NA
  if (readOnly) {
    return (
      <div className="flex align-items-center gap-2 bg-white p-2 border-1 border-100 m-0">
        <div className="flex flex-column">
          {statusOptions.find((option) => option.name === readOnlyStatus)?.icon}
        </div>
        <div className="flex flex-column">
          {readOnlyStatus ? readOnlyStatus : "Not Available"}
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <BlockUI blocked={isUpdatingScreen}>
        <Dropdown
          value={selectedScreen.status}
          options={statusOptions}
          optionLabel="name"
          optionValue="name"
          placeholder="Set Status"
          itemTemplate={optionTemplate}
          valueTemplate={valueTemplate}
          disabled={isUpdatingScreen}
          onChange={handleStatusChange}
          pt={{
            root: { style: { border: "0px" } },
            input: { style: { paddingRight: "0px" } },
          }}
        />
      </BlockUI>
      <ConfirmDialog
        visible={confirmDialogVisible}
        onHide={() => setConfirmDialogVisible(false)}
        message={`Are you sure you want to change the status to ${selectedStatus}?`}
        header={`Confirmation -> ${selectedStatus}`}
        icon="icon icon-common icon-file-signature"
        accept={() => updateSelectedStatus()}
        reject={() => setConfirmDialogVisible(false)}
      />
    </div>
  );
};

export default observer(ScreenStatusDropdown);
