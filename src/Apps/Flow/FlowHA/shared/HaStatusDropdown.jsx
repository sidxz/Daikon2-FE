import { observer } from "mobx-react-lite";
import { BlockUI } from "primereact/blockui";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import React, { useContext, useState } from "react";
import { FcExpired } from "react-icons/fc";

import { RootStoreContext } from "../../../../RootStore";
import { statusOptions } from "../constants/statusOptions";

const HaStatusDropdown = ({ readOnlyStatus, readOnly = false }) => {
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const rootStore = useContext(RootStoreContext);

  const { selectedHa, isUpdatingHa, updateHa } = rootStore.haStore;
  const statuses = statusOptions;
  // The set of available options for the status of a ha

  // Render the component based on readOnly flag
  // Temporarily handle new status as NA
  if (readOnly === true) {
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
    let status = statuses.find(
      (option) => option.value === readOnlyStatus
    )?.name;
    return (
      <div className="flex align-items-center gap-2 bg-white p-2 pl-3 pr-3 m-0 border-1 border-50 border-round-md">
        <div className="flex flex-column">
          {statuses.find((option) => option.value === readOnlyStatus)?.icon}
        </div>
        <div className="flex flex-column">
          {readOnlyStatus ? status : "Not Available"}
        </div>
      </div>
    );
  }
  if (!selectedHa) {
    return <> </>;
  }

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
    console.log(e);
    setSelectedStatus(e.value);
    setConfirmDialogVisible(true);
  };

  const updateSelectedStatus = () => {
    if (selectedStatus) {
      const updatedHa = { ...selectedHa, status: selectedStatus };
      updateHa(updatedHa);
    }
  };

  return (
    <div className="flex">
      <BlockUI blocked={isUpdatingHa}>
        <Dropdown
          value={selectedHa.status}
          options={statuses}
          optionLabel="name"
          optionValue="value"
          placeholder="Set Status"
          itemTemplate={optionTemplate}
          valueTemplate={valueTemplate}
          disabled={isUpdatingHa}
          onChange={handleStatusChange}
          pt={{
            root: { style: { border: "0px", borderRadius: "5rem" } },
            input: { style: { paddingRight: "0px" } },
          }}
        />
      </BlockUI>
      <ConfirmDialog
        visible={confirmDialogVisible}
        onHide={() => setConfirmDialogVisible(false)}
        message={`Are you sure you want to change the status to ${selectedStatus}?`}
        header={`HA Status Change Confirmation | ${selectedStatus}`}
        icon="icon icon-common icon-file-signature"
        accept={() => updateSelectedStatus()}
        reject={() => setConfirmDialogVisible(false)}
      />
    </div>
  );
};

export default observer(HaStatusDropdown);
