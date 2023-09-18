import { observer } from "mobx-react-lite";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";

import React, { useContext, useEffect, useState } from "react";
import { FcAlarmClock, FcDisapprove, FcOk } from "react-icons/fc";

import { FaExclamationTriangle } from "react-icons/fa";
import { FcHighPriority, FcWorkflow } from "react-icons/fc";
import { RootStoreContext } from "../../stores/rootStore";
/**
 * HAStatusDropDown component allows users to update the status of a HA Project.
 * The status of the project can be updated to a predefined set of options,
 * with each option associated with an icon.
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.id - The id of the screen.
 * @param {string} props.status - The current status of the screen.
 * @param {boolean} props.readOnly - Whether the status can be updated or not.
 */
const HAStatus = ({ id, status, readOnly = false }) => {
  // Local state for managing the visibility of the confirm dialog
  // and the selected status
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(status);

  useEffect(() => {
    setSelectedStatus(status);
  }, [status]);

  // Accessing the necessary properties from the screenTStore
  const rootStore = useContext(RootStoreContext);
  const { isUpdatingSubState, updateSubState } = rootStore.projectStore;
  if (!id) return <></>;

  // The set of available options for the status of a HA
  const statusOptions = [
    { name: "Ready for HA", value: "HA Ready", icon: <FcAlarmClock /> },
    { name: "Active", value: "HA Active", icon: <FcWorkflow /> },
    {
      name: "Incorrect m/z",
      value: "HA Incorrect m/z",
      icon: <FaExclamationTriangle />,
    },
    {
      name: "Known Liability",
      value: "HA Known Liability",
      icon: <FcHighPriority />,
    },
    {
      name: "Complete - Failed",
      value: "HA Complete Failed",
      icon: <FcDisapprove />,
    },
    {
      name: "Complete - Success",
      value: "HA Complete Success",
      icon: <FcOk />,
    },
  ];

  // Template for rendering a selected status option
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
      <div className="flex align-items-center gap-2 bg-white p-2 border-0 border-100 m-0">
        <div className="flex flex-column">
          {statusOptions.find((option) => option.value === status)?.icon}
        </div>
        <div className="flex flex-column">{status}</div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Dropdown
        value={status}
        options={statusOptions}
        optionLabel="name"
        optionValue="value"
        placeholder="Set Status"
        itemTemplate={optionTemplate}
        valueTemplate={optionTemplate}
        disabled={isUpdatingSubState}
        onChange={handleStatusChange}
        className="align-items-center"
      />
      <ConfirmDialog
        visible={confirmDialogVisible}
        onHide={() => setConfirmDialogVisible(false)}
        message={`Are you sure you want to change the status to ${selectedStatus}?`}
        header={`Confirmation -> ${selectedStatus}`}
        icon="icon icon-common icon-file-signature"
        accept={() =>
          updateSubState({
            subStateString: selectedStatus,
            stageString: "HA",
            projectId: id,
          })
        }
        reject={() => {
          setConfirmDialogVisible(false);
          setSelectedStatus(status);
        }}
      />
    </div>
  );
};

export default observer(HAStatus);
