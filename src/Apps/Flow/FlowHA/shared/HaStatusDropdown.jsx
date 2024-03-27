import { observer } from "mobx-react-lite";
import { BlockUI } from "primereact/blockui";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import React, { useContext, useState } from "react";
import { FcAlarmClock, FcDisapprove, FcOk } from "react-icons/fc";

import { FaExclamationTriangle } from "react-icons/fa";
import { FcHighPriority } from "react-icons/fc";
import { RootStoreContext } from "../../../../RootStore";

const HaStatusDropdown = ({ readOnlyStatus, readOnly = false }) => {
  return <p>NOT IMPLEMENTED</p>;
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const rootStore = useContext(RootStoreContext);
  const { updateScreen, isUpdatingScreen, selectedScreen } =
    rootStore.screenStore;

  // The set of available options for the status of a screen
  const statusOptions = [
    { name: "Ready for HA", icon: <FcAlarmClock /> },
    { name: "Incorrect m/z", icon: <FaExclamationTriangle /> },
    { name: "Known Liability", icon: <FcHighPriority /> },
    { name: "Complete - Failed", icon: <FcDisapprove /> },
    { name: "Complete - Success", icon: <FcOk /> },
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
    if (readOnlyStatus === null) {
      return (
        <div className="flex align-items-center align-self-center gap-2">
          <div className="flex flex-column">
            <FcExpired />
          </div>
          <div className="flex flex-column">Status Not Set</div>
        </div>
      );
    }
    return (
      <div className="flex align-items-center gap-2 bg-white p-2 m-0">
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
        header={`Screening Status Change Confirmation | ${selectedStatus}`}
        icon="icon icon-common icon-file-signature"
        accept={() => updateSelectedStatus()}
        reject={() => setConfirmDialogVisible(false)}
      />
    </div>
  );
};

export default observer(HaStatusDropdown);
