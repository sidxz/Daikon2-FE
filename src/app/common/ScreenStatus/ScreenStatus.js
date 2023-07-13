import { observer } from "mobx-react-lite";
import { Dropdown } from "primereact/dropdown";

import { ConfirmDialog } from "primereact/confirmdialog";
import React, { useContext, useState } from "react";
import { FcDataSheet, FcNeutralTrading, FcOk, FcPlanner } from "react-icons/fc";
import { GiVote } from "react-icons/gi";
import { RootStoreContext } from "../../stores/rootStore";
import "./ScreenStatus.css";

const ScreenStatus = ({ id, status }) => {
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(false);
  const rootStore = useContext(RootStoreContext);

  const { updatingScreenStatus, updateScreenStatus } = rootStore.screenStore;

  const optionsWithIcons = [
    { name: "Planned", icon: <FcPlanner /> },
    { name: "Assay Development", icon: <FcDataSheet /> },
    { name: "Ongoing", icon: <FcNeutralTrading /> },
    { name: "Voting Ready", icon: <GiVote /> },
    { name: "Completed", icon: <FcOk /> },
  ];

  const selectedItemTemplate = (option) => {
    if (option) {
      return (
        <div className="flex align-items-center gap-2">
          <div className="flex flex-column">{option.icon}</div>
          <div className="flex flex-column">{option.name}</div>
        </div>
      );
    }
  };

  let onStatusDropdownChange = (e) => {
    setSelectedStatus(e.value);
    setConfirmDialogVisible(true);
  };

  return (
    <div className="flex">
      <Dropdown
        value={status}
        optionLabel="name"
        optionValue="name"
        options={optionsWithIcons}
        placeholder="Set Status"
        itemTemplate={selectedItemTemplate}
        valueTemplate={selectedItemTemplate}
        disabled={updatingScreenStatus}
        onChange={(e) => {
          onStatusDropdownChange(e);
        }}
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
