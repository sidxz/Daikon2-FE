import { observer } from "mobx-react-lite";
import { Dropdown } from "primereact/dropdown";

import { ConfirmDialog } from "primereact/confirmdialog";
import React, { useContext, useEffect, useState } from "react";
import { FcDataSheet, FcNeutralTrading, FcOk, FcPlanner } from "react-icons/fc";
import { GiVote } from "react-icons/gi";
import { RootStoreContext } from "../../stores/rootStore";
import "./ScreenStatus.css";

/**
 * ScreenStatus component allows users to update the status of a screen.
 * The status of the screen can be updated to a predefined set of options,
 * with each option associated with an icon.
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.id - The id of the screen.
 * @param {string} props.status - The current status of the screen.
 * @param {boolean} props.readOnly - Whether the status can be updated or not.
 */
const ScreenStatus = ({ id, status, readOnly = false }) => {
  // Local state for managing the visibility of the confirm dialog
  // and the selected status
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(status);

  useEffect(() => {
    setSelectedStatus(status);
  }, [status]);

  // Accessing the necessary properties from the screenTStore
  const rootStore = useContext(RootStoreContext);
  const { isUpdatingScreenStatus, updateScreenStatus } = rootStore.screenTStore;

  // Parameter check
  if (!id || !status) return <></>;

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

  // Event handler for updating the selected status
  // and making the confirm dialog visible
  const handleStatusChange = (e) => {
    setSelectedStatus(e.value);
    setConfirmDialogVisible(true);
  };

  // Render the component based on readOnly flag
  // Temporarily handle new status as NA
  if (readOnly) {
    return (
      <div className="flex align-items-center gap-2 bg-white p-2 border-1 border-100 m-0">
        <div className="flex flex-column">
          {statusOptions.find((option) => option.name === status)?.icon}
        </div>
        <div className="flex flex-column">
          {status === "New" ? "NA" : status}
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Dropdown
        value={selectedStatus}
        options={statusOptions}
        optionLabel="name"
        optionValue="name"
        placeholder="Set Status"
        itemTemplate={optionTemplate}
        valueTemplate={optionTemplate}
        disabled={isUpdatingScreenStatus}
        onChange={handleStatusChange}
        className="align-items-center"
      />
      <ConfirmDialog
        visible={confirmDialogVisible}
        onHide={() => setConfirmDialogVisible(false)}
        message={`Are you sure you want to change the status to ${selectedStatus}?`}
        header={`Confirmation -> ${selectedStatus}`}
        icon="icon icon-common icon-file-signature"
        accept={() => updateScreenStatus(id, selectedStatus)}
        reject={() => setConfirmDialogVisible(false)}
      />
    </div>
  );
};

export default observer(ScreenStatus);
